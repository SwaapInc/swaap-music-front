import {put, takeEvery} from 'redux-saga/effects'
import {SIGN_UP_REQUEST} from "../modules/signup";
import {toggleLoading} from "../modules/auth";
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

    console.log(data)

    yield put(toggleLoading());
}

export default function* signupSaga() {
    yield takeEvery(SIGN_UP_REQUEST, requestSignUpUser);
}
