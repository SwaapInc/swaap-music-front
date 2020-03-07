import {put, takeEvery} from 'redux-saga/effects'
import RequestInBean from "../modeles/RequestInBean";
import DeezerService from "../services/DeezerService";
import SpotifyService from "../services/SpotifyService";
import {
    ADD_TO_PLAYLIST,
    GET_SAVED_PLAYLIST,
    SAVE_NEW_PLAYLIST,
    PLAYLISTS_INFOS,
    IMPORT_PLAYLIST,
    UPLOAD_PLAYLIST,
    addResultToPlaylist,
    convertPlaylistProgress,
    saveNewPlaylist,
} from "../modules/playlistManager";
import {playlistApi} from '../modules/auth'
import {toggleSearch} from '../modules/search'

async function getPlaylistTracksFromApi(input, spotifyService, deezerService) {
    switch (input.api) {
        case 1:
            return spotifyService.getPlaylistTracks({
                                                        url: `/api/spotify/get/playlists/${input.id}`,
                                                        limit: 100,
                                                        offset: input.length,
                                                    })
        case 2:
            return deezerService.getPlaylistTracks({
                                                       url: `/api/deezer/get/playlists/${input.id}`,
                                                       limit: 100,
                                                       offset: input.length,
                                                   })
        default:
            return null
    }
}

async function getPlaylistFullFromApi(input, spotifyService, deezerService) {
    switch (input.api) {
        case 1:
            return spotifyService.getPlaylistFull(`/api/spotify/get/playlists/${input.id}`)
        case 2:
            return deezerService.getPlaylistFull(`/api/deezer/get/playlist/${input.id}`)
        default:
            return null
    }
}

function* importSavedPlaylistFromId(input) {
    const {tracks, id, playlistName, image} = input.savedPlaylist
    const total = tracks.length
    const spotifyService = new SpotifyService()
    const deezerService = new DeezerService()

    let playlist = []

    for (let index in tracks) {
        let track = tracks[index]
        const dataSpotify = yield spotifyService.getTrackFromId(track.spotify)
        const dataDeezer = yield deezerService.getTrackFromId(track.deezer)

        playlist = [
            ...playlist,
            {
                dataDeezer,
                dataSpotify,
            }
        ]

        yield put(convertPlaylistProgress({
                                              playlist,
                                              progress: (tracks.length / total) * 100,
                                              id,
                                              playlistName,
                                              image,
                                                api: 0,
                                          }))
    }

    yield put(convertPlaylistProgress({
        playlist,
        progress: 100,
        id,
        playlistName,
        image,
        api: 0
    }))

}

// function* saveNewPlaylist(input) {
//     const {playlist} = input.input
//
//     const playlistService = new PlaylistService()
//     const {data} = playlistService.createPlaylist(playlist)
// }

function* addTrackToPlaylist(input) {
    const {track, api, trackCorrelation} = input
    const artists = track.artists
    const title = track.name
    const album = track.album.name

    const requestInBean = new RequestInBean(title, album, artists)
    let tracksFromApis, tuple

    switch (api) {
        case 1:
            tuple = trackCorrelation.filter((tuple) => tuple.dataSpotify === track.id)
            let deezer
            if (tuple.length > 0) {
                deezer = yield new DeezerService().getTrackFromId(tuple[0].dataDeezer)
            } else {
                deezer =
                    yield new DeezerService().searchTrackFromCompleteRequestInBean(requestInBean)
            }

            if (deezer === false) {
                tracksFromApis = {}
                //TODO : manage missing Track from Deezer
            } else {
                tracksFromApis = {
                    spotify: track,
                    deezer,
                }
            }

            break;
        case 2:
            tuple = trackCorrelation.filter((tuple) => tuple.dataDeezer === track.id)
            let spotify
            if (tuple.length > 0) {
                spotify = yield new SpotifyService().getTrackFromId(tuple[0].dataDeezer)
            } else {
                spotify = yield new SpotifyService().searchTrackFromCompleteRequestInBean(requestInBean)
            }

            if (spotify === false) {
                tracksFromApis = {}
                //TODO : manage missing Track from Spotify
            } else {
                tracksFromApis = {
                    spotify,
                    deezer: track,
                }
            }
            break;
        default:
            tracksFromApis = {
                spotify: {},
                deezer: {},
            }
    }
    yield put(addResultToPlaylist(tracksFromApis))
}

