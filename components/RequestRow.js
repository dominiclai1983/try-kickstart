import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';

class RequestRow extends Component {
	render() {
		const { Row, Cell } = Table;
		let { id, request, approversCount } = this.props;
		return (
			<Row>
				<Cell>{id}</Cell>
				<Cell>{request.description}</Cell>
				<Cell>{web3.utils.fromWei(request[1])}</Cell>
				<Cell>{request.recipient}</Cell>
				<Cell>
					{request.approvalCount} / {approversCount}
				</Cell>
				<Cell></Cell>
				<Cell></Cell>
			</Row>
		);
	}
}

export default RequestRow;
