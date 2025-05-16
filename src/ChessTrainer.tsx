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
  const currentLine = useRef<{ from: string; to: string; promotion?: string; san: string }[]>([]);
  const originalLine = useRef<{ from: string; to: string; promotion?: string; san: string }[]>([]);

  const handlePgnUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const tempChess = new Chess();
        tempChess.loadPgn(text); // reads the pgn
        // the pgn file from lichess contains multiple games, so need to parse and build a tree with all different lines

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
    setHasOpeningLoaded(true);
  };

  const makeMove = (move: any) => {
    try {
      console.log(`Trying to make a move: `, move);
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      // console.log("Length current line", currentLine.current.length);

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

                if (currentLine.current.length === 0) {
                  toast.success("End of line reached! Resetting position...");
                  resetPosition();
                }
              }, 300);
            } else {
              // reset the position
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

        // check if line is empty
        if (currentLine.current.length === 0) {
          toast.success("End of line reached! Resetting position...");
          resetPosition();
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
    console.log(playerColor, game.turn());
    if (!playerColor || game.turn() !== playerColor[0]) return false;

    return makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
  };

  return (
    <div className="flex flex-row gap-8">
      {/* Left side: Chessboard */}
      <div className="w-[60%]">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
      />
      </div>

      {/* Right side: Controls and Info */}
      <div className="w-[40%] flex flex-col gap-4">
      <div>
        <input
        type="file"
        accept=".pgn"
        onChange={handlePgnUpload}
        className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
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
            const newGame = new Chess(); // Start from initial position
            const firstMove = originalLine.current[0]; // Use original line to get the first move
            if (firstMove) {
            const result = newGame.move({
              from: firstMove.from,
              to: firstMove.to,
              promotion: firstMove.promotion,
            });
            if (result) {
              currentLine.current = [...originalLine.current]; // Reset currentLine
              currentLine.current.shift(); // Remove the first move as it's made by computer
              setGame(newGame);
            } else {
              toast.error("Failed to make the first move for black.");
            }
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
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        >
          Reset Position
        </button>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Current Position FEN</h3>
        <div className="font-mono bg-gray-100 p-2 rounded text-sm break-all">
        {game.fen()}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Remaining Moves in Line</h3>
        <div className="font-mono bg-gray-100 p-2 rounded text-sm max-h-60 overflow-y-auto">
        {currentLine.current.map((move, i) => (
          <span key={i} className="mr-1">
          {move?.san || "Unknown"}
          </span>
        ))}
        {currentLine.current.length === 0 && hasOpeningLoaded && (
          <span>No more moves in this line.</span>
        )}
         {!hasOpeningLoaded && (
          <span>Load a PGN to see moves.</span>
        )}
        </div>
      </div>
      </div>
    </div>
  );
}
