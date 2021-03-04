// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "./PokemonFactory.sol";


contract PokemonFeeding is PokemonFactory {

    
  function attackEnemy(uint pokemonId, uint enemyId) public {
    require(msg.sender == pokemonToOwner[pokemonId]);
    Pokemon storage myPokemon = pokemons[pokemonId];
    Pokemon storage enemyPokemon  = pokemons[enemyId];
    if (myPokemon.attack > enemyPokemon.attack ){
        myPokemon.hp     = myPokemon.hp - ( myPokemon.attack - enemyPokemon.attack)/2 ;
        myPokemon.attack = myPokemon.attack + 5 ;
    }
    if (myPokemon.attack < enemyPokemon.attack || myPokemon.hp <=0 ){
        delete pokemons[pokemonId];
    }
    // start here
  }
   
}