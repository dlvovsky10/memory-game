import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Card from './components/Card'

function App() {

  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <Card 
      isFlipped={flipped}
      frontContent="❓"
      backContent="🃏"
      onClick =  {() => setFlipped(!flipped)}
      />
    </div>
  );
}

export default App;
