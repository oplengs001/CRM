import React from 'react';
import {
	BrowserRouter as 
	Router,
	Route,
	Link
} from 'react-router-dom';

import Login from './components/login/LoginPage';
import AdminPage from './components/adminDashboard/adminPage'

const App = () => (
	<Router history={history}>
		<div>
			<Route exact path="/users/login" component={Login}/>
			<Route exact path="/admin/" component={AdminPage}/>
		</div>
	</Router>
);

export default App