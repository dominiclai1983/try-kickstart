import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0x05cea917202070fbfe211f5c2a4e1c120d46d21f'
);

export default instance;
