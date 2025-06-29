import React from 'react';
import './Card.css';

function Card({ isFlipped, frontContent, backContent, onClick }) {
  return (
    <div className="card-container" onClick={onClick}>
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face card-front">{frontContent}</div>
        <div className="card-face card-back">{backContent}</div>
      </div>
    </div>
  );
}

export default Card;
