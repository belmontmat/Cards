import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Pullrates from "./PullRates.json";
import App from './App';

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export function addCards(num, rarity, set, pack) {
  var trim = rarity.replace(/\s+/g, '');
  var raritySet = JSON.parse(sessionStorage.getItem(set + "-"+trim+"Set"));
  if (raritySet == null) {
    if (rarity !== "Reverse") {
      raritySet = await fetchCards(set, rarity);
    } else {
      raritySet = JSON.parse(sessionStorage.getItem(set + "-CommonSet")).concat(JSON.parse(sessionStorage.getItem(set + "-UncommonSet"))).concat(JSON.parse(sessionStorage.getItem(set + "-RareSet"))).concat(JSON.parse(sessionStorage.getItem(set + "-RareHoloSet")));
    }
    sessionStorage.setItem(setName + "-"+trim+"Set",JSON.stringify(raritySet));
  }
  for (var i = 0; i < num; i++) {
    var rand = getRandomIntInclusive(0, raritySet.length - 1);
    if(!cardnames.includes(raritySet[rand].id)) {
      pack[i] = {id:rarity + " " + i,
                card:raritySet[rand]
      };
    cardnames.push(raritySet[rand].id);
    } else {
      console.log("duplicate");
      i--;
    }
    return pack;
  }
}

export async function breakPack(setName) {
  // THIS IS ONLY FOR MAIN MODERN SETS Ex. Evolving Skies

  // ROLL FOR RARITY(roll 1 to 100 inclusive,[1 to rare]= rare,[rare+1 to rare + rareh] = rare holo,[Σrareh+1 to Σv] = v, [Σv+1 to Σvmax] = vmax, [Σvmax+1 to Σultra] = ultra, [Σultra+1 to Σrainbow] = rainbow,[Σrainbow+1 to Σsecret] = secret)
  var rarity = getRandomIntInclusive(1, 100);
  var sigma = 0;
  var hitRarity = null;
  const rates = Pullrates.Rates;
  rates.every(item => {
    sigma += item.Chance;
    if (rarity <= sigma) {
      hitRarity = item.Rarity;
      console.log(rarity+","+hitRarity);
      return false;
    } else {
      return true;
    }
  });

  var pack = [];
  pack = addCards(5, "Common", setName, pack);
  pack = addCards(3, "Uncommon", setName, pack);
  pack = addCards(1, "Reverse", setName, pack);
  pack = addCards(1, hitRarity, setName, pack);
  return pack;
}


export function fetchCards(setName, rarity) {
  return fetch('https://api.pokemontcg.io/v2/cards?q=!set.name:"'+setName+'" !rarity:"'+rarity+'"')
    .then(checkStatus)
    .then(resp => resp.json())
    .then((responseData) => {
    return responseData.data;
    })
    .catch(console.error);
}


function checkStatus(response) {
  if (!response.ok) {
    throw Error("Error in request: " + response.statusText);
  }
  return response;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
