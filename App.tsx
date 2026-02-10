
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthState, User } from './types';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { Dashboard } from './components/Dashboard';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200">
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <h1 className="text-5xl font-extrabold text-blue-600 mb-4 tracking-tight">TaskFlow</h1>
    <p className="text-gray-600 text-xl max-w-lg mx-auto">
      Experience the future of productivity. A clean, modular task manager designed for teams that scale.
    </p>
    <div className="mt-10 space-x-4">
      <Link to="/signup" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition duration-200 inline-block">Start for Free</Link>
      <Link to="/login" className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition duration-200 inline-block">Live Demo</Link>
    </div>
  </div>
);

const Navbar: React.FC<{ auth: AuthState, onLogout: () => void }> = ({ auth, onLogout }) => (
  <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4 px-6 flex justify-between items-center">
    <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">TASKFLOW</Link>
    <div className="flex items-center space-x-6">
      <Link to="/" className="text-gray-600 font-medium hover:text-blue-600 transition">Home</Link>
      {auth.isAuthenticated ? (
        <>
          <Link to="/dashboard" className="text-gray-600 font-medium hover:text-blue-600 transition">Dashboard</Link>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Hi, {auth.user?.name.split(' ')[0]}</span>
            <button onClick={onLogout} className="text-red-500 text-sm font-bold hover:text-red-600">Logout</button>
          </div>
        </>
      ) : (
        <>
          <Link to="/login" className="text-gray-600 font-medium hover:text-blue-600 transition">Login</Link>
          <Link to="/signup" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100">Join</Link>
        </>
      )}
    </div>
  </nav>
);

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('taskflow_auth');
    return saved ? JSON.parse(saved) : {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false
    };
  });

  const handleLogin = (user: User, token: string) => {
    const newState = { user, token, isAuthenticated: true, loading: false };
    setAuth(newState);
    localStorage.setItem('taskflow_auth', JSON.stringify(newState));
  };

  const handleLogout = () => {
    const newState = { user: null, token: null, isAuthenticated: false, loading: false };
    setAuth(newState);
    localStorage.removeItem('taskflow_auth');
  };

  const handleUserUpdate = (updatedUser: User) => {
    const newState = { ...auth, user: updatedUser };
    setAuth(newState);
    localStorage.setItem('taskflow_auth', JSON.stringify(newState));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <Navbar auth={auth} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={auth.isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm onLogin={handleLogin} />} 
            />
            <Route 
              path="/signup" 
              element={auth.isAuthenticated ? <Navigate to="/dashboard" /> : <SignupForm />} 
            />
            <Route 
              path="/dashboard" 
              element={auth.isAuthenticated && auth.user ? <Dashboard user={auth.user} onUserUpdate={handleUserUpdate} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <footer className="bg-white border-t py-8 text-center text-gray-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} TaskFlow Assignment • Scalable Web Architecture
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
