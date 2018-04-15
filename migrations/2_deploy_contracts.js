var Ipfs  = artifacts.require("./Ipfs.sol");

module.exports = (deployer) => {
  deployer.deploy(Ipfs);
}

