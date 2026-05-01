import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Ludo from './ludo/pages/Ludo';
import Lobby from './ludo/pages/Lobby';
import GameBoardPage from './ludo/pages/GameBoardPage';
import Home from './ludo/pages/Home';
import Footer from './ludo/pages/Footer';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ludo" element={<Ludo />} />
          <Route path="/lobby/:roomCode" element={<Lobby />} />
          <Route path="/game/:roomCode" element={<GameBoardPage />} />

        </Routes>     <Footer />
      </BrowserRouter>
    </GameProvider>
  );
}


export default App;
