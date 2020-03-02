import {put, takeEvery} from 'redux-saga/effects'
import {resetForm, SIGN_UP_REQUEST} from "../modules/signup";
import {loginUser, toggleLoading} from "../modules/auth";
import UserService from "../services/UserService";

function* requestSignUpUser(input) {
    yield put(toggleLoading());
    const {username, password, first_name, name, email} = input.input
    const data = yield new UserService().signUpUser({
        username,
        password,
        first_name,
        name,
        email
    })

    if(data.status === 200) {
        const {user} = data
        yield put(loginUser ({
            user
        }))
    } else {
        console.error('Error')
        yield put(resetForm())
    }

    yield put(toggleLoading());
}

export default function* signupSaga() {
    yield takeEvery(SIGN_UP_REQUEST, requestSignUpUser);
}
