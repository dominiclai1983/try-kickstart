import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import LayOut from '../components/Layout';
import { Link } from '../routes';

import 'semantic-ui-css/semantic.min.css';

class CampaignIndex extends Component {
	static async getInitialProps() {
		const campaigns = await factory.methods.getDeployedCampaigns().call();

		return { campaigns };
		//it has to return as an object
		//static is the requirement of the next.js
	}

	//we are not using componentDidMount() because it would
	//run on the browser only

	renderCampaigns() {
		const items = this.props.campaigns.map((campaign) => {
			return {
				header: campaign,
				description: (
					<Link route={`/campaigns/${campaign}`}>
						<a>View Campaign</a>
					</Link>
				),
				fluid: true,
			};
		});

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<LayOut>
				<h3>Open Campaigns</h3>
				<Link route='/campaigns/new'>
					<a>
						<Button
							floated='right'
							content='Create Campaign'
							icon='add circle'
							primary
						/>
					</a>
				</Link>
				{this.renderCampaigns()}
			</LayOut>
		);
	}
}

export default CampaignIndex;
