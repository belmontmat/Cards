//These should test the internal returned values of functions
import {breakPack, getRandomIntInclusive, fetchCards, addCards, getHitRarity} from '../index.js';
import Pullrates from "./PullRates.json";
import Options from './supportedSets.js';

describe('fetchCards', async () => {
  Options.forEach((set) => {
    const rates = Pullrates.Rates;
    var master = [];
    rates.forEach((rarity) => {
      var cards = await fetchCards(set.value, rarity.Rarity);
      it('should be from the correct set', () => {
        expect(cards[0].set.name).toBe(set.value);
        expect(cards[cards.length - 1].set.name).toBe(set.value);
      });
      it('should be from the correct rarity', () => {
        expect(cards[0].rarity).toBe(rarity.Rarity);
        expect(cards[cards.length - 1].rarity).toBe(rarity.Rarity);
      });
      master.concat(cards);
    });
    it('set should be the correct size', () => {
      var oracleSet = fetch('https://api.pokemontcg.io/v2/sets?q=!name:"'+set+'"')
        .then(resp => resp.json())
        .then((responseData) => {
        return responseData.data;
        })
      expect(master.length).toBe(oracleSet.total);
    });
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

describe('addCards', () => {
  //var testPack = addCards(6, rarity, "Evolving Skies", []);

    it('should add the correct number of cards', () => {
      expect(testPack.length).toBe(6);
    });
    it('should add the correct keys', () => {

      });

    });
    it('should handle reverse holofoil', () => {

    });
    it('should handle dupes', () => {
      //??? How do you test for this consistantly ???
    });
    it('should save set info to session storage', () => {
      //?? Ask Shaun how he would test this ??
    });
  }
});
