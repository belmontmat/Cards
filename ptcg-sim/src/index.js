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

export async function breakPack(num, rarity, set, pack) {
  try {
    //removes whitespace as session storage prefers
    var trim = rarity.replace(/\s+/g, '');
    var raritySet = JSON.parse(sessionStorage.getItem(set + "-"+trim+"Set"));
    if (raritySet == null) {
      if (rarity !== "Reverse") {
        raritySet = await fetchCards(set, rarity);
      } else {
        var rareSet = await fetchCards(set, "Rare");
        sessionStorage.setItem(set + "-RareSet",JSON.stringify(rareSet));
        var rarehSet = await fetchCards(set, "Rare Holo");
        sessionStorage.setItem(set + "-RareHoloSet",JSON.stringify(rarehSet));
        raritySet = JSON.parse(sessionStorage.getItem(set + "-CommonSet")).concat(JSON.parse(sessionStorage.getItem(set + "-UncommonSet"))).concat(JSON.parse(sessionStorage.getItem(set + "-RareSet"))).concat(JSON.parse(sessionStorage.getItem(set + "-RareHoloSet")));
      }
      sessionStorage.setItem(set + "-"+trim+"Set",JSON.stringify(raritySet));
    }
    for (var i = 0; i < num; i++) {
      var rand = getRandomIntInclusive(0, raritySet.length - 1);
      pack = addCard(pack, raritySet, rarity, rand);
      if(pack[i].id === "Duplicate") {
        i--;
      }
    }
    return {"data":pack,"status":200};
  } catch (e) {
    return {"data":pack,"status":e.message};
  }
}

export function addCard(pack, raritySet, rarity, randNum) {
  if(pack.filter(obj => obj.card.id === "Duplicate").length === 0) {
    pack.push({id:rarity + " " + raritySet[randNum].id, card:raritySet[randNum]});
  } else {
    pack.push({id:"Duplicate", card:raritySet[randNum]});
  }
  return pack;
}

export function getHitRarity(num){
  // ROLL FOR RARITY(roll 1 to 100 inclusive,[1 to rare]= rare,[rare+1 to rare + rareh] = rare holo,[Σrareh+1 to Σv] = v, [Σv+1 to Σvmax] = vmax, [Σvmax+1 to Σultra] = ultra, [Σultra+1 to Σrainbow] = rainbow,[Σrainbow+1 to Σsecret] = secret)
  var rarity;
  if(num === undefined) {
    rarity = getRandomIntInclusive(0, 99);
  } else {
    rarity = num;
  }
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
  return hitRarity;
}

export async function pickPack(setName) {
  const layout = Pullrates.Layout;
  var pack = [];
  var status;
  var chunk;
  for (const card of layout){
    if(card.Rarity === "Hit") {
      var hitRarity = getHitRarity();
      chunk = await breakPack(1, hitRarity, setName, pack);
    } else {
      chunk = await breakPack(card.Amount, card.Rarity, setName, pack);
    }
    pack = chunk.data;
    status = chunk.status;
  }
  return {"data":pack,"status":status};
}


export function fetchCards(setName, rarity) {
  return fetch('https://api.pokemontcg.io/v2/cards?q=!set.name:"'+setName+'" !rarity:"'+rarity+'"')
  .then(checkStatus)
  .then((responseData) => {
    return responseData.data;
    })
  .catch(console.error);
}

export function checkStatus(resp) {
  if(!resp.ok) {
    throw Error(resp.status)
  } else {
    return resp.json();
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
