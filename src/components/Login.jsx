import React, {useEffect} from 'react'
import {
	Redirect
} from 'react-router-dom'
import {requestInputLogin, requestInputPwd, requestLoginUser} from "../modules/auth";
import {useDispatch, useSelector} from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import {useCookies} from "react-cookie";

const Login = (props) => {
	const dispatch = useDispatch()
	const { from } = props.location.state || { from: { pathname: '/private/' } }
	const {user, login, pwd} = useSelector(state => state.auth);
    const {token} = useSelector(state => state.localize);
    const scope = 'user-read-private user-read-email'
    const state = 'aaa'
    const ssoUrl = `https://accounts.spotify.com/authorize?`
        + `response_type=code&client_id=3a16f4201e6f4549b7b16283c35fe93c&scope=${scope}&`
        + `redirect_uri=https://swaap-music-front.herokuapp.com/public/callback&state=${state}`;

	if (user !== null) {
		return <Redirect to={from} />
	}

	return (
        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper kt-page">
            <Header />
            <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt-wrapper">
                <div className="kt-container kt-grid__item kt-grid__item--fluid kt-grid--hor"
                     style={{
                         maxWidth: "650px"
                     }}
                >
                    <div className="kt-portlet justify-content-lg-center"
                         style={{
                             minHeight: "350px"
                         }}
                    >
                        <div className="kt-portlet__head justify-content-lg-center"
                             style={{
                                 padding: "10px 0"
                             }}>
                            <div className="kt-portlet__head-label">
                                <div style={{
                                    fontWeight: "500",
                                    fontSize: "19.5px"
                                }}/>
                                <img alt="Logo" src="/dist/assets/media/logos/SWAAPblue.png"
                                    style={{
                                        width: "200px"
                                    }}/>
                            </div>
                        </div>
                        &nbsp;
                        <div className="kt-form" style={{
                            width: "75%",
                            margin: "2rem auto",
                        }}>
                            <div className="form-group">
                                <input className="form-control" type="text" placeholder={token.login_page.username}
                                       name="username" value={login}
                                       onChange={event => dispatch(requestInputLogin(event.target.value))}/>
                            </div>
                            <div className="form-group">
                                <input className="form-control" type="password" placeholder={token.login_page.password}
                                       name="password" value={pwd}
                                       onChange={event => dispatch(requestInputPwd(event.target.value))}/>
                            </div>
                            &nbsp;
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}>
                                <div className="kt-link kt-link--brand " style={{
                                    paddingTop: "15px"
                                }}>
                                    {token.login_page.forgot_password}
                                </div>
                                <div>
                                    <div className="btn btn-pill btn-outline-brand"
                                         id="kt_login_submit"
                                         onClick={() => props.history.push('/public/signup/')}>
                                        {token.login_page.sign_up}
                                    </div>
                                    <div className="btn btn-brand btn-elevate btn-pill"
                                         id="kt_login_submit"
                                         onClick={() => dispatch(requestLoginUser({
                                             username: login,
                                             password: pwd
                                         }))}>
                                        {token.login_page.sign_in}
                                    </div>
                                </div>
                            </div>
                            <div className="kt-separator kt-separator--space-lg  kt-separator--border-solid"/>
                            <div>
                                <button href={ssoUrl} className="btn btn-brand btn-pill">
                                    <i className="fab fa-spotify"/>
                                    Spotify
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Login