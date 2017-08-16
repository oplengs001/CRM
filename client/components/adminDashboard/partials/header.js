import React from 'react';
import axios from 'axios';

class Header extends React.Component {

	// const divStyle1 = {
	// 	height: '250px'
	// }

	// const divStyle2 = {
	// 	height: '275px'
	// }

	// const divStyle3 = {
	// 	width: '40%'
	// }

	// const divStyle4 = {
	// 	width: '65%'
	// }

	// const divStyle5 = {
	// 	width: '98%'
	// }

	// const divStyle6 = {
	// 	width: '10%'
	// }

	// const divStyle7 = {
	// 	width: '58%'
	// }

	// const divStyle8 = {
	// 	width: '85%'
	// }

	// const divStyle9 = {
	// 	width: '38%'
	// }

	constructor(props) {
		super(props);
		this.state = {
			TotalCampaigns : ''
		}
	}

	componentDidMount(){
		axios.get('/admin/accounts/api')
			 .then(res => {
			 	var jsonCount = Object.keys(res.data).length;
			 	this.setState({TotalCampaigns:jsonCount})
			 })
			 .catch(err => {
			 	console.log(err)
			 })
	}

	render() {
		return (
			<div className="page-header navbar navbar-fixed-top">
			           <div className="page-header-inner ">
			               <div className="page-logo">
			                   <a href="/admin">
			                       <img src="" alt="logo" className="logo-default" /> </a>
			                   <div className="menu-toggler sidebar-toggler"> </div>
			               </div>
			               <a href="javascript:;" className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"> </a>
			               <div className="top-menu">
			                   <ul className="nav navbar-nav pull-right">
			                       <li className="dropdown dropdown-extended dropdown-notification" id="header_notification_bar">
			                           <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
			                               <i className="icon-bell"></i>
			                               <span className="badge badge-default"> 7 </span>
			                           </a>
			                           <ul className="dropdown-menu">
			                               <li className="external">
			                                   <h3>
			                                       <span className="bold">12 pending</span> notifications</h3>
			                                   <a href="page_user_profile_1.html">view all</a>
			                               </li>
			                               <li>
			                                   <ul className="dropdown-menu-list scroller" height="250px" data-handle-color="#637283">
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">just now</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-success">
			                                                       <i className="fa fa-plus"></i>
			                                                   </span> New user registered. </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">3 mins</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-danger">
			                                                       <i className="fa fa-bolt"></i>
			                                                   </span> Server #12 overloaded. </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">10 mins</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-warning">
			                                                       <i className="fa fa-bell-o"></i>
			                                                   </span> Server #2 not responding. </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">14 hrs</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-info">
			                                                       <i className="fa fa-bullhorn"></i>
			                                                   </span> Application error. </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">2 days</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-danger">
			                                                       <i className="fa fa-bolt"></i>
			                                                   </span> Database overloaded 68%. </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">3 days</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-danger">
			                                                       <i className="fa fa-bolt"></i>
			                                                   </span> A user IP blocked. </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">4 days</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-warning">
			                                                       <i className="fa fa-bell-o"></i>
			                                                   </span> Storage Server #4 not responding dfdfdfd. </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">5 days</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-info">
			                                                       <i className="fa fa-bullhorn"></i>
			                                                   </span> System Error. </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="time">9 days</span>
			                                               <span className="details">
			                                                   <span className="label label-sm label-icon label-danger">
			                                                       <i className="fa fa-bolt"></i>
			                                                   </span> Storage server failed. </span>
			                                           </a>
			                                       </li>
			                                   </ul>
			                               </li>
			                           </ul>
			                       </li>
			                       <li className="dropdown dropdown-extended dropdown-tasks" id="header_task_bar">
			                           <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
			                               <i className="icon-calendar"></i>
			                               <span className="badge badge-default"> 3 </span>
			                           </a>
			                           <ul className="dropdown-menu extended tasks">
			                               <li className="external">
			                                   <h3>You have
			                                       <span className="bold">12 pending</span> tasks</h3>
			                                   <a href="app_todo.html">view all</a>
			                               </li>
			                               <li>
			                                   <ul className="dropdown-menu-list scroller" height='275px' data-handle-color="#637283">
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="task">
			                                                   <span className="desc">New release v1.2 </span>
			                                                   <span className="percent">30%</span>
			                                               </span>
			                                               <span className="progress">
			                                                   <span width='40%' className="progress-bar progress-bar-success" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
			                                                       <span className="sr-only">40% Complete</span>
			                                                   </span>
			                                               </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="task">
			                                                   <span className="desc">Application deployment</span>
			                                                   <span className="percent">65%</span>
			                                               </span>
			                                               <span className="progress">
			                                                   <span width='65%' className="progress-bar progress-bar-danger" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
			                                                       <span className="sr-only">65% Complete</span>
			                                                   </span>
			                                               </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="task">
			                                                   <span className="desc">Mobile app release</span>
			                                                   <span className="percent">98%</span>
			                                               </span>
			                                               <span className="progress">
			                                                   <span width='98%' className="progress-bar progress-bar-success" aria-valuenow="98" aria-valuemin="0" aria-valuemax="100">
			                                                       <span className="sr-only">98% Complete</span>
			                                                   </span>
			                                               </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="task">
			                                                   <span className="desc">Database migration</span>
			                                                   <span className="percent">10%</span>
			                                               </span>
			                                               <span className="progress">
			                                                   <span width='10%' className="progress-bar progress-bar-warning" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">
			                                                       <span className="sr-only">10% Complete</span>
			                                                   </span>
			                                               </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="task">
			                                                   <span className="desc">Web server upgrade</span>
			                                                   <span className="percent">58%</span>
			                                               </span>
			                                               <span className="progress">
			                                                   <span width='58%' className="progress-bar progress-bar-info" aria-valuenow="58" aria-valuemin="0" aria-valuemax="100">
			                                                       <span className="sr-only">58% Complete</span>
			                                                   </span>
			                                               </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="task">
			                                                   <span className="desc">Mobile development</span>
			                                                   <span className="percent">85%</span>
			                                               </span>
			                                               <span className="progress">
			                                                   <span width='85%' className="progress-bar progress-bar-success" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
			                                                       <span className="sr-only">85% Complete</span>
			                                                   </span>
			                                               </span>
			                                           </a>
			                                       </li>
			                                       <li>
			                                           <a href="javascript:;">
			                                               <span className="task">
			                                                   <span className="desc">New UI release</span>
			                                                   <span className="percent">38%</span>
			                                               </span>
			                                               <span className="progress progress-striped">
			                                                   <span width='38%' className="progress-bar progress-bar-important" aria-valuenow="18" aria-valuemin="0" aria-valuemax="100">
			                                                       <span className="sr-only">38% Complete</span>
			                                                   </span>
			                                               </span>
			                                           </a>
			                                       </li>
			                                   </ul>
			                               </li>
			                           </ul>
			                       </li>
			                       <li className="dropdown dropdown-user">
			                           <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
			                               <img alt="" className="img-circle" src="" />
			                               <span className="username username-hide-on-mobile"> </span>
			                               <i className="fa fa-angle-down"></i>
			                           </a>
			                           <ul className="dropdown-menu dropdown-menu-default">
			                               <li>
			                                   <a href="/admin/profile">
			                                       <i className="icon-user"></i> My Profile </a>
			                               </li>
			                               <li>
			                                   <a href="app_calendar.html">
			                                       <i className="icon-calendar"></i> My Calendar </a>
			                               </li>
			                               <li>
			                                   <a href="app_inbox.html">
			                                       <i className="icon-envelope-open"></i> My Inbox
			                                       <span className="badge badge-danger"> 3 </span>
			                                   </a>
			                               </li>
			                               <li>
			                                   <a href="app_todo.html">
			                                       <i className="icon-rocket"></i> My Tasks
			                                       <span className="badge badge-success"> 7 </span>
			                                   </a>
			                               </li>
			                               <li className="divider"> </li>
			                               <li>
			                                   <a href="page_user_lock_1.html">
			                                       <i className="icon-lock"></i> Lock Screen </a>
			                               </li>
			                               <li>
			                                   <a href="/users/logout">
			                                       <i className="icon-key"></i> Log Out </a>
			                               </li>
			                           </ul>
			                       </li>
			                       <li className="dropdown dropdown-quick-sidebar-toggler">
			                           <a href="javascript:;" className="dropdown-toggle">
			                               <i className="icon-logout"></i>
			                           </a>
			                       </li>
			                   </ul>
			               </div>
			           </div>
			       </div>
		)
	}
}

export default Header