function* importPlaylistFromId(input) {
    const {api, id, image} = input.api
    const spotifyService = new SpotifyService()
    const deezerService = new DeezerService()

    let res = {
        items: [],
        total: 1,
    }
    let requestInBean

    let playlist = []

    const playlistFull = yield getPlaylistFullFromApi({
                                                          api,
                                                          id,
                                                      }, spotifyService, deezerService)

    let tracks = playlistFull.items
    const {total, playlistName} = playlistFull

    while (tracks.length < total) {
        res = yield getPlaylistTracksFromApi({
                                                 api,
                                                 length: tracks.length,
                                                 id,
                                             }, spotifyService, deezerService)
        tracks = [
            ...tracks,
            ...res.items,
        ]
    }

    switch (api) {
        case 1 :
            for (const index in tracks) {
                const track = tracks[index]

                requestInBean = new RequestInBean(track.name, track.album, track.artists)
                const dataDeezer = yield new DeezerService().searchTrackFromCompleteRequestInBean(
                    requestInBean)
                if (dataDeezer) {
                    playlist = [
                        ...playlist,
                        {
                            dataDeezer,
                            dataSpotify: track,
                        }
                    ]
                    yield put(convertPlaylistProgress({
                        playlist,
                        progress: (playlist.length / total) * 100,
                        id,
                        playlistName,
                        image,
                        api,
                    }))
                }
            }
            break;
        case 2 :
            for (const index in tracks) {
                const track = tracks[index]

                requestInBean = new RequestInBean(track.name, track.album, track.artists)
                const dataSpotify = yield new SpotifyService().searchTrackFromCompleteRequestInBean(
                    requestInBean)
                if (dataSpotify) {
                    playlist = [
                        ...playlist,
                        {
                            dataSpotify,
                            dataDeezer: track,
                        }
                    ]
                    yield put(convertPlaylistProgress({
                        playlist,
                        progress: (playlist.length / total) * 100,
                        id,
                        playlistName,
                        image,
                        api
                    }))
                }
            }
            break;
        default:
            //manage error
            break;
    }
    yield put(convertPlaylistProgress({
        playlist,
        progress: 100,
        id,
        playlistName,
        image,
        api
    }))
}

function* getPlaylistsInfos(tokens) {
    const {spotify, deezer} = tokens.tokens

    const playlistsSpotify = yield new SpotifyService().getPlaylistsForUsers(spotify)
    const playlistsDeezer = yield new DeezerService().getPlaylistsForUsers(deezer)

    yield put(playlistApi({
        playlistsSpotify,
        playlistsDeezer,
    }))
}

function* uploadPlaylist(playlistInfos) {
    const {api, playlists, playlistName, playlistId, playlistApi, tokens} = playlistInfos.playlistInfos
    switch (api) {
        case 1:
            const spotifyService = new SpotifyService()
            const playlistToExportToSpotify = playlists.map((item) => item.dataSpotify.id)
            let finalSpotifyPlaylistId = ""
            if(!playlistId || playlistApi !== 1) {
                //creation
                const userSpotifyId = yield spotifyService.getUserId(tokens.spotify)
                const newPlaylistId = yield spotifyService.createPlaylistForUser({
                    tokens: tokens.spotify,
                    id: userSpotifyId,
                    playlistName
                })
                finalSpotifyPlaylistId = newPlaylistId
            } else {
                finalSpotifyPlaylistId = playlistId
            }

            const updateStatusSpotify = yield spotifyService.updatePlaylist({
                tokens: tokens.spotify,
                playlist: playlistToExportToSpotify,
                playlistId: finalSpotifyPlaylistId
            })

            if (updateStatusSpotify.status === 201) {
                //todo notify upload successful
                yield put(toggleSearch())
            } else {
                //todo notify upload failed
                console.error(updateStatusSpotify)
            }


        case 2 :
            const deezerService = new DeezerService()
            const playlistToExportToDeezer = playlists.map((item) => item.dataDeezer.id)
            let finalPlaylistDeezerId = ""
            if(!playlistId || playlistApi !== 2) {
                //creation
                const newPlaylistId = yield deezerService.createPlaylistForUser({
                    tokens: tokens.spotify,
                    playlistName
                })
                finalPlaylistDeezerId = newPlaylistId
            } else {
                finalPlaylistDeezerId = playlistId
            }

            const updateStatusDeezer = yield deezerService.updatePlaylist({
                tokens: tokens.deezer,
                playlist: playlistToExportToDeezer,
                playlistId: finalPlaylistDeezerId
            })

            if (updateStatusDeezer.status === 201) {
                //todo notify upload successful
                yield put(toggleSearch())
            } else {
                //todo notify upload failed
                console.error(updateStatusDeezer)
            }

        default :
            return []
    }
}

export default function* manageAddPlaylist() {
    yield takeEvery(ADD_TO_PLAYLIST, addTrackToPlaylist)
    yield takeEvery(IMPORT_PLAYLIST, importPlaylistFromId)
    yield takeEvery(GET_SAVED_PLAYLIST, importSavedPlaylistFromId)
    yield takeEvery(SAVE_NEW_PLAYLIST, saveNewPlaylist)
    yield takeEvery(PLAYLISTS_INFOS, getPlaylistsInfos)
    yield takeEvery(UPLOAD_PLAYLIST, uploadPlaylist)
}
