const HDWalletProvider = require('@truffle/hdwallet-provider');
//calling the wallet
const Web3 = require('web3');
const compliedFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
	'cross fitness coach clinic february talk repair furnace cancel lucky trap nice',
	// remember to change this to your own phrase!
	'https://rinkeby.infura.io/v3/a22d55dd49374831aa6e9cc49422c16b'
	// remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('Attempting to deploy from account', accounts[0]);

	const result = await new web3.eth.Contract(
		JSON.parse(compliedFactory.interface)
	)
		.deploy({ data: compliedFactory.bytecode })
		.send({ gas: '1000000', from: accounts[0] });

	console.log('Factory contract deployed to', result.options.address);
	provider.engine.stop();
};
deploy();
