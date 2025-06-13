import React, { useState, useEffect, useCallback } from 'react';
import { Card, GameState } from './types';
import { cardPairs, difficultyLevels } from './gameData';

interface BlockProps {
  title?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

const Block: React.FC<BlockProps> = ({ 
  title = "Memory Game ISO 13485", 
  difficulty = 'medium' 
}) => {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timeElapsed: 0,
    gameStatus: 'not-started'
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>(difficulty);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.gameStatus === 'playing' && startTime) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: Math.floor((Date.now() - startTime) / 1000)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.gameStatus, startTime]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const pairsCount = difficultyLevels[selectedDifficulty].pairs;
    const selectedPairs = cardPairs.slice(0, pairsCount);
    
    const gameCards: Card[] = [];
    
    selectedPairs.forEach((pair, index) => {
      // Term card
      gameCards.push({
        id: index * 2,
        type: 'term',
        content: pair.term,
        matchId: pair.id,
        isFlipped: false,
        isMatched: false
      });
      
      // Definition card
      gameCards.push({
        id: index * 2 + 1,
        type: 'definition',
        content: pair.definition,
        matchId: pair.id,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);

    setGameState({
      cards: shuffledCards,
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      timeElapsed: 0,
      gameStatus: 'playing'
    });
    
    setStartTime(Date.now());
  }, [selectedDifficulty]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const card = gameState.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    if (gameState.flippedCards.length === 2) return;

    const newFlippedCards = [...gameState.flippedCards, cardId];
    
    setGameState(prev => ({
      ...prev,
      cards: prev.cards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      ),
      flippedCards: newFlippedCards
    }));

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = gameState.cards.find(c => c.id === firstCardId);
      const secondCard = gameState.cards.find(c => c.id === secondCardId);

      setTimeout(() => {
        if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
          // Match found
          const newMatchedPairs = gameState.matchedPairs + 1;
          const totalPairs = difficultyLevels[selectedDifficulty].pairs;
          
          setGameState(prev => ({
            ...prev,
            cards: prev.cards.map(c => 
              c.id === firstCardId || c.id === secondCardId 
                ? { ...c, isMatched: true } 
                : c
            ),
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            moves: prev.moves + 1,
            gameStatus: newMatchedPairs === totalPairs ? 'completed' : 'playing'
          }));

          // Send completion event if game is completed
          if (newMatchedPairs === totalPairs) {
            const finalTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
            window.postMessage({ 
              type: 'BLOCK_COMPLETION', 
              blockId: 'memory-iso13485', 
              completed: true,
              score: Math.max(0, 1000 - (gameState.moves + 1) * 10 - finalTime),
              maxScore: 1000,
              timeSpent: finalTime,
              data: { moves: gameState.moves + 1, difficulty: selectedDifficulty }
            }, '*');
            window.parent.postMessage({ 
              type: 'BLOCK_COMPLETION', 
              blockId: 'memory-iso13485', 
              completed: true,
              score: Math.max(0, 1000 - (gameState.moves + 1) * 10 - finalTime),
              maxScore: 1000,
              timeSpent: finalTime,
              data: { moves: gameState.moves + 1, difficulty: selectedDifficulty }
            }, '*');
          }
        } else {
          // No match, flip cards back
          setGameState(prev => ({
            ...prev,
            cards: prev.cards.map(c => 
              c.id === firstCardId || c.id === secondCardId 
                ? { ...c, isFlipped: false } 
                : c
            ),
            flippedCards: [],
            moves: prev.moves + 1
          }));
        }
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f7fa'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#2c5aa0', 
          marginBottom: '10px',
          fontSize: '2.2em'
        }}>
          {title}
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1em',
          marginBottom: '20px'
        }}>
          Associez les termes ISO 13485 avec leurs définitions
        </p>

        {gameState.gameStatus === 'not-started' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Choisissez votre niveau de difficulté :
              </label>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                style={{
                  padding: '10px 15px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '2px solid #ddd',
                  backgroundColor: '#fff'
                }}
              >
                <option value="easy">{difficultyLevels.easy.description}</option>
                <option value="medium">{difficultyLevels.medium.description}</option>
                <option value="hard">{difficultyLevels.hard.description}</option>
              </select>
            </div>
            <button 
              onClick={initializeGame}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '15px 30px',
                fontSize: '18px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Commencer le jeu
            </button>
          </div>
        )}

        {gameState.gameStatus === 'playing' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ color: '#333', fontSize: '16px' }}>
              <strong>Temps: {formatTime(gameState.timeElapsed)}</strong>
            </div>
            <div style={{ color: '#333', fontSize: '16px' }}>
              <strong>Coups: {gameState.moves}</strong>
            </div>
            <div style={{ color: '#333', fontSize: '16px' }}>
              <strong>Paires trouvées: {gameState.matchedPairs}/{difficultyLevels[selectedDifficulty].pairs}</strong>
            </div>
          </div>
        )}

        {gameState.gameStatus === 'completed' && (
          <div style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '20px', 
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <h2>🎉 Félicitations !</h2>
            <p>Vous avez terminé le jeu en {formatTime(gameState.timeElapsed)} avec {gameState.moves} coups !</p>
            <button
              onClick={() => {
                setGameState({
                  cards: [],
                  flippedCards: [],
                  matchedPairs: 0,
                  moves: 0,
                  timeElapsed: 0,
                  gameStatus: 'not-started'
                });
                setStartTime(null);
              }}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Rejouer
            </button>
          </div>
        )}
      </div>

      {gameState.gameStatus === 'playing' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          padding: '20px'
        }}>
          {gameState.cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                backgroundColor: card.isMatched ? '#d4edda' : card.isFlipped ? '#fff3cd' : '#e9ecef',
                border: card.isMatched ? '3px solid #28a745' : card.isFlipped ? '3px solid #ffc107' : '3px solid #dee2e6',
                borderRadius: '10px',
                padding: '20px',
                minHeight: '120px',
                cursor: card.isMatched ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transform: card.isFlipped || card.isMatched ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              {card.isFlipped || card.isMatched ? (
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {card.type === 'term' ? 'TERME' : 'DÉFINITION'}
                  </div>
                  <div style={{ lineHeight: '1.4' }}>
                    {card.content}
                  </div>
                </div>
              ) : (
                <div style={{ 
                  fontSize: '24px', 
                  color: '#2c5aa0',
                  fontWeight: 'bold'
                }}>
                  ISO 13485
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Block;