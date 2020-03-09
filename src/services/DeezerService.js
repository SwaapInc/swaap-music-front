import {formatDeezerTrack} from "../util/utils";
import axios from "axios";
import Playlist from "../modeles/Playlist";

function formatData(data) {
    try {
        return data.data.data.map((item) => formatDeezerTrack(item))
    } catch (e) {
        return []
    }
}

class DeezerService {

    async getPlaylistsForUsers(tokens) {
        if(tokens) {
            const {accessToken} = tokens

            const {data} = await axios.get(`/api/deezer/user/playlists?access_token=${accessToken}`)

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
        const {data} = await axios.post(`/api/deezer/authentication/callback`, {code})
        return data
    }

    async searchTrackFromCompleteRequestInBean(requestInBean) {
        const {title, album, artist} = requestInBean

        let res = await axios.get(`/api/deezer/search/advanced?artist=${artist.name}&title=${title}&album=${album.name}&type=track`, {})
            .catch(function (error) {
                console.error(error)
            })
        if(res === null){
            res = await axios.get(`/api/deezer/search/advanced?artist=${artist.name}&title=${title}&type=track`, {})
                .catch(function (error) {
                    console.error(error)
                })
        }

        const data = formatData(res)
        return data.length === 0 ? false : data[0]
    }

    async searchTrackBasic(searchValue) {
        const res = await axios.get(`/api/deezer/search?q=${searchValue}&type=track`, {}).catch(function (error) {
            console.error(error);
        });

        return formatData(res)
    }

    async getTrackFromId(id) {
        const {data} = await axios.get(`/api/deezer/get/track/${id}`, {}).catch(function (error) {
            console.error(error);
        });

        return formatDeezerTrack(data)
    }

    async getPlaylistFull(url) {

        const res = await axios.get(`${url}`, {}).catch(function (error) {
            console.error(error);
        });

        const items = res.data.tracks.data.map((item) => formatDeezerTrack(item))

        return {
            items,
            total: res.data.nb_tracks,
            playlistName: res.data.title,
        }
    }

    async getPlaylistTracks(search) {
        let {url, limit, offset} = search
        const {data} = await axios.get(`${url}/tracks?limit=${limit}&offset=${offset}`, {}).catch(function (error) {
            console.error(error);
        });

        const items = data.data.map((item) => formatDeezerTrack(item))

        return {
            items,
            total: data.total,
        }
    }

    async createPlaylistForUser(input) {
        const {tokens, playlistName} = input
        const {accessToken} = tokens
        const {data} = await axios.post(`/api/deezer/user/playlists`, {
            accessToken,
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
        while(currentTrack < trackNumber) {
            //add what's left
            playlistTemp = playlist.slice(currentTrack, cpt * 75)
            res = await axios.post(`/api/deezer/playlists`, {
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
            currentTrack+= 75
        }

        if(res.status === 201 && res.status === 200) {
            return {
                status: 201,
                message: `update of playlist ${playlistId} successful`
            }
        } else {
            return {
                status: res.status,
                message: res.body,
            }
        }
    }
}

export default DeezerService