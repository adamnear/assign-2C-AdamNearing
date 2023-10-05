const ApiUrl = 'https://deckofcardsapi.com/api/deck';
let deckId = localStorage.getItem('deckId');

//Async Fetch the cards from the API and store as cardData
async function retrieveDeck() {

    const response = await fetch(`${ApiUrl}/new`);
    const cardData = await response.json();
    deckId = cardData.deck_id;

};
