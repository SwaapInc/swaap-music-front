import {UPDATE_PLAYLIST_NAME} from "./playlistManager";

export const LOGIN = 'app/auth/LOGIN'
export const LOGIN_REQUEST = 'app/auth/LOGIN_REQUEST'
export const LOGOUT = 'app/auth/LOGOUT'
export const TOGGLE_LOADING = 'app/auth/LOADING'
export const USER_DETAILS = 'app/auth/USER_DETAILS'
export const INPUT_LOGIN = 'app/auth/INPUT_LOGIN'
export const INPUT_PWD = 'app/auth/INPUT_PWD'
export const SET_USER_STATE = 'app/auth/SET_USER_STATE'
export const SET_TOKEN_STATE = 'app/auth/SET_TOKEN_STATE'
export const UPDATE_USER_PLAYLISTS = "app/auth/UPDATE_USER_PLAYLISTS"
export const PLAYLISTS_API = "app/auth/PLAYLISTS_API"

export const setToken = (token) => ({
    type: SET_TOKEN_STATE,
    token,
})

export const setUser = (user) => ({
    type: SET_USER_STATE,
    user,
})

export const requestInputLogin = (input) => ({
    type: INPUT_LOGIN,
    input
})

export const requestInputPwd = (input) => ({
    type: INPUT_PWD,
    input
})

export const loginUser = (userInfo) => ({
    type: LOGIN,
    user: userInfo.user,
    playlistsDeezer: userInfo.playlistsDeezer,
    playlistsSpotify: userInfo.playlistsSpotify,
    playlistsSaved: userInfo.playlistsSaved,
})

export const playlistApi = (playlists) => ({
    type: PLAYLISTS_API,
    playlistsDeezer: playlists.playlistsDeezer,
    playlistsSpotify: playlists.playlistsSpotify,
})

export const logoutUser = () => ({
    type: LOGOUT,
})

export const toggleLoading = () => ({
    type: TOGGLE_LOADING,
})

export const requestLoginUser = (input) => ({
    type: LOGIN_REQUEST,
    input
})

export const updateUserPlaylists = (input) => ({
    type: UPDATE_USER_PLAYLISTS,
    playlistsSaved: input.playlistsSaved,
    ownerId: input.ownerId
})

export const detailUser = () => ({
    type: USER_DETAILS,
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
        tokens: {
            spotify: {
                accessToken: null,
                refreshToken: null,
            },
            deezer: {
                accessToken: null,
            },
        },
        login: '',
        pwd: '',
    },
    action,
) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.user,
                avatar: action.user.avatar,
                playlistsDeezer: action.playlistsDeezer ? action.playlistsDeezer : [],
                playlistsSpotify: action.playlistsSpotify ? action.playlistsSpotify : [],
                playlistsSaved: action.playlistsSaved ? action.playlistsSaved : [],
            }
        case UPDATE_USER_PLAYLISTS: {
            return {
                ...state,
                playlistsSaved: action.playlistsSaved
            }
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
                tokens: {
                    spotify: {
                        accessToken: null,
                        refreshToken: null,
                    },
                    deezer: {
                        accessToken: null,
                    },
                },
                login: '',
                pwd: '',
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
        case INPUT_LOGIN:
            return {
                ...state,
                login: action.input,
            }
        case INPUT_PWD:
            return {
                ...state,
                pwd: action.input,
            }
        case SET_USER_STATE:
            return {
                ...state,
                user: action.user !== undefined ? action.user : null
            }
        case SET_TOKEN_STATE:
            if(action.token) {
                const api = action.token.api
                const token = action.token.token
                let newTokens = {
                    ...state.tokens
                }
                newTokens[api][token] = action.token.value

                return {
                    ...state,
                    tokens: newTokens
                }
            }
        case PLAYLISTS_API :
            return {
                ...state,
                playlistsDeezer: action.playlistsDeezer ? action.playlistsDeezer : [],
                playlistsSpotify: action.playlistsSpotify ? action.playlistsSpotify : [],
            }
        default:
            return state
    }
}
