const RealEstate = artifacts.require("./RealEstate.sol");

module.exports = (deployer) => {
  deployer.deploy(RealEstate);
};
