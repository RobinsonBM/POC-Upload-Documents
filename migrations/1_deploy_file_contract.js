const FileContract = artifacts.require('FileContract');

const nodeAddress = '0x211152ca21d5daedbcfbf61173886bbb1a217242';
const expiration = 1736394529;

module.exports = function (deployer) {
  deployer.deploy(FileContract, nodeAddress, expiration);
};
