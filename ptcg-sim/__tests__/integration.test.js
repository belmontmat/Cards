// These tests should be testing how the functions that rely on function calls
import {breakPack, getRandomIntInclusive, fetchCards, addCards} from '../index.js';

describe('breakPack', () => {
  var options = document.getElementById('setInput').options;
  for (var i = 0; i < options.length; i++) {
    const pack = breakPack(options[i]);
    it('should have 10 cards in the correct layout', () => {

    });
    it('should have 1 hit of appropriate rarity', () => {

    });
  }
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
