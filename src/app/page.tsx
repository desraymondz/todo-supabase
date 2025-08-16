"use client"
import React, { useState, useEffect } from 'react';

import { createClient } from '@/utils/supabase/client'

// Types
interface Todo {
  id: string;
  user_id: string;
  task_name: string;
  status: string;
  image_url?: string;
  created_at: string;
}

interface User {
  email: string;
}

// Mock data - replace with your actual data
const mockUser: User = { email: "user@example.com" };
const supabase = createClient();

async function fetchAllData() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  console.log('Fetched tasks:', data);

  return data || [];
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [status, setStatus] = useState<string>('Pending');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllData();
      console.log('Fetched todos:', data);
      setTodos(data);
    };

    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!taskName.trim()) return;

    let image_url: string | undefined;

    // 1. Grab the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    // 2. Upload image (if any) under user’s folder
    if (selectedImage) {
      const fileExt = selectedImage.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('todo-images')
        .upload(filePath, selectedImage);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }

      // 3. Get a public URL for the uploaded file
      if (uploadData) {
        const { data } = supabase.storage
          .from('todo-images')
          .getPublicUrl(uploadData.path);
        image_url = data.publicUrl;
      }
    }

    console.log("user:", user);
    // 4. Insert task record
    const { error } = await supabase
      .from("tasks")
      .insert({
        task_name: taskName.trim(),
        status: status,
        image_url: image_url,
        user_id: user.id
      });
      
    if (error) {
      console.error("Error creating task:", error);
      return;
    }

    // Fetch the updated list of tasks
    const updatedData = await fetchAllData();
    setTodos(updatedData);

    // Reset form
    setTaskName('');
    setStatus('Pending');
    setSelectedImage(null);
    setImagePreview('');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Todo App</h1>
          <p className="text-gray-600 mb-4">Manage your tasks efficiently and stay organized.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <span className="font-medium">Hello,</span> {mockUser.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Add Todo Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Task</h2>

            <div className="space-y-6">
              {/* Task Name */}
              <div>
                <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Name
                </label>
                <input
                  id="taskName"
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                  placeholder="Enter task name"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Tasks Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Your Tasks</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {todos.length} tasks
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {todos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No tasks yet. Add your first task!</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div key={todo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex-1">{todo.task_name}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(todo.status)}`}>
                        {todo.status}
                      </span>
                    </div>

                    {todo.image_url && (
                      <div className="mb-3">
                        <img
                          src={todo.image_url}
                          alt="Task"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}

                    <p className="text-sm text-gray-500">
                      Created: {new Date(todo.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}