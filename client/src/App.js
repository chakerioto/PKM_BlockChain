import React, { useState, useEffect } from 'react';
import PokemonFactoryContract from './contracts/PokemonFactory.json';
import PokemonFeedingContract from './contracts/PokemonFeeding.json';
import getWeb3 from './getWeb3';
import axios from 'axios';

import './App.css';

function App() {
  const [pkm, setPKM] = useState([]);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [contract2, setContract2] = useState(undefined);
  const [enemyAddress, setenemyAddress] = useState('');
  const [pokemonSrc, setpokemonSrc] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState([]);
  const [eneDisplay, setEneDisplay] = useState(null);

  //Chosen Pokemon :
  const [chosen, setChosen] = useState(null);
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PokemonFactoryContract.networks[networkId];

        const instance2 = new web3.eth.Contract(
          PokemonFeedingContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        const instance = new web3.eth.Contract(
          PokemonFactoryContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);
        setContract2(instance2);
      } catch (error) {
        alert('error , read console');
        console.log(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await contract.methods
          .getPokemonByOwner(accounts[0])
          .call();
        if (response.length !== 0) {
          let arr = [];
          for (let e of response) {
            const pokemon = await getPokemonDetail(e);
            console.log(pokemon);
            arr = [...arr, pokemon];
          }
          setPKM(arr);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (
      typeof web3 !== 'undefined' &&
      typeof contract !== 'undefined' &&
      typeof accounts !== 'undefined'
    ) {
      load();
    }
  }, [web3, accounts, contract]);

  const getPokemonDetail = id => {
    return contract.methods.pokemons(id).call();
  };

  // Get Pokemon By Owner Funtion :
  const getLoadEnemyPokemons = async address => {
    const response = await contract.methods.getPokemonByOwner(address).call();

    if (response.length !== 0) {
      let arr = [];
      for (let e of response) {
        const pokemon = await getPokemonDetail(e);
        console.log(pokemon);
        arr = [...arr, pokemon];
      }
      setEnemyPokemon(arr);
    } else {
      alert('Enemy has no Pokemon');
    }
  };

  const handleCreatePokemon = async () => {
    const RandomNumber = Math.floor(Math.random() * 100) + 1;
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

    const pokeData = await axios.get(baseUrl + RandomNumber);
    const name = pokeData.data.name;
    const hp = pokeData.data.stats[0].base_stat;
    const attack = pokeData.data.stats[1].base_stat;
    const imgUrl = pokeData.data.sprites.front_default;

    await contract.methods
      ._createPokemon(name, hp, attack, imgUrl)
      .send({ from: accounts[0] });
    alert('Create Successful');
    getLoadMyPokemon();
  };

  const getLoadMyPokemon = async () => {
    const response = await contract.methods
      .getPokemonByOwner(accounts[0])
      .call();

    if (response.length === 0) {
      alert('ko co pokemon nao`');
    }

    let arr = [];
    for (let e of response) {
      const pokemon = await getPokemonDetail(e);
      arr = [...arr, pokemon];
    }
    setPKM(arr);
  };

  const ethereum = window.ethereum;
  if (ethereum) {
    ethereum.on('accountsChanged', function (accounts) {
      console.log('Ethereum Account Change :', accounts[0]);
      setAccounts(accounts);
      setpokemonSrc(null);
    });
  }

  const showUpPokemon = el => {
    setChosen(el);
    const element = (
      <div className="my-list-pkm">
        <img
          onClick={() => alert('readyToAttack')}
          alt=""
          src={el.imgUrl}
          title="Choose this Pokemon"
        ></img>

        <h6>{el.name}</h6>
        <p> HP : {el.hp}</p>
        <p> Attack :{el.attack}</p>
      </div>
    );
    setpokemonSrc(element);
  };

  const readyToBattle = async () => {
    const enteredName = prompt('Please enter your enemy address');
    setenemyAddress(enteredName);
    getLoadEnemyPokemons(enteredName);
    alert(
      "Pick up an enemy's Pokemon to Attack , If u attack success, ur pokemon's stats will be increased !!!"
    );
  };

  const DeclareBattle = async el => {
    const res = await contract.methods
      .attackEnemy(chosen.id, el.id)
      .send({ from: accounts[0] });
    console.log(res);
    getLoadEnemyPokemons(enemyAddress);
    getLoadMyPokemon();

    //doan nay

    const newChosen = await getPokemonDetail(chosen.id);
    setChosen(newChosen);

    const element = (
      <div className="my-list-pkm">
        <img
          onClick={() => alert('readyToAttack')}
          alt=""
          src={chosen.imgUrl}
          title="Choose this Pokemon"
        ></img>

        <h6>{chosen.name}</h6>
        <p> HP : {chosen.hp}</p>
        <p> Attack :{chosen.attack}</p>
      </div>
    );
    setpokemonSrc(element);
  };

  return (
    <div className="App">
      <div className="Menu">
        <button onClick={() => handleCreatePokemon()}>Create a Pokemon</button>
        <button onClick={() => readyToBattle()}>Battle</button>
        <button onClick={() => console.log('Want to sell ur pokemon?')}>
          Market Place
        </button>
      </div>
      <div className="fight-area" id="fight-area">
        {pokemonSrc}
        <h1 style={{ color: 'red' }}> VS</h1>
        {enemyPokemon.map(el => {
          return (
            <div className="my-list-pkm">
              <img
                onClick={() => DeclareBattle(el)}
                alt=""
                src={el.imgUrl}
                title="Choose this Pokemon"
              ></img>

              <h6>{el.name}</h6>
              <p> HP : {el.hp}</p>
              <p> Attack :{el.attack}</p>
            </div>
          );
        })}
      </div>
      <div className="my-list">
        {pkm.map(el => {
          return (
            <div className="my-list-pkm">
              <img
                onClick={() => showUpPokemon(el)}
                alt=""
                src={el.imgUrl}
                title="Choose this Pokemon"
              ></img>

              <h6>{el.name}</h6>
              <p> HP : {el.hp}</p>
              <p> Attack :{el.attack}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
