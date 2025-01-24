import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Brain, Film, CheckSquare, Users, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Quiz } from '../components/Quiz';
import { MovieCatalog } from '../components/MovieCatalog';
import { TodoList } from '../components/TodoList';
import { UserManagement } from '../components/UserManagement';
import { AuditLogs } from '../components/AuditLogs';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMovies, setShowMovies] = useState(false);
  const [showTodos, setShowTodos] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-black"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showQuiz ? (
            <Quiz onClose={() => setShowQuiz(false)} />
          ) : showMovies ? (
            <MovieCatalog onClose={() => setShowMovies(false)} />
          ) : showTodos ? (
            <TodoList onClose={() => setShowTodos(false)} />
          ) : showUsers ? (
            <UserManagement onClose={() => setShowUsers(false)} />
          ) : showAuditLogs ? (
            <AuditLogs onClose={() => setShowAuditLogs(false)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <Brain className="h-16 w-16 text-black mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Challenge</h2>
                  <p className="text-gray-600">Test your knowledge across different categories</p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <Film className="h-16 w-16 text-black mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Movie Catalog</h2>
                  <p className="text-gray-600">Explore and discover your favorite movies</p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowMovies(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Browse Movies
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <CheckSquare className="h-16 w-16 text-black mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Todo List</h2>
                  <p className="text-gray-600">Manage your tasks and stay organized</p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowTodos(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    View Todos
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <Users className="h-16 w-16 text-black mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
                  <p className="text-gray-600">View and manage user accounts</p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowUsers(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Manage Users
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <AlertCircle className="h-16 w-16 text-black mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Logs</h2>
                  <p className="text-gray-600">Monitor application events and errors</p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAuditLogs(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    View Logs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}