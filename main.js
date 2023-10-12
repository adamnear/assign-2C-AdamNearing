(function () {
    const apiUrl = 'https://deckofcardsapi.com/api/deck';
    let deckId = localStorage.getItem('deckId');

    //Async Fetch the cards from the API and store as cardData
    async function retrieveDeck() {

        const response = await fetch(`${apiUrl}/new`);
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

        //Shuffle the deck from the apiUrl before drawing
        const shuffleUrl = `${apiUrl}/${deckId}/shuffle/`;
        const shuffleResponse = await fetch(shuffleUrl);

        //Drawing 5 cards from the apiUrl with the associated deckId
        const drawUrl = `${apiUrl}/${deckId}/draw/?count=5`;
        const drawResponse = await fetch(drawUrl);
        const handData = await drawResponse.json();
        const hand = handData.cards;

        //Display image of the cards delt
        const cardImagesContainer = document.getElementById("cardImages");
        const outputCardDetails = document.getElementById("cardDetails");

        cardImagesContainer.innerHTML = ""; //Clearing the previous card images displayed
        let outputHTML = "";

        hand.forEach(card => {
            const cardImage = document.createElement("img");
            outputHTML += `<h3>${card.value} of ${card.suit}</h3>`;
            cardImage.src = card.image;
            cardImagesContainer.appendChild(cardImage);
        });

        outputCardDetails.innerHTML = outputHTML;//The card number and value sent to HTML

        //Show the cards delt in the console
        console.log("Hand delt: ", hand);

        // After drawing the cards, determine the poker hand and display it
        const pokerHand = determinePokerHand(hand);
        displayPokerHandResult(pokerHand);
        console.log("Poker hand: ", result);
    };

    // Function to display the poker hand result on the page
    function displayPokerHandResult(result) {
        const pokerHandElement = document.getElementById("pokerHand");
        pokerHandElement.textContent = "Poker Hand: " + result;
    }

    //Event listener for shuffle and deal button
    document.getElementById('shuffleAndDeal').addEventListener('click', () => {
        //Call drawCards function after button is clicked
        shuffleAndDrawCards(deckId);
    });

    //Determining all possible poker hands
    function determinePokerHand(cards) {
        //Organize the cards to be in rank from high to low
        const sortedCards = cards.slice();
        sortedCards.sort((a, b) => {
            const rankA = getCardRankValue(a);
            const rankB = getCardRankValue(b);
            return rankB - rankA;
        });

        //These are the possible poker hands, from highest value to lowest value
        if (isRoyalFlush(sortedCards)) {
            return "Royal Flush";
        } else if (isStraightFlush(sortedCards)) {
            return "Straight Flush";
        } else if (isFourOfAKind(sortedCards)) {
            return "Four of a Kind";
        } else if (isFullHouse(sortedCards)) {
            return "Full House";
        } else if (isFlush(sortedCards)) {
            return "Flush";
        } else if (isStraight(sortedCards)) {
            return "Straight";
        } else if (isThreeOfAKind(sortedCards)) {
            return "Three of a Kind";
        } else if (isTwoPair(sortedCards)) {
            return "Two Pair";
        } else if (isOnePair(sortedCards)) {
            return "One Pair";
        } else {
            return "High Card";
        }
    }

    //function to assign value to non-numeric cards (face cards)
    function getCardRankValue(sortedCards) {
        const rank = sortedCards.value;
        return isNaN(rank) ? "TJQKA".indexOf(rank) + 10 : parseInt(rank); //checking if not a number = true, then it is a face card or 10 
        //"TJQKA" is an ordered list starting at T = 0. Then adding 10 so T = 10
    }

    function isRoyalFlush(sortedCards) {
        //Check for a royal flush
        const validCards = ["T", "J", "Q", "K", "A"];
        let hasValidCards = true;
        let firstSuit = null;

        for (const card of sortedCards) { //Loop through each card in the cards array
            if (validCards.includes(card.value)) { //Checking if the card rank is in validCards
                if (firstSuit === null) { //firstSuit will be the standard suit
                    firstSuit = card.charAt(1); //Taking the second character (the suit) of the card string 
                } else if (firstSuit !== card.charAt(1)) { //firstSuit is not equal to current card
                    hasValidCards = false; //at least one card is out of suit
                    break;
                }
            } else {
                hasValidCards = false; //Card rank is not in validCards
                break;
            }
        }
        return hasValidCards && firstSuit != null;//hasValidCards is the valid ranks; firstSuit is the same suit
    }

    function isStraightFlush(sortedCards) {
        //Check for a straight flush
        const firstSuit = sortedCards[0].suit; //Card at index 0 will carry the suit standard (firstSuit)

        if (sortedCards.every(card => card.suit === firstSuit)) {//checking that all cards follow same suit as the firstSuit
            for (let i = 1; i < sortedCards.length; i++) { //Start at second card since we have firstSuit
                if (getCardRankValue(sortedCards[i - 1]) !== getCardRankValue(sortedCards[i] + 1)) {
                    // Check if the rank of the current card is not one less than the rank of the previous card
                    return false; //if false, it's not a straight with same suit
                }
            }
            return true
        }
        return false;
    }

    function isFourOfAKind(sortedCards) {
        //Check for four of a kind
        const rankCounts = {} //object to count the frequency of each rank

        for (const card of sortedCards) {
            const rank = card.value;

            rankCounts[rank] = (rankCounts[rank] || 0) + 1;

            if (rankCounts[rank] === 4) {
                return true //Checking if the same rank (value) appears 4 times
            }
        }
        return false;
    }

    function isFullHouse(sortedCards) {
        //Check for a full house
        const rankCounts = {} //object to count the frequency of each rank

        for (const card of sortedCards) {
            const rank = card.value;

            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        }

        const uniqueCardValues = Object.keys(rankCounts); //This holds the unique card values that were counted in sortedCards array

        if (uniqueCardValues.length === 2 && (rankCounts[uniqueCardValues[0] === 3 || rankCounts[uniqueCardValues[1]]] === 3)) {
            return true; // If there are exactly two different ranks and one of them appears three times, it's a full house
        }
        return false;
    }

    function isFlush(sortedCards) {
        //Check for a flush
        const firstSuit = sortedCards[0].suit; //The suit of the first card will have to be the same for all cards

        if (sortedCards.every(card => card.suit === firstSuit)) {//Check that the following cards are same suit
            return true;// All cards have the same suit, indicating a flush
        } else {
            return false;
        }
    }

    function isStraight(sortedCards) {
        //Check for a Stright
        for (let i = 1; i < sortedCards.length; i++) {
            if (getCardRankValue(sortedCards[i - 1]) !== getCardRankValue(sortedCards[i]) + 1) {//Checking if the next card is one value higher then previous
                return false; //If the next card in hand is not a sequence to the last card, if not a straight
            }
        }
        return true;
    }

    function isThreeOfAKind(sortedCards) {
        // Check for three of a kind
        const rankCounts = {}; // Object to count the frequency of each rank value

        for (const card of sortedCards) {
            const rank = card.value;

            rankCounts[rank] = (rankCounts[rank] || 0) + 1;

            if (rankCounts[rank] === 3) {
                return true; // Checking if the same rank (value) appears 3 times
            }
        }

        return false;
    }

    function isTwoPair(sortedCards) {
        //Check for a two pair
        const rankCounts = {}; //Object to count the frequency of each rank value

        for (const card of sortedCards) {
            const rank = card.value;

            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        }

        const counts = Object.values(rankCounts);
        const pairCount = counts.filter(count => count === 2).length;

        return pairCount === 2;
    }

    function isOnePair(sortedCards) {
        //Check for a one pair
        const rankCounts = {}; //Object to count the frequency of each rank value

        for (const card of sortedCards) {
            const rank = card.value;

            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        }

        const counts = Object.values(rankCounts);
        const pairCount = counts.filter(count => count === 2).length;

        return pairCount === 1;
    }
})();