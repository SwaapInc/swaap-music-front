import {put, takeEvery} from 'redux-saga/effects'
import {LOGIN_REQUEST, loginUser, toggleLoading} from "../modules/auth";
import UserService from "../services/UserService";
import {sleep} from "../util/utils";

function* requestLoginUser(input) {
    yield put(toggleLoading());
    const {username, password} = input.input
    const data = yield new UserService().authenticateUser({username,password})
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

export default function* authenticationSaga() {
    yield takeEvery(LOGIN_REQUEST, requestLoginUser);
}
