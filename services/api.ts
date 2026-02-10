
import { User, Task } from '../types';

const USERS_KEY = 'taskflow_users';
const TASKS_KEY = 'taskflow_tasks';

const getUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const api = {
  // AUTH
  signup: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    if (users.find(u => u.email === email)) throw new Error('User already exists');
    const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return { user: { id: newUser.id, name: newUser.name, email: newUser.email }, token: "jwt_" + newUser.id };
  },

  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise(r => setTimeout(r, 600));
    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return { user: { id: user.id, name: user.name, email: user.email }, token: "jwt_" + user.id };
  },

  // PROFILE
  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { id: users[index].id, name: users[index].name, email: users[index].email };
  },

  // TASKS CRUD
  fetchTasks: async (userId: string): Promise<Task[]> => {
    await new Promise(r => setTimeout(r, 400));
    return getTasks().filter(t => t.userId === userId);
  },

  createTask: async (userId: string, title: string, description: string): Promise<Task> => {
    await new Promise(r => setTimeout(r, 400));
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const tasks = getTasks();
    localStorage.setItem(TASKS_KEY, JSON.stringify([newTask, ...tasks]));
    return newTask;
  },

  toggleTask: async (taskId: string): Promise<Task> => {
    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    tasks[index].status = tasks[index].status === 'completed' ? 'pending' : 'completed';
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[index];
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const tasks = getTasks().filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
};
