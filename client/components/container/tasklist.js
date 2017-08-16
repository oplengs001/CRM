import React from 'react';
import axios from 'axios';

class TasksList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			intervalId : null,
			request : null,
			taskListData : []
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

	    axios.get('/admin/tasks/api')
	         .then(res => {
	          	this.setState({  
	         		taskListData : res.data 
	            });
	          })
	          .catch((err)=> {})
	}

	dateConvert(date){
		var date = new Date(date);
		var month = date.getMonth() + 1;
		var dt = date.getDay();
		var year = date.getFullYear();
		return(
			<div>{month}/{dt}/{year}</div>
		)
	}


	render() {

		const child = this.state.taskListData.map((task, i) => {
			return <div key={task._id}>
				<div className="mt-comments">
					<div className="mt-comment">
						<div className="mt-comment-img">
							<img src={task.assigned.path} width="40px"/>
						</div>
						<div className="mt-comment-body">
							<div className="mt-comment-info">
								<span className="mt-comment-author">{task.assigned.fullname}</span>
								<span className="mt-comment-date">{this.dateConvert(task.due_date)}</span>
							</div>
							<div className="mt-comment-text">{task.comments}</div>
							<div className="mt-comment-details">
								<span className="label label-sm label-success">{task.status}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		});

		return(
			<div>
				{child}
			</div>
		)
	}
}

export default TasksList;