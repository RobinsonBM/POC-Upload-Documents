const FileContract = artifacts.require('FileContract');

module.exports = function (deployer) {
  deployer.deploy(FileContract);
};
