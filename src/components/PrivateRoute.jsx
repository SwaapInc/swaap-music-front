import React, {useEffect} from 'react'
import { Redirect, Route } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {useCookies, withCookies} from "react-cookie";
import {setUser, setToken} from "../modules/auth";

function checkObject(user) {
    return user !== null && user !== undefined && user !== 'null' && user !== 'undefined'
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const {user, tokens} = useSelector(state => state.auth);
    const dispatch = useDispatch()

    const [cookies, setCookie] = useCookies([
        'swaap_user_cookie',
        'swaap_spotify_access_token',
        'swaap_spotify_refresh_token',
        'swaap_deezer_access_token',
        'swaap_deezer_refresh_token'
    ]);

    useEffect(() => {
        if (checkObject(user)) {
            //if state.user defined, update swaap_user_cookie
            setCookie('swaap_user_cookie', user, { path: '/private' })
        }
        if (checkObject(cookies.swaap_user_cookie)) {
            //if swaap_user_cookie defined, update state.user
            dispatch(setUser(cookies.swaap_user_cookie))
        }

        if(checkObject(tokens.spotify.accessToken)) {
            //if state.tokens.spotify.accessToken defined, set cookies
            setCookie('swaap_spotify_access_token', tokens.spotify.accessToken, { path: '/private' })
            setCookie('swaap_spotify_refresh_token', tokens.spotify.refreshToken, { path: '/private' })
        }

        if (checkObject(cookies.swaap_spotify_access_token)) {
            //if swaap_spotify_access_token defined, set state.tokens.spotify.tokens
            dispatch(setToken({
                api: 'spotify',
                token: 'accessToken',
                value: cookies.swaap_spotify_access_token
            }))
            dispatch(setToken({
                api: 'spotify',
                token: 'refreshToken',
                value: cookies.swaap_spotify_refresh_token
            }))
        }

        if(checkObject(tokens.deezer.accessToken)) {
            //if state.tokens.deezer.accessToken defined, set cookies
            setCookie('swaap_deezer_access_token', tokens.deezer.accessToken, { path: '/private' })
            setCookie('swaap_deezer_refresh_token', tokens.deezer.refreshToken, { path: '/private' })
        }

        if (checkObject(cookies.swaap_deezer_access_token)) {
            //if swaap_spotify_access_token defined, set state.tokens.spotify.tokens
            dispatch(setToken({
                api: 'deezer',
                token: 'accessToken',
                value: cookies.swaap_deezer_access_token
            }))
            dispatch(setToken({
                api: 'deezer',
                token: 'refreshToken',
                value: cookies.swaap_deezer_refresh_token
            }))
        }

    }, [])

    return (
        <Route {...rest} render={(props) => (
                checkObject(user) ? (
                    <Component/>
                ) : (
                    <Redirect to={{ pathname: '/public/login', state: { from: props.location }}} />
                )
        )}/>
    )
}

export default withCookies(PrivateRoute)