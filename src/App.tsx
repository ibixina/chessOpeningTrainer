import { ChessTrainer } from "./ChessTrainer";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4">
        <h2 className="text-xl font-semibold">Chess Opening Trainer</h2>
      </header>
      <main className="flex-1 p-8">
        <div className="w-full max-w-6xl mx-auto">
          <ChessTrainer />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
