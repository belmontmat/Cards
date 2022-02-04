import React from 'react';
var version = "normal";
const PackResults = (pack) => {
  return (
    <table width="100%">
      <thead>
      </thead>
      <tbody>
        {pack.pack.map((data) => {
          if(data.id.includes("Reverse")){
            version = "reverseHolofoil";
          } else if(data.card.rarity.includes("Holo") || data.card.rarity.includes("Rainbow") || data.card.rarity.includes("Ultra") || data.card.rarity.includes("Secret")) {
              version = "holofoil";
            } else {
              version = "normal";
            }
        return (
          <tr key={data.id}>
            <td>
              <p>{data.id}</p>
              <img alt={data.card.id} src={data.card.images.small}></img>
              <p>${data.card.tcgplayer.prices[version].market}</p>
            </td>
          </tr>
        )})}
      </tbody>
    </table>
  );
}
export default PackResults;
