//These should test the internal returned values of functions
import {breakPack, getRandomIntInclusive, fetchCards, addCards, getHitRarity} from '../index.js';
import Pullrates from "./PullRates.json";

//Loop through each set and rarity
describe('fetchCards', () => {
    it('should be from the correct set', () => {

    });
    it('should be from the correct rarity', () => {

    });
    it('should be from the correct size', () => {

    });
  }
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

//
describe('addCards', () => {
    it('should add the correct number of cards', () => {

    });
    it('should handle dupes', () => {
      //??? How do you test for this consistantly ???
    });
    it('should save set info to session storage', () => {

    });
  }
});
