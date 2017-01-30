import React from "react";
// import {Route} from "react-router";
import { Router, Route, Link, browserHistory } from 'react-router'
import Home from "./components/home";
import Test from "./components/test";

export const routes = (
	<Router history={browserHistory}>
		<Route path="/" component={Test}/>
		<Route path="/test" component={Test} />
	</Router>
);
