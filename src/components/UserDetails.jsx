import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {detailUser, logoutUser} from "../modules/auth";
import {useCookies, withCookies} from "react-cookie";

const UserDetails = () => {
    const {user, showUserDetails} = useSelector(state => state.auth);
    const {token} = useSelector(state => state.localize);
    const dispatch = useDispatch()

    const [cookies, setCookie] = useCookies([
        'swaap_user_cookie',
        'swaap_spotify_access_token',
        'swaap_spotify_refresh_token',
        'swaap_deezer_access_token',
        'swaap_deezer_refresh_token'
    ]);

    return (
        <div id="kt_offcanvas_toolbar_profile"
             className={[
                 showUserDetails ? 'kt-offcanvas-panel--on' : '',
                 "kt-offcanvas-panel"
             ].join(' ')}
             style={{
                 zIndex: '1052',
                 opacity: "1",
             }}>
            <div className="kt-offcanvas-panel__head" kt-hidden-height="89" >
                <h1 className="kt-offcanvas-panel__title">
                    {token.profile}
                </h1>
                <div className="kt-offcanvas-panel__close" id="kt_offcanvas_toolbar_profile_close"
                     onClick={() => dispatch(detailUser())}>
                    <i className="flaticon2-delete"/>
                </div>
            </div>
            <div className="kt-offcanvas-panel__body kt-scroll ps ps--active-y"
                 style={{
                     overflow: "hidden",
                 }}>
                {user != null ? (
                    <div className="kt-user-card-v3 kt-margin-b-30">
                        <div className="kt-user-card-v3__avatar">
                            <img src="/dist/assets/media/users/jeremy_morvan.jpg" alt={user.pseudo}/>
                        </div>
                        <div className="kt-user-card-v3__detalis">
                            <div className="kt-user-card-v3__name">
                                {user.pseudo}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div/>
                )}
                <div className="kt-margin-t-40">
                    <button type="button" className="btn btn-brand btn-font-sm btn-upper btn-bold"
                        onClick={() => {
                            setCookie('swaap_user_cookie',undefined, {path: '/'})
                            dispatch(logoutUser())
                        }}>
                        {token.logout}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default withCookies(UserDetails)