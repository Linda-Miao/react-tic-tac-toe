// 1️Import React hook
import { useState } from "react";
import "./App.css";
// useState lets a component "remember" data (state)
// Analogy: sticky note attached to a tile to track changes

// 2 Square component
function Square({ value, onSquareClick }) {
  // Props:
  // value -> 'X', 'O', or null (what to display)
  // onSquareClick -> function called when clicked
  // Analogy: a chessboard tile that only shows mark and reports clicks
  return (
    <button
      className="square" // CSS styling
      onClick={onSquareClick} // click event
    >
      {value} {/* show 'X', 'O', or nothing */}
    </button>
  );
}

// 3️ Board component
function Board({ xIsNext, squares, onPlay }) {
  // Board manages 9 squares, handles clicks

  function handleClick(i) {
    // Stop if game already has winner or square is filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Copy squares array to avoid mutating original
    const nextSquares = squares.slice();

    // Update the square depending on turn
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    // Inform Game component about updated board
    onPlay(nextSquares);
  }

  // Status display
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner; // show winner
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O"); // show next turn
  }
  // Analogy: scoreboard in a match

  // Render board
  return (
    <>
      <div className="status">{status}</div>
      {/* Three rows of squares */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      {/* Each row is a line, each square is a tile */}
    </>
  );
}

// 4️ Game component
export default function Game() {
  // History of moves (array of board states)
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0; // X moves on even turns
  const currentSquares = history[currentMove]; // current board

  // Handle new move
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Jump to specific move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Generate move list buttons
  const moves = history.map((squares, move) => {
    const description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Render game
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol> {/* ordered list of move buttons */}
      </div>
      {/* Analogy: left = live board, right = move timeline */}
    </div>
  );
}

// 5️ Helper function: check winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // 'X' or 'O' wins
      // Analogy: referee sees a complete row/column/diagonal
    }
  }
  return null; // no winner yet
}
