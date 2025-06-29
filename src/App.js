import React, { useState, useEffect } from 'react';
import Card from './components/Card';
//import './App.css';

const values = ["🐶", "🐱", "🐼", "🦊", "🐵", "🐸", "🐷", "🐥"];
const frontContent = "❓";

function App() {
  const [cards, dealWithCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  
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

  const handleCardFlip = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
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