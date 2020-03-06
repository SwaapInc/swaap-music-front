import React, {useEffect} from 'react'
import { Redirect, Route } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {useCookies, withCookies} from "react-cookie";
import {setUser, setToken} from "../modules/auth";

function checkObject(user) {
    return user !== null && user !== undefined && user !== 'null' && user !== 'undefined'
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch()

    const [cookies, setCookie] = useCookies([
        'swaap_user_cookie',
        'swaap_spotify_access_token',
        'swaap_spotify_refresh_token',
        'swaap_deezer_access_token',
        'swaap_deezer_refresh_token'
    ]);

    useEffect(() => {
        try{
            if (checkObject(user)) {
                //if state.user defined, update swaap_user_cookie
                setCookie('swaap_user_cookie', user, { path: '/' })
            }
            if (checkObject(cookies.swaap_user_cookie)) {
                //if swaap_user_cookie defined, update state.user
                dispatch(setUser(cookies.swaap_user_cookie))
            }
        } catch (e) {
            console.error(e)
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