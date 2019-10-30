const ArgetherToken = artifacts.require("ArgetherToken");
// const ArgetherTokenSale = artifacts.require("ArgetherTokenSale");
const Forum = artifacts.require("Forum");


module.exports = function(deployer) {
  deployer.deploy(ArgetherToken, 1000000).then(function() {
    return deployer.deploy(Forum, ArgetherToken.address, 1000000000000000);
  });

};
