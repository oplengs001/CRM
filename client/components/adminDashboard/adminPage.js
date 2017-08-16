import React from 'react';
import axios from 'axios';

import AdminTotalCampaings from './data/adminTotalCampaings';
import AdminTotalusers from './data/totalUsers';
import AdminTicketCompleted from './data/ticketCompleted';
import AdminUserEngagement from './data/userEngagment';
import Header from './partials/header';

class AdminPage extends React.Component {

	render() {
		return (
			<div>
				<AdminTotalCampaings />
				<AdminTotalusers />
				<AdminTicketCompleted />
				<AdminUserEngagement />
			</div>
		)
	}
}

export default AdminPage;