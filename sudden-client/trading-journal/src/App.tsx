import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddTradePage from './pages/AddTradePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add-trade" element={<AddTradePage />} />
      <Route path="/edit-trade/:id" element={<AddTradePage />} />
    </Routes>
  );
}

export default App;
