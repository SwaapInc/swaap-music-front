import React from 'react'
import queryString from 'query-string'
import {requestSSOAuthentication} from "../modules/auth";
import {useDispatch} from "react-redux";

const Callback = (props) => {
    const {location} = props
    const {code, state} = queryString.parse(location.search);
    const dispatch = useDispatch();

    try {
        dispatch(requestSSOAuthentication({code, state}))
    } catch {
        console.log('SSO FAILED')
    } finally {
        props.history.push('/private')
    }


    return (
        <div>
            <p>{code}</p>
        </div>
    )
}


export default Callback;