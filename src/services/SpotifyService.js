import axios from "axios";
import {formatSpotifyTrack} from "../util/utils";

export function formatData(data) {
    try {
        return data.data.tracks.items.map((item) => formatSpotifyTrack(item))
    } catch (e) {
        return []
    }
}

class SpotifyService {

    async getPlaylistsForUsers(tokens) {
        const {accessToken, refreshToken} = tokens

        const {data} = await axios.get(`/api/spotify/user/playlists?access_token=${accessToken}&refresh_token=${refreshToken}`)
        console.log(data)
    }

    async requestAccessToken(input) {
        const {code} = input
        const {data} = await axios.post(`/api/spotify/authentication/callback`, {
            code,
        }).catch(function (error) {
            console.error(error)
            return {
                data: {
                    status: 400,
                    body: `requestAccessToken failed, here was error : ${error}`
                }
            }
        })
        
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

}

export default SpotifyService