import React from "react";
//import PropTypes from "prop-types";
//import ReactDOM from 'react-dom';
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


  function fetchCards(setName, rarity) {
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

  function handleSet(e, func) {
    setSet(e.target.value);
  }

  var [pack, packSet] = React.useState([]);
  var version = "normal";
  var [seti, setSet] = React.useState("Evolving Skies");
  var [money, moneySet] = React.useState(100.0);
  const firstUpdate = React.useRef(true);

  React.useEffect(() => {
    if(!firstUpdate.current) {
      var gain = 0;
      pack.forEach((item, i) => {
        if(item.id.includes("reverse")){ gain += item.card.tcgplayer.prices.reverseHolofoil.market;}
        else if(item.card.rarity.includes("Holo") || item.card.rarity.includes("Rainbow") || item.card.rarity.includes("Ultra") || item.card.rarity.includes("Secret")){gain += item.card.tcgplayer.prices.holofoil.market;}
        else{gain += item.card.tcgplayer.prices.normal.market;}
      });
      console.log("net value="+(gain-4));
      moneySet(money+gain-4);
    }
  }, [pack]);

  return (
    <div>
    <label htmlFor="setinput">Choose a set:</label>

    <select name="setinput" id="setinput" defaultValue={seti} onChange={handleSet}>
      <option value="Evolving Skies">Evolving Skies</option>
      <option value="Fusion Strike">Fusion Strike</option>
      <option value="Vivid Voltage">Vivid Voltage</option>
      <option value="Darkness Ablaze">Darkness Ablaze</option>
      <option value="Chilling Reign">Chilling Reign</option>
      <option value="Battle Styles">Battle Styles</option>
      <option value="Rebel Clash">Rebel Clash</option>
    </select>
      <h1 className="title">Open {seti}</h1>
      <h3>You have ${money}</h3>
      <button onClick = {async () => {packSet(await breakPack(seti)); firstUpdate.current = false;}}>Open a Pack for $4</button>
      <table width="100%">
        <thead>
        </thead>
        <tbody>
          {pack.map((data) => {
            if(data.id.includes("reverse")){
              version = "reverseHolofoil";
            } else if(data.id.includes("hit")) {
              if (data.card.rarity.includes("Holo") || data.card.rarity.includes("Rainbow") || data.card.rarity.includes("Ultra") || data.card.rarity.includes("Secret")) {
                version = "holofoil";
              } else {
                version = "normal";
              }
            } else {
              version = "normal";
            }
          return (
            <tr key={data.id}>
              <td>
                <p>{data.id}</p>
                <img alt={data.card.id} src={data.card.images.small}></img>
                <p>${data.card.tcgplayer.prices[version].market}</p>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}
