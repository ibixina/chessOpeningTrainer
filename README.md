# Chess Opening Trainer

A modern web application for practicing chess openings through interactive training sessions. Built with React, Chess.js, and Convex.

## Features

- 📚 Load and practice chess openings from PGN files
- 🎮 Interactive chessboard with drag-and-drop moves
- ⚪️ Play as either White or Black
- ✅ Immediate feedback on move accuracy
- 🔄 Automatic position reset when reaching end of line
- 📊 Move validation against opening lines
- 🎯 Multiple games/variations support

## Tech Stack

- **Frontend:**
  - React with TypeScript
  - Chess.js for game logic
  - React-Chessboard for the interactive board
  - Tailwind CSS for styling
  - Sonner for toast notifications

- **Backend:**
  - Convex for backend services
  - Anonymous authentication
  - Real-time data synchronization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chessOpeningTrainer.git
cd chessOpeningTrainer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. **Upload an Opening:**
   - Click "Choose File" to upload a PGN file
   - The first game/variation will be loaded automatically

2. **Select Your Side:**
   - Choose to play as White or Black
   - The computer will automatically play the opposite side

3. **Practice the Opening:**
   - Make moves by dragging pieces
   - Receive immediate feedback on move accuracy
   - The position resets automatically when you reach the end

## Project Structure

```
chessOpeningTrainer/
├── src/
│   ├── ChessTrainer.tsx    # Main game component
│   ├── App.tsx             # Root component
│   └── index.css           # Global styles
├── convex/
│   ├── schema.ts           # Database schema
│   └── router.ts           # API routes
└── public/                 # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Environment Variables

```env
VITE_CONVEX_URL=your_convex_deployment_url
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Chess.js](https://github.com/jhlywa/chess.js) for chess logic
- [React-Chessboard](https://github.com/Clariity/react-chessboard) for the chessboard component
- [Convex](https://www.convex.dev/) for backend services

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Roadmap

- [ ] Save and load training progress
- [ ] Opening statistics and analytics
- [ ] Multiple variation support
- [ ] Custom opening creation
- [ ] Spaced repetition training