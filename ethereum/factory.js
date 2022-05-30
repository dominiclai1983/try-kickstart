import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0x96dE30F2A9DF0dc16b60AE3FeCF57F82B24C5B4C'
);

export default instance;
