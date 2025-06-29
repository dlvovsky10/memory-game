import React from 'react';
import './Card.css';

function Card({ isFlipped, isMatched, frontContent, backContent, onClick }) {
  return (
    <div className={`card-scene ${isMatched ? 'matched' : ''}`} onClick={onClick}>
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face card-front">{frontContent}</div>
        <div className="card-face card-back">{backContent}</div>
      </div>
    </div>
  );
}

export default Card;