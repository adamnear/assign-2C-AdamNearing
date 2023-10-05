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

    //Display image of the cards delt
    const cardImagesContainer = document.getElementById("cardImages");
    cardImagesContainer.innerHTML = ""; //Clearing teh previous card images displayed

    hand.forEach(card => {
        const cardImage = document.createElement("img");
        cardImage.src = card.image;
        cardImagesContainer.appendChild(cardImage);
    })

    //Show the cards delt in the console
    console.log("Hand delt: ", hand);
};
//Event listener for shuffle and deal button
document.getElementById('shuffleAndDeal').addEventListener('click', () => {
    //Call drawCards function after button is clicked
    shuffleAndDrawCards(deckId);
});


//Determining all possible poker hands
function determinePokerHand(cards) {
    //Organize the cards to be in rank from high to low
    cards.sort((a, b) => {
        const rankA = getCardRankValue(a);
        const rankB = getCardRankValue(b);
        return rankB - rankA;
    });


}