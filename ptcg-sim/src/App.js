import React from "react";
//import PropTypes from "prop-types";
//import ReactDOM from 'react-dom';
import "./App.css";
import {pickPack} from './index.js';
import Options from './supportedSets.js';
import PackResults from './packResults.js';
import ErrorBox from './error.js'
export default App;


function App() {

  function handleSet(e, func) {
    setSet(e.target.value);
  }
  var [isWaiting, isWaitingSet] = React.useState(false);
  var [pack, packSet] = React.useState({"data":[],"status":200});
  var [seti, setSet] = React.useState(Options[0].props.value);
  var [money, moneySet] = React.useState(100.0);
  const firstUpdate = React.useRef(true);

  React.useEffect(() => {
    if(!firstUpdate.current) {
      var gain = 0;
      if(pack.status === 200) {
        pack.data.forEach((item, i) => {
          if(item.id.includes("reverse")){ gain += item.card.tcgplayer.prices.reverseHolofoil.market;}
          else if(item.card.rarity.includes("Holo") || item.card.rarity.includes("Rainbow") || item.card.rarity.includes("Ultra") || item.card.rarity.includes("Secret")){gain += item.card.tcgplayer.prices.holofoil.market;}
          else{gain += item.card.tcgplayer.prices.normal.market;}
        });
        console.log("net value="+(gain-4));
        moneySet(money+gain-4);
      }
      isWaitingSet(false);
    }
  }, [pack]);

  return (
    <div>
      <label htmlFor="setinput">Choose a set:</label>
      <select name="setinput" id="setinput" defaultValue={seti} onChange={handleSet}>
        {Options}
      </select>
      <h1 className="title">Open {seti}</h1>
      <h3>You have ${money.toFixed(2)}</h3>
      <button disabled={isWaiting} onClick = {async () => {isWaitingSet(true); packSet(await pickPack(seti)); firstUpdate.current = false;}}>Open a Pack for $4</button>
      {pack.status === 200 ? <PackResults pack={pack.data} /> : <ErrorBox code={pack.status} />}
    </div>
  );
}
