import React from "react";
import PropTypes from "prop-types";

import "./App.css";
import Pullrates from "./PullRates.json";
export default App;

const PokemonCard = ({ data }) => (
  <tr>
    <td>{data.cardmarket.prices.averageSellPrice}</td>
    <td>{data.images.large}</td>
  </tr>
);

PokemonCard.propTypes = {
  id: PropTypes.string,
  cardmarket: PropTypes.shape({
    prices: PropTypes.shape({
      averageSellPrice: PropTypes.number,
    }),
  }),
  images: PropTypes.shape({
    large: PropTypes.string,
  }),
};

function App() {
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

  //Make this only make one of each const per session, maybe save a cookie or local temp file
  async function breakPack(setName) {
    // THIS IS ONLY FOR MAIN MODERN SETS Ex. Evolving Skies

    const commonSet = await fetchCards(setName, "Common");
    console.log("common set: " + commonSet);
    const commonLength = commonSet.length;
    const uncommonSet = await fetchCards(setName, "Uncommon");
    const uncommonLength =  uncommonSet.length;
    const rareSet =  await fetchCards(setName, "Rare");
    const rareLength = rareSet.length;
    const hrareSet =  await fetchCards(setName, "Rare Holo");
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

    const reverseSet = [];
    uncommonSet.forEach(elem => reverseSet.push(elem));
    commonSet.forEach(elem => reverseSet.push(elem));
    rareSet.forEach(elem => reverseSet.push(elem));
    hrareSet.forEach(elem => reverseSet.push(elem));
    const reverseLength = reverseSet.length;

    var pack = [];
    for (var i = 0; i < 5; i++) {
      var rand = getRandomIntInclusive(0, commonLength - 1);
      console.log("rand:" + rand +",common rand:"+commonSet[rand]);
      if(!pack.includes(commonSet[rand])) {
        pack[i]= {id:"common " + i,
                  card:commonSet[rand]
        };
        continue;
      } else {
        console.log("duplicate");
        //i--;
      }
    }

    for (var j = 0; j < 3; j++) {
      rand = getRandomIntInclusive(0, uncommonLength - 1);
      console.log("rand:" + rand +",uncommon rand:"+uncommonSet[rand]);
      if(!pack.includes(uncommonSet[rand])) {
        pack[i+j]= {id:"uncommon " + j,
                  card:uncommonSet[rand]
        };
        continue;
      } else {
        console.log("duplicate");
        //i--;
      }
    }

    pack.push({id:"reverse", card:reverseSet[getRandomIntInclusive(0, reverseLength-1)]});

    if(hitRarity === "Rare") {
      pack.push({id:"hit", card:rareSet[getRandomIntInclusive(0, rareLength-1)]})
    } else if (hitRarity === "Rare Holo") {
      pack.push({id:"hit", card:hrareSet[getRandomIntInclusive(0, hrareLength-1)]})
    } else {
      var hitSet =  await fetchCards(setName, hitRarity);
      var hitLength = hitSet.length;
      pack.push({id:"hit", card:hitSet[getRandomIntInclusive(0, hitLength-1)]})
    }
    console.log("pack: " + pack);
    return pack;
  }


  function fetchCards(setName, rarity) {
    return fetch('https://api.pokemontcg.io/v2/cards?q=!set.name:"'+setName+'" !rarity:"'+rarity+'"')
      .then(checkStatus)
      .then(resp => resp.json())
      .then((responseData) => {
      console.log(responseData);
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

  var pack = [];
  var setName = "Evolving Skies";

  return (
    <div>
      <h1 className="title">Open {setName}</h1>
      <button onClick = {async () => {pack = await breakPack(setName);  console.log(pack);}}>Open a Pack</button>
      <table width="100%">
        <thead>
        <tr>
          <th>Price</th>
          <th>Image</th>
        </tr>
        </thead>
        <tbody>
          {pack.map((card) =>
            <PokemonCard data = {card} key={card.id}/>
          )}
        </tbody>
      </table>
    </div>
  );
}
