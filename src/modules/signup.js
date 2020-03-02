export const INPUT_USERNAME = 'app/signup/INPUT_USERNAME'
export const INPUT_PASSWORD = 'app/signup/INPUT_PASSWORD'
export const INPUT_FIRSTNAME = 'app/signup/INPUT_FIRSTNAME'
export const INPUT_LASTNAME = 'app/signup/INPUT_LASTNAME'
export const INPUT_EMAIL = 'app/signup/INPUT_EMAIL'
export const SIGN_UP_REQUEST = 'app/signup/SIGN_UP_REQUEST'
export const RESET_FORM = 'app/signup/SIGN_UP_REQUEST'

const DEFAULT_STATE = {
    username: '',
    password: '',
    first_name: '',
    name: '',
    email: ''
}

export const requestSignUpUser = (input) => ({
    type: SIGN_UP_REQUEST,
    input
})

export const resetForm = () => ({
    type: RESET_FORM,
})

export const requestInputUsername = (input) => ({
    type: INPUT_USERNAME,
    input

})
export const requestInputPassword = (input) => ({
    type: INPUT_PASSWORD,
    input

})
export const requestInputFirstname = (input) => ({
    type: INPUT_FIRSTNAME,
    input

})
export const requestInputLastname = (input) => ({
    type: INPUT_LASTNAME,
    input

})
export const requestInputEmail = (input) => ({
    type: INPUT_EMAIL,
    input

})

    export default function reducer(
    state = DEFAULT_STATE,
    action,
) {
    switch (action.type) {
        case INPUT_USERNAME:
            return {
                ...state,
                username: action.input
            }
        case INPUT_PASSWORD:
            return {
                ...state,
                password: action.input
            }
        case INPUT_FIRSTNAME:
            return {
                ...state,
                first_name: action.input
            }
        case INPUT_LASTNAME:
            return {
                ...state,
                name: action.input
            }
        case INPUT_EMAIL:
            return {
                ...state,
                email: action.input
            }
        case RESET_FORM:
            return DEFAULT_STATE
        default:
            return state;
    }
}