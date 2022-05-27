import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
	// We are in the browser and metamask is running.
	window.ethereum.request({ method: 'eth_requestAccounts' });
	web3 = new Web3(window.ethereum);
} else {
	// We are on the server *OR* the user is not running metamask
	const provider = new Web3.providers.HttpProvider(
		'https://rinkeby.infura.io/v3/a22d55dd49374831aa6e9cc49422c16b'
	);
	web3 = new Web3(provider);
}

export default web3;

//this file will be ran for two times. 1. at next.js server 2. at browser
