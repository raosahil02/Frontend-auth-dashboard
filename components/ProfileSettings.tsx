
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface Props {
  user: User;
  onUpdate: (user: User) => void;
}

export const ProfileSettings: React.FC<Props> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const updatedUser = await api.updateProfile(user.id, { name, email });
      onUpdate(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (ReadOnly)</label>
          <input 
            disabled
            type="email" 
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            value={email}
          />
        </div>
        <div className="pt-4">
          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
