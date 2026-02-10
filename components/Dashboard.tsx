
import React, { useState, useEffect } from 'react';
import { User, Task } from '../types';
import { api } from '../services/api';
import { TaskItem } from './TaskItem';
import { ProfileSettings } from './ProfileSettings';

interface Props {
  user: User;
  onUserUpdate: (user: User) => void;
}

export const Dashboard: React.FC<Props> = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'profile'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (activeTab === 'tasks') {
      loadTasks();
    }
  }, [activeTab]);

  const loadTasks = async () => {
    try {
      const data = await api.fetchTasks(user.id);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    try {
      const newTask = await api.createTask(user.id, newTitle, newDesc);
      setTasks([newTask, ...tasks]);
      setNewTitle('');
      setNewDesc('');
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updated = await api.toggleTask(id);
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hi, {user.name}!</h1>
          <p className="text-gray-500">Manage your workspace and personal information.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'tasks' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Tasks
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Profile
          </button>
        </div>
      </div>

      {activeTab === 'tasks' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Your Tasks</h2>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              {isAdding ? 'Cancel' : '+ Add Task'}
            </button>
          </div>

          {/* Add Task Form */}
          {isAdding && (
            <form onSubmit={handleAddTask} className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <input 
                autoFocus
                className="w-full text-xl font-bold outline-none placeholder:text-gray-300"
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea 
                className="w-full text-gray-600 outline-none resize-none placeholder:text-gray-300"
                placeholder="Add some details..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
              />
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition">Save Task</button>
              </div>
            </form>
          )}

          {/* Search & List */}
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="min-h-[300px]">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No tasks found. Relax!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <ProfileSettings user={user} onUpdate={onUserUpdate} />
      )}
    </div>
  );
};
