import React from 'react';
import axios from 'axios';

class TotalTickets extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			totalTickets : 549
		}
	}

	// componentDidMount(){
	// 	axios.get('')
	// 		 .then(res => {
	// 		 	var jsonCount = Object.keys(res.data).length;
	// 		 	this.setState({totalUsers:jsonCount})
	// 		 })
	// 		 .catch(err => {
	// 		 	console.log(err)
	// 		 })
	// }

	render() {
		return (
			<div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
			    <div className="dashboard-stat green">
			        <div className="visual">
			            <i className="fa fa-shopping-cart"></i>
			        </div>
			        <div className="details">
			            <div className="number">
			                <span data-counter="counterup" data-value={this.state.totalTickets}>0</span>
			            </div>
			            <div className="desc"> Tickets Completed </div>
			        </div>
			        <a className="more" href="javascript:;"> View more
			            <i className="m-icon-swapright m-icon-white"></i>
			        </a>
			    </div>
			</div>
		)
	}
}

export default TotalTickets