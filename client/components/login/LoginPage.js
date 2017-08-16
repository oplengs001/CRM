import React from 'react';
import axios from 'axios';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username : '',
			password : ''
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange(e){
		this.setState({[e.target.name] : e.target.value});
	}
	onSubmit(e){
		e.preventDefault();
		var data = this.state;
		axios.post('/users/login',data)
			 .then(function(response){
			 	if ( response.data == 'admin') {
			 		window.location = '/admin'
			 	} else {
			 		window.location = '/home'
			 	}
			 })
			 .catch(function(error){
			 	console.log(error);
			 });
	}

	render() {
		const {userLoginRequest} = this.props;
		return (
			<form onSubmit={this.onSubmit}>
			    <div className="form-group m-b-15">
			        <input 
			        	value={this.state.username}
			        	onChange={this.onChange}
			        	type="text" 
			        	name="username"
			        	className="form-control input-lg"
			        	placeholder="Username" 
			        />
			    </div>
			    <div className="form-group m-b-15">
			        <input 
			        	value={this.state.password}
			        	onChange={this.onChange}
				        type="password"
				        name="password"
				        className="form-control input-lg"
				        placeholder="Password" 
			       	/>
			    </div>
			    <div className="checkbox m-b-30">
			        <label>
			            <input type="checkbox" /> Remember Me
			        </label>
			    </div>
			    <div className="login-buttons">
			        <button type="submit" className="btn btn-success btn-block btn-lg">Sign me in</button>
			    </div>
			    <hr />
			    <p className="text-center text-inverse">
			        &copy; Pro Source Global BPO Right Reserved 2017
			    </p>
			</form>
		)
	}
}


export default LoginForm