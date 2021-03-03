var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var PokemonFactory = artifacts.require("./PokemonFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(PokemonFactory);
};
