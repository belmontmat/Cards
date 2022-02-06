//These should test the internal returned values of functions
import {getHitRarity, addCard, checkStatus} from '../index.js';
import Pullrates from "./PullRates.json";
import Options from './supportedSets.js';

//Test that checkResponse handles all types of responses
describe('checkResponse', () => {
  var myBlob = new Blob();
  var init = { "status" : 200 , "statusText" : "Is Good!" };
  var myResponse = new Response(myBlob,init);

});

describe('addCard', () => {
  import "./mockset.js" as MockSet;
  var pack = addCard([], MockSet, MockSet.rarity, 1);
  pack = addCard(pack, MockSet, MockSet.rarity, 2);
  pack = addCard(pack, MockSet, MockSet.rarity, 1);
  it('should handle dupes', () => {
    expect(pack[2].id).toBe("Duplicate");
  });
  it('should add the correct keys', () => {
    expect(pack[0]).toBe("Rare Holo pl1-1");
    expect(pack[1]).toBe("Common det1-1");
  });
});

//make sure boundaries match PullRates.json
describe('getHitRarity', () => {
  const rates = Pullrates.Rates;
  var current = 0;
  for(var i = 0; i < rates.length; i++){
    it(rates[i].Rarity, () => {
      expect(getHitRarity(current)).toBe(rates[i].Rarity);
      current += rates[i].Chance - 1;
      expect(getHitRarity(current)).toBe(rates[i].Rarity);
    });
    current += 1;
  }
});
