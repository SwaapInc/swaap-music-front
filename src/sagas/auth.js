import {put, takeEvery} from 'redux-saga/effects'
import {LOGIN_REQUEST, loginUser, setToken, SSO_CONNEXION_REQUEST, toggleLoading} from "../modules/auth";
import UserService from "../services/UserService";
import {sleep} from "../util/utils";
import SpotifyService from "../services/SpotifyService";
import DeezerService from "../services/DeezerService";

function* requestLoginUser(input) {
    yield put(toggleLoading());
    const {username, password} = input.input
    const data = yield new UserService().authenticateUser({
                                                              username,
                                                              password
                                                          })
    yield sleep(200);
    if (data.status === 200) {
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
    const {code, state} = input.input
    switch(state) {
        case '1' :
            const dataSpotify = yield new SpotifyService().requestAccessToken({code, state})
            if(dataSpotify.status === 400) {
                console.error(dataSpotify.body)
                yield put(setToken({
                    access_token: null,
                    refresh_token: null,
                }))
            } else {
                const {access_token, refresh_token} = dataSpotify.tokens
                yield put(setToken({
                    access_token,
                    refresh_token,
                    api: 'spotify',
                }))
            }
            break;
        case '2' :
            const dataDeezer = yield new DeezerService().requestAccessToken({code, state})

            if(dataDeezer.status === 400) {
                console.error(dataDeezer.body)
                yield put(setToken({
                    access_token: null,
                    refresh_token: null,
                    api: 'deezer',
                }))
            } else {
                const {access_token, refresh_token} = dataDeezer.tokens
                yield put(setToken({
                    access_token,
                    refresh_token,
                }))
            }
            break;
        default:
            break;
    }
}

export default function* authenticationSaga() {
    yield takeEvery(LOGIN_REQUEST, requestLoginUser);
    yield takeEvery(SSO_CONNEXION_REQUEST, requestSSOConnection);
}
