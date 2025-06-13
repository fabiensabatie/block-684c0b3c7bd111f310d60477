export interface Card {
  id: number;
  type: 'term' | 'definition';
  content: string;
  matchId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  moves: number;
  timeElapsed: number;
  gameStatus: 'playing' | 'completed' | 'not-started';
}