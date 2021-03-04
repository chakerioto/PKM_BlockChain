var SimpleStorage = artifacts.require('./SimpleStorage.sol');
var PokemonFactory = artifacts.require('./PokemonFactory.sol');
var PokemonFeeding = artifacts.require('./PokemonFeeding.sol');

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(PokemonFactory);
  deployer.deploy(PokemonFeeding);
};
