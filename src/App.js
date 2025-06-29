import React, { useState, useEffect } from 'react';
import Card from './components/Card';
//import './App.css';

const values = ["🐶", "🐱", "🐼", "🦊", "🐵", "🐸", "🐷", "🐥"];
const frontContent = "❓";

function App() {
  const [cards, dealWithCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [flippedCardsNum, setFlippedCardsNum] = useState(0);
  
  useEffect(() => {
    const initialCards = [];
    
    // Create 2 cards for each value, each with a unique ID
    for (let i = 0; i < values.length; i++) {
      const pairId = i + 1; // This identifies which pair they belong to
      
      // Add first card of the pair
      initialCards.push({
        id: `card-${i * 2}`, // Unique ID for each card
        pairId: pairId, // Which pair this card belongs to
        frontContent: frontContent,
        backContent: values[i]
      });
      
      // Add second card of the pair
      initialCards.push({
        id: `card-${i * 2 + 1}`, // Unique ID for each card
        pairId: pairId, // Same pair ID as its match
        frontContent: frontContent,
        backContent: values[i]
      });
    }
    
    // Shuffle the cards
    const shuffledCards = shuffleArray(initialCards);
    dealWithCards(shuffledCards);
  }, []);

  // Helper function to create delays
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  
const handleCardFlip = async (cardId) => {
  // Prevent clicking if 2 cards are already flipped
  if (flippedCardsNum >= 2) {
    return;
  }

  if (flippedCardsNum === 0) {
    // First card: flip it and keep it open
    setFlippedCardsNum(1);
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: true
    }));
  } else if (flippedCardsNum === 1) {
    // Second card: flip it, show for 2 seconds, then close both
    setFlippedCardsNum(2);
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: true
    }));
    
    // Wait 2 seconds
    await delay(2000);
    
    // Close all cards and reset counter
    setFlippedCards({});
    setFlippedCardsNum(0);
    }
  };

  // Shuffle the array
  const shuffleArray = (array) => {
    const shuffled = [...array]; // Create a shallow copy to avoid mutating the original array
    let currentIndex = shuffled.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    }
    return shuffled;
  };

  const handleShuffle = () => {
    const shuffledArray = shuffleArray(cards);
    dealWithCards(shuffledArray);
    setFlippedCards({}); // Reset flip states when shuffling
  };

  return (
    <div className="App">
      {cards.map((card, index) => (
        <Card
          key={card.id} // Use the unique card ID as key
          isFlipped={flippedCards[card.id] || false}
          frontContent={card.frontContent}
          backContent={card.backContent}
          onClick={() => handleCardFlip(card.id)}
        />
      ))}
      <button onClick={handleShuffle} style={{gridColumn: '1 / -1', marginTop: '20px'}}>
        Shuffle Cards
      </button>
    </div>
  );
}

export default App;