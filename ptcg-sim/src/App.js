import React from "react";
//import PropTypes from "prop-types";
//import ReactDOM from 'react-dom';
import "./App.css";
import {breakPack} from './index.js';
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

  function handleSet(e, func) {
    setSet(e.target.value);
  }
  var [isWaiting, isWaitingSet] = React.useState(false);
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
      isWaitingSet(false);
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
      <option value="Sword & Shield">Sword & Shield</option>
    </select>
      <h1 className="title">Open {seti}</h1>
      <h3>You have ${money}</h3>
      <button disabled={isWaiting} onClick = {async () => {isWaitingSet(true); packSet(await breakPack(seti)); firstUpdate.current = false;}}>Open a Pack for $4</button>
      <table width="100%">
        <thead>
        </thead>
        <tbody>
          {pack.map((data) => {
            if(data.id.includes("Reverse")){
              version = "reverseHolofoil";
            } else if(data.card.rarity.includes("Holo") || data.card.rarity.includes("Rainbow") || data.card.rarity.includes("Ultra") || data.card.rarity.includes("Secret")) {
                version = "holofoil";
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
