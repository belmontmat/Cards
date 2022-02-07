// These tests should be testing how the functions that rely on function calls EX API and Server calls
import {fetchCards, breakPack, pickPack} from '../index.js';

describe('breakPack', () => {
  import "./mockset.js" as MockSet;
  //create a mock session with nothing in it
  it('should interact with session storage correctly', () => {
    //recall this means the breakpack will call fetchCards
  });
  it('should handle Reverse correctly', () => {
    //recall Reverse only works when called after "common" and "uncommon"
  });
});

describe('pickPack', () => {
  //only have to test one set, fetchCards is testing the data correctness we just need to check the data manipulation here
  it('returns a pack&status json tuple', () => {

  });
  it('follows set layout', () => {

  });
  it('returns the correct statuses', () => {

  });
});

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
