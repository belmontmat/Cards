import React from "react";
import PropTypes from "prop-types";

import "./App.css";
import Pullrates from "./PullRates.json";
export default App;

const PokemonCard = ({ data }) => (
  <tr key={data.id}>
    <td>{data.prices.averageSellOrice}</td>
    <td>{data.images.large}</td>
  </tr>
);

function App() {
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

  //Make this only make one of each const per session, maybe save a cookie or local temp file
  function breakPack(setName) {
    // THIS IS ONLY FOR MAIN MODERN SETS Ex. Evolving Skies

    const commonSet = fetchCards(setName, "Common");
    const commonLength = commonSet.size();
    const uncommonSet = fetchCards(setName, "Uncommon");
    const uncommonLength = uncommonSet.size();
    const rareSet = fetchCards(setName, "Rare");
    const rareLength = rareSet.size();
    const hrareSet = fetchCards(setName, "Rare Holo");
    const hrareLength = hrareSet.size();
    // ROLL FOR RARITY(roll 1 to 100 inclusive,[1 to rare]= rare,[rare+1 to rare + rareh] = rare holo,[Σrareh+1 to Σv] = v, [Σv+1 to Σvmax] = vmax, [Σvmax+1 to Σultra] = ultra, [Σultra+1 to Σrainbow] = rainbow,[Σrainbow+1 to Σsecret] = secret)
    var rarity = getRandomIntInclusive(1, 100);
    var sigma = 0;
    var hitRarity = null;
    const rates = Pullrates[setName].Rates;
    rates.forEach(item => {
      sigma += item.Chance;
      if (rarity <= sigma) {
        hitRarity = item.Rarity;
      }
    });

    var hitSet = fetchCards(setName, hitRarity);
    var hitLength = hitSet.size();
    const reverseSet = new Set();
    uncommonSet.forEach(elem => reverseSet.add(elem));
    commonSet.forEach(elem => reverseSet.add(elem));
    rareSet.forEach(elem => reverseSet.add(elem));
    hrareSet.forEach(elem => reverseSet.add(elem));
    const reverseLength = reverseSet.size();

    var pack = new Set();
    for (var i = 0; i < 5; i++) {
      if(pack.add(commonSet[getRandomIntInclusive(1, commonLength)])) {
        continue;
      } else {
        i--;
      }
    }

    for (var i = 0; i < 3; i++) {
      if(pack.add(uncommonSet[getRandomIntInclusive(1, uncommonLength)])) {
        continue;
      } else {
        i--;
      }
    }

    var reverse = (reverseSet[getRandomIntInclusive(1, reverseLength)]);

    if(hitRarity == "Rare") {
      pack.add(rareSet[getRandomIntInclusive(1, rareLength)])
    } else if (hitRarity == "Rare Holo") {
      pack.add(hrareSet[getRandomIntInclusive(1, hrareLength)])
    } else {
      var hitSet = fetchCards(setName, hitRarity);
      var hitLength = hitSet.size();
      pack.add(hitSet[getRandomIntInclusive(1, hitLength)])
    }

    return [pack, reverse];
  }


  function fetchCards(setName, rarity) {
    var set = new Set();
    fetch('https://api.pokemontcg.io/v2/cards?q=set.name:'+setName+'+rarity:'+rarity)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(data => set)
      .catch(console.error);
    return set;
  }


  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }
  const [pack, packSet] = React.userState([]);
  var setName = "Evolving Skies";
  return (
    <div>
      <h1 className="title">Open {setName}</h1>
      <button onClick = {setName => breakPack()}
      >Open a Pack</button>
      <table width="100%">
        <thead>
          <th>Price</th>
          <th>Image</th>
        </thead>
        <tbody>
          {pack.map((data) => (
            <PokemonCard data ={data} key={data.id}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}
