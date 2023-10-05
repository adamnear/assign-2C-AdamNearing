const ApiUrl = 'https://deckofcardsapi.com/api/deck';
let deckId = localStorage.getItem('deckId');

//Async Fetch the cards from the API and store as cardData
async function retrieveDeck() {

    const response = await fetch(`${ApiUrl}/new`);
    const cardData = await response.json();
    deckId = cardData.deck_id;

    //Store the deckId in localStorage using .setItem
    localStorage.setItem('deckId', deckId);

    //Show the deck id in the console.
    console.log("Retrieved deck_id: ", deckId);
};

//Call the retrieveDeck function
retrieveDeck();