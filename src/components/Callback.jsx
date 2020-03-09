import React, {useEffect} from 'react'
import queryString from 'query-string'
import {setToken} from "../modules/auth";
import {useDispatch} from "react-redux";
import SpotifyService from "../services/SpotifyService";
import DeezerService from "../services/DeezerService";

const Callback = (props) => {
    const {location} = props
    const {code, state} = queryString.parse(location.search);
    const dispatch = useDispatch();

    async function requestSSOAuthentication(input) {
        const {code, state} = input
        switch(state) {
            case '1' :
                const dataSpotify = await new SpotifyService().requestAccessToken({code, state})
                if(dataSpotify.status === 400) {
                    console.error(dataSpotify.body)
                    return {
                        accessToken: {
                            api: 'spotify',
                            token: 'accessToken',
                            value: null
                        },
                        refreshToken: {
                            api: 'spotify',
                            token: 'refreshToken',
                            value: null
                        }
                    }
                } else {
                    const {access_token, refresh_token} = dataSpotify.tokens
                    return {
                        accessToken: {
                            api: 'spotify',
                            token: 'accessToken',
                            value: access_token
                        },
                        refreshToken: {
                            api: 'spotify',
                            token: 'refreshToken',
                            value: refresh_token
                        }
                    }
                }
                break;
            case '2' :
                const dataDeezer = await new DeezerService().requestAccessToken({code, state})
                if(dataDeezer.status === 400) {
                    console.error(dataDeezer.body)
                    return {
                        accessToken: {
                            api: 'deezer',
                            token: 'accessToken',
                            value: null
                        }
                    }
                } else {
                    const {access_token} = dataDeezer.tokens
                    return {
                        accessToken: {
                            api: 'deezer',
                            token: 'accessToken',
                            value: access_token
                        }
                    }
                }
                break;
            default:
                return {}
        }
    }

    useEffect(() =>
        {
            try {
                requestSSOAuthentication({code, state})
                    .then((res) => {
                        dispatch(setToken(res.accessToken))
                        dispatch(setToken(res.refreshToken))
                        props.history.push('/private/home')
                    })
            } catch (e) {
                console.error(`SSO failed : ${e}`)
                props.history.push('/private/home')
            }
        }, []
    )

    return (
        <div/>
    )
}

export default Callback;
