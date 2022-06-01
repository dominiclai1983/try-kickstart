import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Routers } from '../../../routes';
import LayOut from '../../../components/Layout';
import { Router } from 'next/router';

class RequestNew extends Component {
	state = {
		value: '',
		description: '',
		recipient: '',
		loading: false,
		errorMessage: '',
	};

	static async getInitialProps(props) {
		const { address } = props.query;
		return { address };
	}

	onSubmit = async (event) => {
		event.preventDefault();

		const campaign = Campaign(this.props.address);
		const { description, value, recipient } = this.state;

		this.setState({
			loading: true,
			errorMessage: '',
		});

		try {
			const accounts = await web3.eth.getAccounts();
			const valueWei = await web3.utils.toWei(value, 'ether');
			await campaign.methods
				.createRequest(description, valueWei, recipient)
				.send({
					from: accounts[0],
				});

			Router.pushRoute(`/campaigns/${this.props.address}/requests`);
		} catch (err) {
			this.setState({
				errorMessage: err.message,
			});
		}
		this.setState({
			loading: false,
		});
	};

	render() {
		let { value, description, recipient, loading, errorMessage } = this.state;
		return (
			<LayOut>
				<Link route={`/campaigns/${this.props.address}/requests`}>
					<a>Back</a>
				</Link>
				<h3>Create a Request</h3>
				<Form onSubmit={this.onSubmit} error={!!errorMessage}>
					<Form.Field>
						<label>Description</label>
						<Input
							value={description}
							onChange={(event) => {
								this.setState({
									description: event.target.value,
								});
							}}
						/>
					</Form.Field>
					<Form.Field>
						<label>Value (Ether)</label>
						<Input
							value={value}
							onChange={(event) => {
								this.setState({
									value: event.target.value,
								});
							}}
						/>
					</Form.Field>
					<Form.Field>
						<label>Recipient</label>
						<Input
							value={recipient}
							onChange={(event) => {
								this.setState({
									recipient: event.target.value,
								});
							}}
						/>
					</Form.Field>
					<Message error header='Oops!' content={errorMessage} />
					<Button primary loading={loading}>
						Create!
					</Button>
				</Form>
			</LayOut>
		);
	}
}

export default RequestNew;
