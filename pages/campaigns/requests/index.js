import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import LayOut from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;
		const campaign = Campaign(address);
		const requestCount = Number(
			await campaign.methods.getRequestsCount().call()
		);
		const approversCount = await campaign.methods.approversCount().call();

		const requests = await Promise.all(
			Array(requestCount)
				.fill()
				.map((item, index) => {
					return campaign.methods.requests(index).call();
				})
		);

		console.log(requests);

		return { address, requests, requestCount, approversCount };
	}

	renderRow() {
		let { approversCount, address } = this.props;

		return this.props.requests.map((request, index) => {
			return (
				<RequestRow
					request={request}
					key={index}
					id={index}
					approversCount={approversCount}
					address={address}
				/>
			);
		});
	}

	render() {
		let { address } = this.props;
		let { Header, Row, HeaderCell, Body } = Table;

		return (
			<LayOut>
				<h3>Requests</h3>
				<Link route={`/campaigns/${address}/requests/new`}>
					<a>
						<Button primary>Add Requests</Button>
					</a>
				</Link>
				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Recipient</HeaderCell>
							<HeaderCell>Approval Count</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>
					<Body>{this.renderRow()}</Body>
				</Table>
			</LayOut>
		);
	}
}

export default RequestIndex;
