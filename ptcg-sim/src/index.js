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

export async function breakPack(setName) {
  // THIS IS ONLY FOR MAIN MODERN SETS Ex. Evolving Skies
  var commonSet = JSON.parse(sessionStorage.getItem(setName + "-CommonSet"));
  var uncommonSet = JSON.parse(sessionStorage.getItem(setName + "-UncommonSet"));
  var rareSet = JSON.parse(sessionStorage.getItem(setName + "-RareSet"));
  var hrareSet = JSON.parse(sessionStorage.getItem(setName + "-HRSet"));
  var reverseSet = JSON.parse(sessionStorage.getItem(setName + "-RSet"));
  if (commonSet == null) {
    commonSet = await fetchCards(setName, "Common");
    uncommonSet = await fetchCards(setName, "Uncommon");
    rareSet =  await fetchCards(setName, "Rare");
    hrareSet =  await fetchCards(setName, "Rare Holo");
    reverseSet = commonSet.concat(uncommonSet).concat(rareSet).concat(hrareSet);
    sessionStorage.setItem(setName + "-CommonSet",JSON.stringify(commonSet));
    sessionStorage.setItem(setName + "-UncommonSet",JSON.stringify(uncommonSet));
    sessionStorage.setItem(setName + "-RareSet",JSON.stringify(rareSet));
    sessionStorage.setItem(setName + "-HRSet",JSON.stringify(hrareSet));
    sessionStorage.setItem(setName + "-RSet",JSON.stringify(reverseSet));
    console.log("Saving set data");
  }
  const reverseLength = reverseSet.length;
  const commonLength = commonSet.length;
  const uncommonLength =  uncommonSet.length;
  const rareLength = rareSet.length;
  const hrareLength = hrareSet.length;
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
  var cardnames = [];
  for (var i = 0; i < 5; i++) {
    var rand = getRandomIntInclusive(0, commonLength - 1);
    console.log("rand#:" + rand + ", set:common, card:"+JSON.stringify(commonSet[rand]));
    if(!cardnames.includes(commonSet[rand].id)) {
      pack[i]= {id:"common " + i,
                card:commonSet[rand]
      };
    cardnames.push(commonSet[rand].id);
    } else {
      console.log("duplicate");
      i--;
    }
  }

  for (var j = 0; j < 3; j++) {
    rand = getRandomIntInclusive(0, uncommonLength - 1);
    console.log("rand:" + rand +", set:uncommon, card:"+JSON.stringify(uncommonSet[rand]));
    if(!cardnames.includes(uncommonSet[rand].id)) {
      pack[i+j]= {id:"uncommon " + j,
                card:uncommonSet[rand]
      };
      cardnames.push(uncommonSet[rand].id);
    } else {
      console.log("duplicate");
      j--;
    }
  }
  var reverse = reverseSet[getRandomIntInclusive(0, reverseLength-1)];
  console.log("reverse card:"+JSON.stringify(reverse));
  pack.push({id:"reverse", card:reverse});

  if(hitRarity === "Rare") {
    pack.push({id:"hit", card:rareSet[getRandomIntInclusive(0, rareLength-1)]})
  } else if (hitRarity === "Rare Holo") {
    pack.push({id:"hit", card:hrareSet[getRandomIntInclusive(0, hrareLength-1)]})
  } else {
    var hitSet =  await fetchCards(setName, hitRarity);
    var hitLength = hitSet.length;
    pack.push({id:"hit", card:hitSet[getRandomIntInclusive(0, hitLength-1)]})
  }
  console.log("hit card:" + JSON.stringify(pack[pack.length - 1]));
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
