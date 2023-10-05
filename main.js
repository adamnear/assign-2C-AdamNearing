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


//Async function to draw five cards from the deck api
async function shuffleAndDrawCards(deckId) {

    //Shuffle the deck from the ApiUrl before drawing
    const shuffleUrl = `${ApiUrl}/${deckId}/shuffle/`;
    const shuffleResponse = await fetch(shuffleUrl);

    //Drawing 5 cards from the ApiUrl with the associated deckId
    const drawUrl = `${ApiUrl}/${deckId}/draw/?count=5`;
    const drawResponse = await fetch(drawUrl);
    const handData = await drawResponse.json();
    const hand = handData.cards;

    //Show the cards delt in the console
    console.log("Hand delt: ", hand);
};
//Call the drawCards function
shuffleAndDrawCards(deckId);