//These should test the internal returned values of functions
import {getHitRarity, addCard, checkStatus, pickPack, breakPack} from '../index.js';
import Pullrates from "./PullRates.json";
import Options from './supportedSets.js';

//Test that checkResponse handles all types of responses
describe('checkResponse', () => {
  var myBlob = new Blob();
  var init = { "status" : 200 , "data" : "Is Good!" };
  var myResponse = new Response(myBlob,init);

  it('should return a successful response json data', () => {
    expect(checkResponse(myResponse).data).toBe("Is Good!");
  });
  it('should throw an error with an unsuccessful response', () => {
    expect(checkResponse(myResponse).catch().message).toBe(400);
  });
});


describe('breakPack', () => {
  import "./mockset.js" as MockSet;
  //create a mock session & store Set named like: set + "-"+trim+"Set"
  it('returns an object with status of error.message when an error is caught', () => {
    //pass in a bad rarity or set name
  });
  it('should handle duplicates correctly', () => {
    //have the stored set that is passed into the function be all dupes & 1 unique
  });
  it('should return an object with data of a pack of cards when no error is caught', () => {
    //golden path
  });
  it('should handle bad data', () => {
    // ex. dupes in the set OR ill-formatted data
  });
});

describe('addCard', () => {
  import "./mockset.js" as MockSet;
  var pack = addCard([], MockSet, MockSet[1].rarity, 1);
  pack = addCard(pack, MockSet, MockSet[2].rarity, 2);
  pack = addCard(pack, MockSet, MockSet[1].rarity, 1);
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
