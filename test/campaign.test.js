const assert = require('assert');
//assert = assertion testing
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();
	console.log(accounts);

	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({
			data: compiledFactory.bytecode,
		})
		.send({
			from: accounts[0],
			gas: '1000000',
		});

	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '1000000',
	});
	//the contract method are either call() or send()
	//factory is there above = new web3.eth.Contract();

	[campaignAddress] = await factory.methods.getDeployedCampaigns().call();
	//[campaignAddress] destructuring the array
	//[a,b,c, ...rest] = [1,2,3,4,5,6,7]
	//a = 1; rest = [4,5,6,7]
	console.log(`compiled contract address ${campaignAddress}`);
	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAddress
	);
});

describe('Campaigns', () => {
	it('deploys a factory and a campaign', () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it('marks caller as the campaign manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it('allows people to contribute money and marks them as approvals', async () => {
		await campaign.methods.contribute().send({
			from: accounts[1],
			value: '200',
		});
		const isContributor = await campaign.methods.approvers(accounts[1]).call();
		assert(isContributor);
	});

	it('requires a minimum contribution', async () => {
		try {
			await campaign.methods.contribute().send({
				value: '5',
				from: accounts[1],
			});
			assert(false);
		} catch (error) {
			assert(error);
		}
	});

	it('manager could create request', async () => {
		//the manager is being defined by the manager testing method
		await campaign.methods
			.createRequest('buy extra large dildo', '1000', accounts[1])
			.send({
				from: accounts[0],
				gas: '1000000',
			});

		const request = await campaign.methods.requests(0).call();

		assert.equal('buy extra large dildo', request.description);
	});

	it('sending out the money after the voting', async () => {
		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei('10', 'ether'),
		});

		await campaign.methods
			.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
			.send({ from: accounts[0], gas: '1000000' });

		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: '1000000',
		});

		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: '1000000',
		});

		let balance = await web3.eth.getBalance(accounts[1]);
		balance = web3.utils.fromWei(balance, 'ether');
		balance = parseFloat(balance);
		console.log(balance);
		assert(balance > 104);
	});
});
