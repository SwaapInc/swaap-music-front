import React from 'react';

import './App.css';
import './components/Header';
import Body from "./components/Body";
import UserDetails from "./components/UserDetails";
import Footer from "./components/Footer";
import Header from "./components/Header";

const App = () => {
    return (
        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
            <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt-wrapper">
                <div>
                    <Header/>
                    <Body/>
                    <UserDetails/>
                    <Footer/>
                </div>
            </div>
        </div>
    )
};

export default App;
