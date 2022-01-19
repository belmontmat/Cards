// These tests should be testing how the functions that rely on function calls
import {breakPack, getRandomIntInclusive, fetchCards, addCards} from '../index.js';

describe('breakPack', () => {
  var options = document.getElementById('setInput').options;
  for (var i = 0; i < options.length; i++) {
    const pack = breakPack(options[i]);
    it('should have 10 cards', () => {

    });
    it('should have 5 commons', () => {

    });
    it('should have 3 uncommons', () => {

    });
    it('should have 1 reverse', () => {

    });
    it('should have 1 hit of appropriate rarity', () => {

    });
    it('should have no dupes (minus reverse)', () => {

    });
  }
});
