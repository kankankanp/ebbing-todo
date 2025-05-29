"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ForgettingCurve from "../../components/ForgettingCurve";
import HamburgerMenu from "../../components/HamburgerMenu";

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

export default function TodoDetail({ params }: { params: { id: string } }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodo() {
      try {
        const response = await fetch(
          `http://localhost:3001/todos/${params.id}`
        );
        if (!response.ok) {
          throw new Error("タスクの取得に失敗しました");
        }
        const data = await response.json();
        setTodo(data);
        setError(null);
      } catch (err) {
        setError("タスクの取得に失敗しました");
        console.error("Error fetching todo:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodo();
  }, [params.id]);

  const handleStudy = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/todos/${params.id}/study`,
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
      setError("学習記録の追加に失敗しました");
      console.error("Error recording study:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
        <div className="text-red-500">{error || "タスクが見つかりません"}</div>
      </div>
    );
  }

  return (
    <>
      <HamburgerMenu navLinks={[{ href: "/todos", label: "タスク一覧" }]} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 mb-8"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">
                  {todo.title}
                </h1>
                {todo.description && (
                  <p className="text-blue-600">{todo.description}</p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStudy}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                学習を記録
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  学習状態
                </h3>
                <div className="space-y-2">
                  <p className="text-blue-600">
                    学習回数:{" "}
                    <span className="font-medium">{todo.studyCount}回</span>
                  </p>
                  <p className="text-blue-600">
                    定着率:{" "}
                    <span className="font-medium">
                      {Math.round(todo.retention * 100)}%
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  次の学習タイミング
                </h3>
                <p className="text-blue-600">
                  次回の学習は、定着率が50%を下回る前に実施することをお勧めします。
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                忘却曲線
              </h3>
              <div className="w-[90%] h-[600px] mx-auto">
                <ForgettingCurve
                  studyCount={todo.studyCount}
                  retention={todo.retention}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
