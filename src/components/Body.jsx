import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {detailUser} from "../modules/auth";
import PlaylistManager from "./PlaylistManager";
import Playlist from "./Playlist";
import SavedPlaylist from "./SavedPlaylist";
import {resetSearch, toggleSearch} from "../modules/search";
import {resetPlaylist} from "../modules/playlistManager";

const Body = () => {
    const {user, playlistsDeezer, playlistsSpotify, playlistsSaved, showUserDetails, accessToken} = useSelector(state => state.auth);
    const {token} = useSelector(state => state.localize);
    const {searchBar} = useSelector(state => state.search)
    const dispatch = useDispatch()
    const scope = 'user-read-private user-read-email'
    const state = 'aaa'
    const ssoUrl = `https://accounts.spotify.com/authorize?`
        + `response_type=code&client_id=3a16f4201e6f4549b7b16283c35fe93c&scope=${scope}&`
        + `redirect_uri=https://swaap-music-front.heroku.com/public/callback&state=${state}`;

    return (
        <div className="kt-container kt-grid__item kt-grid__item--fluid kt-grid--hor" id="kt-content">
            <PlaylistManager/>
            <div className="kt-container  kt-grid__item kt-grid__item--fluid">
                <div className="row">
                    <div className="col">
                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">{token.your_playlists}</h3>
                                </div>
                            </div>
                            <div className="kt-portlet__body">
                                <div className="kt-section__content">
                                    <div className="kt-widget-2">
                                        <div className="kt-widget-2__content kt-portlet__space-x">
                                            <div className="row">
                                                {playlistsSaved.length ?
                                                    playlistsSaved
                                                        .map((playlist) => {
                                                                return (
                                                                    <SavedPlaylist playlist={playlist} key={playlist.id}/>
                                                                )
                                                            }
                                                        ) : (
                                                        <p>{token.missing_playlist.saved}</p>
                                                    )
                                                }
                                                {
                                                    user ? (
                                                        <div className="col-xl-2 justify-content-lg-center" align="center"
                                                             style={{
                                                                 paddingTop: '2rem'
                                                             }}
                                                        >
                                                            <div className="kt-widget-2__item" style={{
                                                                width: '120px',
                                                                height: '120px',
                                                            }}>
                                                                <div className="kt-media kt-media--xl"
                                                                     style={{
                                                                        paddingTop: '1rem',
                                                                    }}
                                                                >
                                                                    <button type="button" className="btn btn-lg btn-outline-brand btn-icon"
                                                                            style={{
                                                                                maxWidth: 200,
                                                                                whiteSpace: 'nowrap',
                                                                                textOverflow: 'ellipsis',
                                                                                overflow: 'hidden'
                                                                            }}
                                                                            onClick={() => {
                                                                                dispatch(resetSearch())
                                                                                dispatch(resetPlaylist())
                                                                                dispatch(toggleSearch())
                                                                            }}
                                                                    >
                                                                        <i className="flaticon2-add-1"/>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div/>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">{token.spotify}</h3>
                                </div>
                            </div>
                            <div className="kt-portlet__body">
                                <div className="kt-section__content">
                                    <div className="kt-section__content">
                                        <div className="kt-widget-2">
                                            <div className="kt-widget-2__content kt-portlet__space-x">
                                                <div className="row">
                                                    {
                                                        playlistsSpotify.length ? playlistsSpotify
                                                            .map((playlist) => {
                                                                return (
                                                                        <Playlist playlist={playlist} key={playlist.id} api={1}/>
                                                                    )
                                                                }
                                                            ) : (
                                                            <div className="nav nav-pills nav-tabs-btn nav-pills-btn-brand">
                                                                <p>{token.missing_playlist.spotify}</p>
                                                                {
                                                                    accessToken ? (
                                                                        <div/>
                                                                    ) : (
                                                                        <a href={ssoUrl} className="btn btn-brand btn-pill">
                                                                            <i className="fab fa-spotify"/>
                                                                            Spotify
                                                                        </a>
                                                                    )
                                                                }
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">{token.deezer}</h3>
                                </div>
                            </div>
                            <div className="kt-portlet__body">
                                <div className="kt-section__content">
                                    <div className="kt-section__content">
                                        <div className="kt-widget-2">
                                            <div className="kt-widget-2__content kt-portlet__space-x">
                                                <div className="row">
                                                    {
                                                        playlistsDeezer.length ? playlistsDeezer
                                                            .map((playlist, i) => {
                                                                return (
                                                                        <Playlist playlist={playlist} key={playlist.id} api={2}/>
                                                                    )
                                                                }
                                                            ) : (
                                                            <p>{token.missing_playlist.deezer}</p>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showUserDetails ? (
                <div className="kt-offcanvas-panel-overlay"
                     style={{
                         zIndex: '1052'
                     }}
                     onClick={() => dispatch(detailUser())}
                />
            ) : (
                <div/>
            )}
            {searchBar ? (
                <div className={[
                    searchBar ? 'show' : '',
                    "modal-backdrop fade"
                ].join(' ')}/>
            ) : (
                <div/>
            )}

        </div>
    )
}

export default Body