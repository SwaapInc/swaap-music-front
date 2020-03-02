import React, {useEffect} from 'react'
import { Redirect, Route } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {useCookies, withCookies} from "react-cookie";
import {setUser, setToken} from "../modules/auth";

function checkUser(user) {
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
        if (checkUser(user)) {
            setCookie('swaap_user_cookie', user)
        }
        if (checkUser(cookies.swaap_user_cookie)) {
            dispatch(setUser(cookies.swaap_user_cookie))
        }

        if(tokens.spotify.accessToken) {
            setCookie('swaap_spotify_access_token', tokens.spotify.accessToken)
            setCookie('swaap_spotify_refresh_token', tokens.spotify.refreshToken)
        }

        if (!tokens.spotify.accessToken) {
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

        if(tokens.deezer.accessToken) {
            setCookie('swaap_deezer_access_token', tokens.deezer.accessToken)
            setCookie('swaap_deezer_refresh_token', tokens.deezer.refreshToken)
        }

        if (!tokens.deezer.accessToken) {
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
                checkUser(user) ? (
                    <Component/>
                ) : (
                    <Redirect to={{ pathname: '/public/login', state: { from: props.location }}} />
                )
        )}/>
    )
}

export default withCookies(PrivateRoute)