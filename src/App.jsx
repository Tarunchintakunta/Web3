import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components and pages
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Staking from './pages/Staking';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';

// Import Web3 context provider
import { Web3Provider } from './contexts/Web3Context';

function App() {
  return (
    <Web3Provider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/send" element={<Send />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/book/:doctorId" element={<BookAppointment />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </Layout>
      </Router>
    </Web3Provider>
  );
}

export default App;