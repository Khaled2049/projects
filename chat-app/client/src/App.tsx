import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Join from './components/Join';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route index element={<Join />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
