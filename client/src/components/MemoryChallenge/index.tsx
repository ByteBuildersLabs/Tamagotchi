import React, { useState, useEffect } from 'react';
import './main.css';

function MemoryChallenge() {
  const colors = ['#f5c242', '#e4a101'];
  const [cards, setCards] = useState<number[]>(Array(16).fill(0));
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newSequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 16));
    setSequence(newSequence);
    setUserSequence([]);
    setMessage('');
    showSequence(newSequence);
  };

  const showSequence = (sequence: number[]) => {
    setIsShowing(true);
    sequence.forEach((index, i) => {
      setTimeout(() => {
        setCards(prev => prev.map((card, idx) => (idx === index ? 1 : card)));
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => (idx === index ? 0 : card)));
          if (i === sequence.length - 1) setIsShowing(false);
        }, 500);
      }, i * 1000);
    });
  };

  const handleCardClick = (index: number) => {
    if (isShowing || userSequence.length >= sequence.length) return;

    setUserSequence([...userSequence, index]);

    if (sequence[userSequence.length] !== index) {
      setMessage('Incorrect! Try again.');
      setUserSequence([]);
    } else if (userSequence.length + 1 === sequence.length) {
      setUserSequence([]);
      setMessage('Correct! You remembered the sequence.');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
      <h1>Memory Challenge</h1>
      {message && <div className="message">{message}</div>}
      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${card ? 'active' : ''}`}
            style={{
              backgroundColor: card ? colors[index % colors.length] : undefined,
              backgroundImage: card ? undefined : 'url(src/assets/img/logo.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      <button onClick={startNewGame} className="restart-button">Restart Game</button>
    </div>
  );
}

export default MemoryChallenge;
