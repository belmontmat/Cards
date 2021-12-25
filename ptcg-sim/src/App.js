import React from "react";
//import PropTypes from "prop-types";

import "./App.css";
import Pullrates from "./PullRates.json";
export default App;

/*
const PokemonCard = ({ data }) => (
  <tr>
    <td>{data.card.tcgplayer.prices.normal.mid}</td>
    <td>{data.card.images.large}</td>
  </tr>
);

PokemonCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string,
    images: PropTypes.shape({
      large: PropTypes.string,
    }),
    tcgplayer: PropTypes.shape({
      prices: PropTypes.shape({
        normal: PropTypes.shape({
          mid: PropTypes.number,
        }),
      }),
    }),
  }),
};
*/
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
      console.log("rand#:" + rand + ", set:common, card:"+JSON.stringify(commonSet[rand]));
      if(!pack.includes(commonSet[rand])) {
        pack[i]= {id:"common " + i,
                  card:commonSet[rand]
        };
        continue;
      } else {
        console.log("duplicate");
        i--;
      }
    }

    for (var j = 0; j < 3; j++) {
      rand = getRandomIntInclusive(0, uncommonLength - 1);
      console.log("rand:" + rand +", set:uncommon, card:"+JSON.stringify(uncommonSet[rand]));
      if(!pack.includes(uncommonSet[rand])) {
        pack[i+j]= {id:"uncommon " + j,
                  card:uncommonSet[rand]
        };
        continue;
      } else {
        console.log("duplicate");
        i--;
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
    //console.log("pack: " + JSON.stringify(pack));
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

  var [pack, packSet] = React.useState([]);
  var setName = "Evolving Skies";
  var version = "normal";

  return (
    <div>
      <h1 className="title">Open {setName}</h1>
      <button onClick = {async () => {packSet(await breakPack(setName)); console.log(pack);}}>Open a Pack</button>
      <table width="100%">
        <thead>
          <tr>
            <th>Price</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {pack.map((data) => {
            if(data.id.includes("reverse")){
              version = "reverseHolofoil";
          } else if(data.id.includes("hit")) {
            if (data.id.includes("Holo") || data.id.includes("Rainbow") || data.id.includes("Ultra") || data.id.includes("Secret")) {
              version = "holofoil";
            }
          } else {
            version = "normal";
          }
          //console.log(pack[9].card.tcgplayer.prices[version]);
          return (
            <tr key={data.id}>
              <td>{data.card.tcgplayer.prices[version].market}</td>
              <td>{data.card.images.large}</td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}
