/* 
modules need for the compile
path to make the path
fs (filestream) to read the file
solc is the compiler code

this code should be 
*/

const path = require('path');
const fs = require('fs-extra');
/* fs-extra is not node.js build in function. it is coming from 
a npm package fs-extra
*/
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
//removing the folder build. this method is coming from npm package fs-extra

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);
//check path exist, if not, create
console.log(output);
for (let contract in output) {
	fs.outputJsonSync(
		path.resolve(buildPath, contract.replace(':', '') + '.json'),
		output[contract]
		//2nd parameter is the things that we would like to write into the json file
	);
}
