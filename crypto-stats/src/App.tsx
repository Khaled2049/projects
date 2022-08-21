import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Space } from 'antd';
import {
  Navbar,
  Homepage,
  Exchanges,
  Crypto,
  CryptoDetails,
  News,
} from './components';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="main">
        <Layout>
          <div className="routes">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/exchanges" element={<Exchanges />} />
              <Route path="/crypto" element={<Crypto />} />
              <Route path="/crypto/:coinId" element={<CryptoDetails />} />
              <Route path="/news" element={<News />} />
            </Routes>
          </div>
        </Layout>
        <div className="footer">
          <Typography.Title
            level={5}
            style={{ color: 'white', textAlign: 'center' }}
          >
            Suppity sup?
          </Typography.Title>
          <Space>
            <Link to="/">Home</Link>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default App;
