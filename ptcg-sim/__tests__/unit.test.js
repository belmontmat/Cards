//These should test the internal returned values of functions
import {getHitRarity, makePack, checkStatus} from '../index.js';
import Pullrates from "./PullRates.json";
import Options from './supportedSets.js';

//Test that checkResponse handles all types of responses
describe('checkResponse', () => {
  var myBlob = new Blob();
  var init = { "status" : 200 , "statusText" : "Is Good!" };
  var myResponse = new Response(myBlob,init);

});

describe('makePack', () => {
  it('should handle dupes', () => {

  });
  it('should add the correct number of cards', () => {

  });
  it('should add the correct keys', () => {

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
