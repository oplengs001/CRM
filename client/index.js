import React from 'react';
import {render} from 'react-dom';
import thunk from 'redux-thunk';
import {createStore,applyMiddleware} from 'redux';
import App from './base'
import {Provider} from 'react-redux';

import Login from './components/login/LoginPage';

import TaskList from './components/container/tasklist'
//import ProjectMilestoneTask from './components/container/projectmilestonetask'

const store = createStore(
	(state = {}) => state,
	applyMiddleware(thunk)
);

render(
	<Provider store={store} >
		<App />
	</Provider>, document.getElementById('app')
)

render(
	<TaskList /> , document.getElementById('tasksList')
)
