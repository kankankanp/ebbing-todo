"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ForgettingCurve from "./ForgettingCurve";
import { motion } from "framer-motion";

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  studyCount: number;
  retention: number;
}

interface TodoDetailProps {
  todoId: number;
}

export default function TodoDetail({ todoId }: TodoDetailProps) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodo();
  }, [todoId]);

  const fetchTodo = async () => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${todoId}`);

      if (response.status === 404) {
        throw new Error(`ID ${todoId} のタスクは存在しません`);
      }

      if (!response.ok) {
        throw new Error(`タスクの取得に失敗しました: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("サーバーからの応答がJSONではありません");
      }

      const data = await response.json();
      if (!data) {
        throw new Error("タスクが見つかりませんでした");
      }

      setTodo(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "タスクの取得に失敗しました";
      setError(errorMessage);
      console.error("Error fetching todo:", err);
    }
  };

  const handleStudy = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/todos/${todoId}/study`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("学習記録の追加に失敗しました");
      }

      fetchTodo();
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "学習記録の追加に失敗しました";
      setError(errorMessage);
      console.error("Error recording study:", err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              タスク一覧に戻る
            </Link>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-gray-400">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            タスク一覧に戻る
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-100 mb-2">
                {todo.title}
              </h1>
              {todo.description && (
                <p className="text-gray-400 mb-4">{todo.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>学習回数: {todo.studyCount}回</span>
                <span>定着率: {Math.round(todo.retention * 100)}%</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStudy}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
            >
              学習を記録
            </motion.button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">
            エビングハウスの忘却曲線
          </h2>
          <div className="flex justify-center w-full">
            <div className="w-[90%] max-w-[800px]">
              <ForgettingCurve
                studyCount={todo.studyCount}
                retention={todo.retention}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
