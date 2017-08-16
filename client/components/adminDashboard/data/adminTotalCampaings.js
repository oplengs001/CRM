import React from 'react';
import axios from 'axios';

class CampaingCount extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			intervalId: null,
			request: null,
			TotalCampaigns : null
		}
		this.fetchData = this.fetchData.bind(this)
	}

	getInitialState() {
	    return {
	        data: null
	    };
	}

	componentDidMount() {
	    this.intervalId = setInterval(this.fetchData, 1500);
	}

	componentWillUnmount() {
	   if (this.intervalId) {
	       clearInterval(this.intervalId)
	       this.intervalId = null;
	   }

	   if (this.request) {
	       this.request.abort();
	       this.request = null;
	   }
	}

	fetchData() {

	    axios.get('/admin/accounts/api')
	    	.then(res => {
	    		var jsonCount = Object.keys(res.data).length;
	    		this.setState({TotalCampaigns:jsonCount});
	    	}).catch(err => {
	    		console.log(err)
	    	})
	}

	render() {

	    return(
	    	<div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
	    	    <div className="dashboard-stat blue">
	    	        <div className="visual">
	    	            <i className="fa fa-comments"></i>
	    	        </div>
	    	        <div className="details">
	    	            <div className="number">
	    	                <span>{this.state.TotalCampaigns}</span>
	    	            </div>
	    	            <div className="desc"> Total Campaigns </div>
	    	        </div>
	    	        <a className="more" href="javascript:;"> View more
	    	            <i className="m-icon-swapright m-icon-white"></i>
	    	        </a>
	    	    </div>
	    	</div>
	    )
	}
};

export default CampaingCount