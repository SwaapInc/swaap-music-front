import React from 'react';
import ReactDOM from 'react-dom';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger'
import * as reducers from "./modules/reducers";
import sagas from "./sagas/sagas";
import * as serviceWorker from './serviceWorker';
import App from './App';
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import SignUp from "./components/SignUp";
import NotFoundPage from "./components/NotFoundPage";
import Callback from "./components/Callback";
import {CookiesProvider} from "react-cookie";
import Footer from "./components/Footer";
import Header from "./components/Header";

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV === 'production') {
    middleware.push(logger)
}

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(...middleware),
);

sagas.forEach(saga => sagaMiddleware.run(saga))

ReactDOM.render(
    <Provider store={store}>
        <CookiesProvider>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={() => (
                        <Redirect to={'/private/'} />
                    )}/>
                    <Route path='/public/login' component={Login}/>
                    <Route path='/public/signUp' component={SignUp}/>
                    <Route path='/public/callback' component={Callback}/>
                    <PrivateRoute path='/private/' component={App}/>
                    <Route path="*" component={NotFoundPage} />
                    <Header/>
                    <Footer />
                </Switch>
            </BrowserRouter>
        </CookiesProvider>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
