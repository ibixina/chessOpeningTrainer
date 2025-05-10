import { useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { toast } from "sonner";

type Color = "white" | "black";

export function ChessTrainer() {
  const [game, setGame] = useState(new Chess());
  const [orientation, setOrientation] = useState<Color>("white");
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [hasOpeningLoaded, setHasOpeningLoaded] = useState(false);
  const currentLine = useRef<any[]>([]);
  const originalLine = useRef<any[]>([]);

  const handlePgnUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const tempChess = new Chess();
        tempChess.loadPgn(text);
        
        const moves = tempChess.history({ verbose: true });
        originalLine.current = [...moves];
        currentLine.current = [...moves];
        setGame(new Chess());
        setHasOpeningLoaded(true);
        setPlayerColor(null);
        toast.success("Opening loaded!");
      } catch (err) {
        toast.error("Invalid PGN file");
      }
    };
    reader.readAsText(file);
  };

  const resetPosition = () => {
    setGame(new Chess());
    setPlayerColor(null);
    currentLine.current = [...originalLine.current];
    setHasOpeningLoaded(false);
  };

  const makeMove = (move: any) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      
      if (result) {
        setGame(gameCopy);
        
        // Check if there's a next move in the line
        if (currentLine.current.length > 0) {
          const expectedMove = currentLine.current[0];
          
          // Verify the player's move matches the expected move
          if (move.from === expectedMove.from && move.to === expectedMove.to) {
            currentLine.current.shift(); // Remove the player's move
            
            // Make the computer's move if there is one
            if (currentLine.current.length > 0) {
              const computerMove = currentLine.current[0];
              setTimeout(() => {
                const newGame = new Chess(gameCopy.fen());
                const result = newGame.move({
                  from: computerMove.from,
                  to: computerMove.to,
                  promotion: computerMove.promotion,
                });
                if (result) {
                  currentLine.current.shift(); // Remove computer's move
                  setGame(newGame);
                }
              }, 300);
            }
          } else {
            toast.error("Incorrect move! Try again.");
            setGame(game); // Revert to previous position
            return false;
          }
        } else {
          toast.success("End of line reached! Starting over...");
          setTimeout(() => {
            const newGame = new Chess();
            currentLine.current = [...originalLine.current];
            setGame(newGame);
            
            if (playerColor === "black") {
              const firstMove = currentLine.current[0];
              if (firstMove) {
                newGame.move({
                  from: firstMove.from,
                  to: firstMove.to,
                  promotion: firstMove.promotion,
                });
                currentLine.current.shift();
                setGame(newGame);
              }
            }
          }, 1000);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Move error:", err);
      return false;
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!playerColor || game.turn() !== playerColor[0]) return false;
    
    return makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="mb-4">
          <input
            type="file"
            accept=".pgn"
            onChange={handlePgnUpload}
            className="mb-4 block"
          />
          
          {hasOpeningLoaded && !playerColor && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setPlayerColor("white");
                  setOrientation("white");
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Play as White
              </button>
              <button
                onClick={() => {
                  setPlayerColor("black");
                  setOrientation("black");
                  const newGame = new Chess();
                  const firstMove = currentLine.current[0];
                  if (firstMove) {
                    newGame.move({
                      from: firstMove.from,
                      to: firstMove.to,
                      promotion: firstMove.promotion,
                    });
                    currentLine.current.shift();
                    setGame(newGame);
                  }
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Play as Black
              </button>
            </div>
          )}
          
          {playerColor && (
            <button
              onClick={resetPosition}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reset Position
            </button>
          )}
        </div>
        <div className="w-full max-w-[600px] mx-auto">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
          />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">Current Position</h3>
        <div className="font-mono">{game.fen()}</div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Remaining Moves</h3>
          <div className="font-mono">
            {currentLine.current.map((move, i) => (
              <span key={i}>{move.san} </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
