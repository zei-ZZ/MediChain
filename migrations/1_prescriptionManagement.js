let PrescriptionManagement = artifacts.require("./PrescriptionManagement.sol");

module.exports = function (deployer) {
  deployer.deploy(PrescriptionManagement);
};
