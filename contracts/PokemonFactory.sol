// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract PokemonFactory {

    //Event Here :
    event NewPokemon(uint pokemonId , string name ,uint attack , uint hp , string imgUrl);

    struct Pokemon {
        string name ;
        uint attack ;
        uint hp ;
        string imgUrl;
    }

    Pokemon[] public pokemons ;

    mapping (uint => address) public pokemonToOwner;
    mapping (address => uint) ownerPokemonsCount;
    

    function _createPokemon(string memory _name, uint _attack, uint _hp ,  string memory _imgUrl) public {
        pokemons.push(Pokemon(_name, _attack,_hp , _imgUrl));
        uint id = pokemons.length - 1;
        pokemonToOwner[id] = msg.sender;
        ownerPokemonsCount[msg.sender]++;
        emit NewPokemon(id, _name, _attack,_hp ,  _imgUrl);
    } 
    
     function getPokemonByOwner(address owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerPokemonsCount[owner]);
    uint counter = 0;
    for (uint i = 0; i < pokemons.length; i++) {
      if (pokemonToOwner[i] == owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }
}
