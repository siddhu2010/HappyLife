import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import Stories from './pages/Stories';
import VideoCall from './pages/VideoCall';

const App = () => {
  useEffect(() => {
    // Force dark mode for our Instagram clone
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="chat" element={<ChatList />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="stories" element={<Stories />} />
            <Route path="video-call/:id" element={<VideoCall />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
