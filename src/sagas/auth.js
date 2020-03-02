import {put, takeEvery} from 'redux-saga/effects'
import {LOGIN_REQUEST, loginUser, loginUserSSO, SSO_CONNEXION_REQUEST, toggleLoading} from "../modules/auth";
import UserService from "../services/UserService";
import {sleep} from "../util/utils";
import SpotifyService from "../services/SpotifyService";

/*
const fakePlayslists = {
    playlistsDeezer: [
        new Playlist(
            {
                name: 'Bain moussant',
                api: 2,
                id: '908622995',
                image: 'https://e-cdns-images.dzcdn.net/images/playlist/f50bfcf1df80d845b83a6213a61d6aa8/250x250-000000-80-0-0.jpg',
            }
        ),
        new Playlist(
            {
                name: 'Deezer Hits',
                api: 2,
                id: '1363560485',
                image: 'https://e-cdns-images.dzcdn.net/images/playlist/f454e1f4859261051b05308bcb0fa4b8/250x250-000000-80-0-0.jpg',
            }
        ),
    ],
    playlistsSpotify: [],
    playlistsSaved: [
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 1,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 2,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 3,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 4,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 5,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 6,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 7,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 8,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 9,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 10,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
        new PlaylistSaved(
            {
                name: "Hello_world",
                id: 11,
                tracks: [
                    {
                        spotify: "1DMEzmAoQIikcL52psptQL",
                        deezer: "572537052",
                    },
                    {
                        spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                        deezer: "119437636",
                    },
                    {
                        spotify: "0ScgmigVOJr2mFsAtwFQmz",
                        deezer: "2657826",
                    },
                    {
                        spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                        deezer: "104623136",
                    },
                ],
                image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
            }
        ),
    ]
}*/

function* requestLoginUser(input) {
    yield put(toggleLoading());
    const {username, password} = input.input
    const data = yield new UserService().authenticateUser({
        username,
        password
    })
    yield sleep(200);
    if(data.status === 200) {
        const {user, playlists} = data
        yield put(loginUser(
            {
                user,
                ...playlists
            }
        ));
    }
    yield put(toggleLoading());
}

function* requestSSOConnection (input) {
    const {code, state, api} = input.input
    const data = yield new SpotifyService().requestAccessToken({code, state})
    if(data.status === 400) {
        //todo gerer erreur
    } else {
        const {access_token, refresh_token} = data
        yield put(loginUserSSO({
            access_token,
            refresh_token,
        }))
    }
}

export default function* authenticationSaga() {
    yield takeEvery(LOGIN_REQUEST, requestLoginUser);
    yield takeEvery(SSO_CONNEXION_REQUEST, requestSSOConnection);
}