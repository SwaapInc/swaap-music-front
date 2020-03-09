import axios from "axios";

class PlaylistService {
    async createPlaylist(playlist) {
        const {data} = await axios.post(`/api/playlists`, playlist)
            .catch(function (error) {
                console.error(error)
            })

        return data
    }

    async getPlaylistsForUsers (ownerId) {
        const result = await axios.get(`/api/user/${ownerId}/playlists`)
            .catch(function (error) {
            console.log(error)
        })
        return result.data
    }

    async updatePlaylist(playlist, ownerId) {
        playlist.ownerId = ownerId
        let newDBPlaylist
        if (!playlist.idDb) {
            newDBPlaylist =  await axios
                .post('/api/playlists', playlist)
                .catch(function(error) {
                console.log(error)
            })
        } else {
            newDBPlaylist = await axios
                .put(`/api/playlists/${playlist.idDb}`, playlist)
                .catch(function(error) {
                    console.log(error)
                })
        }
        // ajout des musiques de la playlist en base
        await axios
            .put(`/api/tracks/${newDBPlaylist.data.id}`, playlist)
            .catch(function (error) {
                console.error(error)
            })
            .finally( () => console.log("update playlist OK"))


    }
}

export default PlaylistService
