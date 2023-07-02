
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Entry from './Pages/Entry.js';
import Map from './Pages/Map.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Entry}/>
        <Route path='/map' Component={Map}/>
      </Routes>
    </Router>
  );
};

export default App;

