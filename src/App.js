import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './components/styles.css'
//import './App.css';

const values = ["🐶", "🐱", "🐼", "🦊", "🐵", "🐸", "🐷", "🐥"];
const frontContent = "❓";

function App() {
  const [cards, dealWithCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [flippedCardsNum, setFlippedCardsNum] = useState(0);
  const [stepsMade, UpdateSteps] = useState(0)
  const [checkedCards, updateCheckedCards] = useState([])
  const [gameOver, setGameOver] = useState(false)
  
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
        backContent: values[i],
        isMatched: false // Add matched state
      });
      
      // Add second card of the pair
      initialCards.push({
        id: `card-${i * 2 + 1}`, // Unique ID for each card
        pairId: pairId, // Same pair ID as its match
        frontContent: frontContent,
        backContent: values[i],
        isMatched: false // Add matched state
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
    
    // Find the cards
    const firstCardId = Object.keys(flippedCards)[0];    
    const firstCard = cards.find(card => card.id === firstCardId);
    const secondCard = cards.find(card => card.id === cardId);

    // Check if both cards match
    if (firstCard.pairId === secondCard.pairId) {
      // Wait a moment to show the match, then animate out
      await delay(800);
      
      // Mark matched cards as matched (triggers animation)
      const updatedCards = cards.map(card => {
        if (card.id === firstCard.id || card.id === secondCard.id) {
          return { ...card, isMatched: true };
        }
        return card;
      });
      
      dealWithCards(updatedCards);
      handleAddCard(firstCard);
      handleAddCard(secondCard);
      
      // Reset immediately for matched cards
      setFlippedCards({});
      setFlippedCardsNum(0);
      UpdateSteps(stepsMade + 1);
    } else {
      // Wait 2 seconds for non-matching cards
      await delay(2000);
      
      // Close all cards, reset counter, and update steps made
      setFlippedCards({});
      setFlippedCardsNum(0);
      UpdateSteps(stepsMade + 1);
    }
  }
};

  // Add card to checked Array
  const handleAddCard = (newCard) => {
  // Use the functional update form to avoid race conditions
  updateCheckedCards(prevCheckedCards => {
    const newCheckedCards = [...prevCheckedCards, newCard];
    
    // Now, check for the game-over condition *inside* this callback
    if (newCheckedCards.length === values.length * 2) {
      setTimeout(() => setGameOver(true), 1000); // Delay to show final animation
    }
    
    // Return the new state
    return newCheckedCards;
  });
}

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
    // Reset all cards to unmatched state when shuffling
    const resetCards = cards.map(card => ({ ...card, isMatched: false }));
    const shuffledArray = shuffleArray(resetCards);
    dealWithCards(shuffledArray);
    setFlippedCards({}); // Reset flip states when shuffling
    updateCheckedCards([]); // Reset checked cards
    setGameOver(false); // Reset game over state
    UpdateSteps(0); // Reset steps
  };

  const handleRestart = () => {
    // Create fresh cards and shuffle them
    const initialCards = [];
    
    for (let i = 0; i < values.length; i++) {
      const pairId = i + 1;
      
      initialCards.push({
        id: `card-${i * 2}`,
        pairId: pairId,
        frontContent: frontContent,
        backContent: values[i],
        isMatched: false
      });
      
      initialCards.push({
        id: `card-${i * 2 + 1}`,
        pairId: pairId,
        frontContent: frontContent,
        backContent: values[i],
        isMatched: false
      });
    }
    
    const shuffledCards = shuffleArray(initialCards);
    dealWithCards(shuffledCards);
    setFlippedCards({});
    updateCheckedCards([]);
    setGameOver(false);
    UpdateSteps(0);
    setFlippedCardsNum(0);
  };

  return (
    <div className="App">
      {gameOver ? (
        <div className="game-over-screen">
          <h1 className="victory-title">🎉 VICTORY! 🎉</h1>
          <p className="steps-display">You completed the game in <strong>{stepsMade}</strong> steps!</p>
          <button className="restart-button" onClick={handleRestart}>
            🔄 Play Again
          </button>
        </div>
      ) : (
        <>
          {cards.map((card, index) => (
            <Card
              key={card.id} // Use the unique card ID as key
              isFlipped={flippedCards[card.id] || false}
              isMatched={card.isMatched || false} // Pass matched state
              frontContent={card.frontContent}
              backContent={card.backContent}
              onClick={() => !card.isMatched && handleCardFlip(card.id)} // Prevent clicking matched cards
            />
          ))}
          <button onClick={handleShuffle} style={{gridColumn: '1 / -1', marginTop: '20px'}}>
            Shuffle Cards
          </button>
          <h6 className="score">
            {stepsMade} Steps Made
          </h6>
        </>
      )}
    </div>
  );
}

export default App;