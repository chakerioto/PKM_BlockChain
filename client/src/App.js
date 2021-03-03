import React, { useState, useEffect } from 'react';
import PokemonFactoryContract from './contracts/PokemonFactory.json';
import getWeb3 from './getWeb3';
import axios from 'axios';

import './App.css';

function App() {
  const [pkm, setPKM] = useState([]);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PokemonFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(
          PokemonFactoryContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);
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

  console.log(122111, accounts);

  const getPokemonDetail = id => {
    return contract.methods.pokemons(id).call();
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
    const response = await contract.methods
      .getPokemonByOwner(accounts[0])
      .call();

    if (response.length == 0) {
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
    });
  }

  return (
    <div className="App">
      <div className="Menu">
        <button onClick={() => handleCreatePokemon()}>Create a Pokemon</button>
        <button onClick={() => console.log('ready-to-battle')}>Battle</button>
        <button onClick={() => console.log('Want to sell ur pokemon?')}>
          Market Place
        </button>
      </div>
      <div className="my-list">
        {pkm.map(el => {
          return (
            <div className="my-list-pkm">
              <img src={el.imgUrl}></img>
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
