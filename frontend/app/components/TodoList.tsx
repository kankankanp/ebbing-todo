"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// エビングハウスの忘却曲線の計算
const calculateForgettingRate = (hours: number): number => {
  const k = 0.1;
  return 1 - 1 / (1 + k * hours);
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3001/todos");
      if (!response.ok) {
        throw new Error("タスクの取得に失敗しました");
      }
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("タスクの取得に失敗しました");
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) {
        throw new Error("タスクの追加に失敗しました");
      }
      setNewTodo({ title: "", description: "" });
      fetchTodos();
      setError(null);
    } catch (err) {
      setError("タスクの追加に失敗しました");
      console.error("Error adding todo:", err);
    }
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok) {
        throw new Error("タスクの更新に失敗しました");
      }
      fetchTodos();
      setError(null);
    } catch (err) {
      setError("タスクの更新に失敗しました");
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("タスクの削除に失敗しました");
      }
      fetchTodos();
      setError(null);
    } catch (err) {
      setError("タスクの削除に失敗しました");
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">タスク管理</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* デバッグ情報の表示 */}
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">Todos count: {todos.length}</p>
          <pre className="text-xs text-gray-400 mt-2 overflow-auto">
            {JSON.stringify(todos, null, 2)}
          </pre>
        </div>

        <form onSubmit={addTodo} className="mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300"
                >
                  タイトル
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300"
                >
                  説明
                </label>
                <textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                タスクを追加
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {todos.map((todo) => {
            const createdAt = new Date(todo.createdAt);
            const now = new Date();
            const hours =
              (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
            const forgettingRate = calculateForgettingRate(hours);

            return (
              <div
                key={todo.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id, todo.completed)}
                      className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-medium ${
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-gray-100"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="mt-1 text-gray-400">{todo.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          忘却率: {(forgettingRate * 100).toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-500">
                          作成:{" "}
                          {new Date(todo.createdAt).toLocaleString("ja-JP")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/todos/${todo.id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                    >
                      詳細
                    </Link>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
