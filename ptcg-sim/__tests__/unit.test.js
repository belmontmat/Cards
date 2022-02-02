//These should test the internal returned values of functions
import {breakPack, getRandomIntInclusive, fetchCards, addCards, getHitRarity, makePack} from '../index.js';
import Pullrates from "./PullRates.json";
import Options from './supportedSets.js';

//Test that fetchCards handles all types of responses
describe('fetchCards', async () => {

});

describe('makePack', async () => {
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