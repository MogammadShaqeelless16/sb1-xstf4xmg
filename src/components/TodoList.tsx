import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Edit, Plus, Square, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Todo {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  completed: boolean;
}

interface TodoListProps {
  onClose: () => void;
}

export function TodoList({ onClose }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user?.id)
        .order('due_date', { ascending: true, nullsLast: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const todoData = {
        user_id: user?.id,
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date || null,
      };

      if (editingTodo) {
        const { error } = await supabase
          .from('todos')
          .update(todoData)
          .eq('id', editingTodo.id);

        if (error) throw error;
        toast.success('Todo updated successfully');
      } else {
        const { error } = await supabase
          .from('todos')
          .insert([todoData]);

        if (error) throw error;
        toast.success('Todo added successfully');
      }

      setFormData({ title: '', description: '', due_date: '' });
      setShowAddForm(false);
      setEditingTodo(null);
      loadTodos();
    } catch (error) {
      toast.error(editingTodo ? 'Failed to update todo' : 'Failed to add todo');
    }
  };

  const toggleComplete = async (todo: Todo) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id);

      if (error) throw error;
      loadTodos();
    } catch (error) {
      toast.error('Failed to update todo status');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Todo deleted successfully');
      loadTodos();
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      due_date: todo.due_date || '',
    });
    setShowAddForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <CheckSquare className="h-8 w-8 text-black mr-2" />
          <h2 className="text-2xl font-bold">Todo List</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-black text-white rounded-full hover:bg-black"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingTodo ? 'Edit Todo' : 'Add New Todo'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTodo(null);
                  setFormData({ title: '', description: '', due_date: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTodo(null);
                    setFormData({ title: '', description: '', due_date: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-black"
                >
                  {editingTodo ? 'Update' : 'Add'} Todo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">No todos yet. Add one to get started!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`border rounded-lg p-4 ${
                  todo.completed ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleComplete(todo)}
                      className="mt-1"
                    >
                      {todo.completed ? (
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <div>
                      <h3
                        className={`font-medium ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-gray-600 mt-1">{todo.description}</p>
                      )}
                      {todo.due_date && (
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(todo.due_date).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(todo)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}