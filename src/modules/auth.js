export const LOGIN = 'app/auth/LOGIN'
export const LOGIN_SSO = 'app/auth/LOGIN'
export const LOGIN_REQUEST = 'app/auth/LOGIN_REQUEST'
export const LOGOUT = 'app/auth/LOGOUT'
export const TOGGLE_LOADING = 'app/auth/LOADING'
export const USER_DETAILS = 'app/auth/USER_DETAILS'
export const SSO_CONNEXION_REQUEST = 'app/auth/SSO_CONNEXION'

export const loginUser = (userInfo) => ({
    type: LOGIN,
    user: userInfo.user,
    playlistsDeezer: userInfo.playlistsDeezer,
    playlistsSpotify: userInfo.playlistsSpotify,
    playlistsSaved: userInfo.playlistsSaved,
})

export const loginUserSSO = (tokens) => ({
    type: LOGIN_SSO,
    accessToken: tokens.access_token,
    refreshToken: tokens.access_token,
})

export const logoutUser = () => ({
    type: LOGOUT,
})

export const toggleLoading = () => ({
    type: TOGGLE_LOADING,
})

export const requestLoginUser = () => ({
    type: LOGIN_REQUEST,
})

export const detailUser = () => ({
    type: USER_DETAILS,
})


export const requestSSOAuthentication = (input) => ({
    type: SSO_CONNEXION_REQUEST,
    input,
})

export default function reducer(
    state = {
        user: null,
        loading: false,
        showUserDetails: false,
        playlistsDeezer: [],
        playlistsSpotify: [],
        playlistsSaved: [],
        avatar: "'/dist/assets/media/users/default.jpg'",
        accessToken: '',
        refreshToken: '',

    },
    action,
) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.user,
                avatar: action.user.avatar,
                playlistsDeezer: action.playlistsDeezer,
                playlistsSpotify: action.playlistsSpotify,
                playlistsSaved: action.playlistsSaved,
            }
        case LOGIN_SSO:
            return {
                ...state,
                accessToken: action.accessToken,
                refreshToken: action.refresh_token,
            }
        case LOGOUT:
            return {
                ...state,
                user: null,
                avatar: "'/dist/assets/media/users/default.jpg'",
                showUserDetails: false,
                playlistsDeezer: [],
                playlistsSpotify: [],
                playlistsSaved: [],
                accessToken: '',
                refreshToken: '',
            }
        case TOGGLE_LOADING:
            return {
                ...state,
                loading: !state.loading,
            }
        case USER_DETAILS:
            return {
                ...state,
                showUserDetails: !state.showUserDetails,
            }
        default:
            return state
    }
}