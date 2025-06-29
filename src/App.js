import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './components/styles.css';

const values = ["🐶", "🐱", "🐼", "🦊", "🐵", "🐸", "🐷", "🐥"];
const frontContent = "❓";

const generateShuffledCards = () => {
  const cardPairs = values.flatMap((value, i) => {
    const pairId = i + 1;
    return [
      { id: `card-${i * 2}`, pairId, frontContent, backContent: value, isMatched: false },
      { id: `card-${i * 2 + 1}`, pairId, frontContent, backContent: value, isMatched: false }
    ];
  });
  return shuffleArray(cardPairs);
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex], shuffled[currentIndex]
    ];
  }
  return shuffled;
};

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [stepsMade, setStepsMade] = useState(0);
  const [checkedCards, setCheckedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setCards(generateShuffledCards());
  }, []);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const resetGameState = () => {
    setFlippedCards({});
    setCheckedCards([]);
    setGameOver(false);
    setStepsMade(0);
  };

  const handleCardFlip = async (cardId) => {
    const flippedIds = Object.keys(flippedCards);
    if (flippedIds.length >= 2 || flippedCards[cardId]) return;

    const newFlipped = { ...flippedCards, [cardId]: true };
    setFlippedCards(newFlipped);

    const updatedFlippedIds = Object.keys(newFlipped);
    if (updatedFlippedIds.length === 2) {
      const [firstId, secondId] = updatedFlippedIds;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.pairId === secondCard.pairId) {
        await delay(800);
        const updatedCards = cards.map(card =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        );
        setCards(updatedCards);
        handleAddCheckedCards([firstCard, secondCard]);
        setFlippedCards({});
      } else {
        await delay(2000);
        setFlippedCards({});
      }
      setStepsMade(prev => prev + 1);
    }
  };

  const handleAddCheckedCards = (newCards) => {
    setCheckedCards(prev => {
      const updated = [...prev, ...newCards];
      if (updated.length === values.length * 2) {
        setTimeout(() => setGameOver(true), 1000);
      }
      return updated;
    });
  };

  const handleShuffle = () => {
    const resetCards = cards.map(card => ({ ...card, isMatched: false }));
    setCards(shuffleArray(resetCards));
    resetGameState();
  };

  const handleRestart = () => {
    setCards(generateShuffledCards());
    resetGameState();
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
          {cards.map(card => (
            <Card
              key={card.id}
              isFlipped={!!flippedCards[card.id]}
              isMatched={card.isMatched}
              frontContent={card.frontContent}
              backContent={card.backContent}
              onClick={() => {
                if (!card.isMatched && !flippedCards[card.id]) {
                  handleCardFlip(card.id);
                }
              }}
            />
          ))}
          <h6 className="score">{stepsMade} Steps Made</h6>
        </>
      )}
    </div>
  );
}

export default App;
