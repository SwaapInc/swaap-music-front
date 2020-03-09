import axios from "axios";
import {formatSpotifyTrack} from "../util/utils";
import Playlist from "../modeles/Playlist";

export function formatData(data) {
    try {
        return data.data.tracks.items.map((item) => formatSpotifyTrack(item))
    } catch (e) {
        return []
    }
}

class SpotifyService {

    async getPlaylistsForUsers(tokens) {
        if(tokens) {
            const {accessToken, refreshToken} = tokens

            const {data} = await axios.get(`/api/spotify/user/playlists?access_token=${accessToken}&refresh_token=${refreshToken}`)

            if(data.status === 200) {
                return data.body.map(item => new Playlist(item))
            } else {
                return []
            }
        }
        return []
    }

    async requestAccessToken(input) {
        const {code} = input
        const {data} = await axios.post(`/api/spotify/authentication/callback`, {code})
        return data
    }

    async searchTrackFromCompleteRequestInBean(requestInBean) {
        const {title, album, artist} = requestInBean

        let res = await axios.get(`/api/spotify/search/advanced?artist=${artist.name}&title=${title}&album=${album.name}&type=track`, {})
            .catch(function (error) {
                console.error(error)
                return null
            })
        if(res === null){
            res = await axios.get(`/api/spotify/search/advanced?artist=${artist.name}&title=${title}&type=track`, {})
                .catch(function (error) {
                    console.error(error)
                    return {
                        status: 400,
                        body: `searchTrackFromCompleteRequestInBean failed, here was search parameters : "title: ${title}", "album: ${album}", "artist: ${artist}"`
                    }
                })
        }

        if(res.status === 400) {
            return false
        } else {
            const data = formatData(res)
            return data.length === 0 ? false : data[0]
        }
    }

    async searchTrackBasic(searchValue) {
        const res = await axios.get(`/api/spotify/search?q=${searchValue}&type=track`, {}).catch(function (error) {
            console.error(error);
            return {
                status: 400,
                body: `error during basic search track, here was searchValue : '${searchValue}', error : ${error}`
            }
        });

        if(res.status === 400) {
            return {}
        } else {
            return formatData(res)
        }
    }

    async getPlaylistFull(url) {
        const res = await axios.get(`${url}`, {}).catch(function (error) {
            console.error(error);
            return {
                status: 400,
                body: `error during getPlaylistFull, here was url : '${url}', error : ${error}`
            }
        });

        if(res.status === 400) {
            return {
                items: [],
                total: 0,
                playlistName: '',
            }
        } else {
            const items = res.data.tracks.items.map((item) => formatSpotifyTrack(item.track))

            return {
                items,
                total: res.data.tracks.total,
                playlistName: res.data.name,
            }
        }
    }

    async getPlaylistTracks(search) {
        let {url, limit, offset} = search

        const playlistFull = await axios.get(`${url}`, {}).catch(function (error) {
            console.error(error);
        });

        const res = await axios.get(`${url}/tracks?limit=${limit}&offset=${offset}`, {}).catch(function (error) {
            console.error(error);
        });

        const items = res.data.items.map((item) => formatSpotifyTrack(item.track))

        return {
            items,
            total: res.data.total,
            playlistName: playlistFull.name,
        }
    }

    async getTrackFromId(id) {
        const res = await axios.get(`/api/spotify/get/tracks/${id}`, {}).catch(function (error) {
            console.error(error);
            return {
                status: 400,
                body: `getTrackFromId failed, here was spotify track id : ${id}, here was error : ${error}`
            }
        });

        if(res.status === 400) {
            return {}
        } else {
            return formatSpotifyTrack(res.data)
        }
    }

    async getUserId(tokens) {
        const {accessToken} = tokens
        const {data} = await axios.get(`/api/spotify/user?access_token=${accessToken}`, {}).catch(function (error) {
            console.error(error);
        });
        if (data.status === 200) {
            return data.body.id
        } else {
            return null
        }
    }

    async createPlaylistForUser(input) {
        const {tokens, id, playlistName} = input
        const {accessToken} = tokens

        const {data} = await axios.post(`/api/spotify/user/playlists`, {
            accessToken,
            userId: id,
            playlistName
        }).catch(function (error) {
            console.error(error);
        });
        if (data.status === 201) {
            return data.body.id
        } else {
            return null
        }
    }

    async updatePlaylist(input) {
        const {tokens, playlist, playlistId} = input
        const {accessToken} = tokens
        let currentTrack = 0,
            cpt = 1
        let trackNumber = playlist.length
        let res
        let playlistTemp

        while(currentTrack <= trackNumber) {
            //add what's left
            playlistTemp = playlist.slice(currentTrack, cpt * 75)
            res = await axios.post(`/api/spotify/playlists`, {
                accessToken,
                playlistId,
                playlist: playlistTemp
            }).catch(function (error) {
                return {
                    status: 400,
                    body: `update of playlist ${playlistId} failed, here was error : ${error}`
                }
            })
            cpt++
            currentTrack += 75
        }

        if(res.status !== 201 && res.status !== 200) {
            return {
                status: res.status,
                message: res.body,
            }
        } else {
            return {
                status: 201,
                message: `update of playlist ${playlistId} successful`
            }
        }
    }


}

export default SpotifyService