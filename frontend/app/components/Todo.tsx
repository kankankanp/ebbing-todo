"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { fetchTodos, addTodo, deleteTodo } from "../utils/api";
import HamburgerMenu from "./HamburgerMenu";

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

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("初期認証状態:", token ? "認証済み" : "未認証");

      if (!token) {
        console.log("認証トークンなし、ログインページにリダイレクト");
        router.push("/login");
        return;
      }

      try {
        await handleFetchTodos();
      } catch (err) {
        console.error("タスク取得エラー:", err);
        if (err instanceof Error && err.message.includes("認証")) {
          router.push("/login");
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleFetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error("タスク取得エラー:", err);
      if (err instanceof Error) {
        if (err.message.includes("認証")) {
          console.log("認証エラー、ログインページにリダイレクト");
          router.push("/login");
        } else {
          setError(err.message);
        }
      } else {
        setError("タスクの取得に失敗しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!newTodo.title.trim()) {
        setError("タイトルを入力してください");
        return;
      }

      const response = await addTodo(newTodo);
      console.log(response);
      console.log("タスク追加成功:", response);

      setNewTodo({ title: "", description: "" });
      await handleFetchTodos();
      setError(null);
    } catch (err) {
      console.error("タスク追加エラー:", err);
      if (err instanceof Error) {
        if (err.message.includes("認証")) {
          router.push("/login");
        } else {
          setError(err.message);
        }
      } else {
        setError("タスクの追加に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      handleFetchTodos();
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.message.includes("認証")) {
        router.push("/login");
      } else {
        setError("タスクの削除に失敗しました");
        console.error("Error deleting todo:", err);
      }
    }
  };

  const navigateToDetail = (id: number) => {
    router.push(`/todos/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <HamburgerMenu
        navLinks={[
          { href: "/", label: "ホーム" },
          { href: "/todos", label: "タスク一覧" },
          { href: "/todos/new", label: "新しいタスク" },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Todo List</h1>
            <p className="text-blue-600">
              タスクを管理して、効率的に作業を進めましょう
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              新しいタスクを追加
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  placeholder="新しいタスク"
                  className="flex-1 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  placeholder="説明（任意）"
                  className="flex-1 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "追加中..." : "追加"}
                </motion.button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              タスク一覧
            </h2>
            <div className="space-y-4">
              {todos.length === 0 ? (
                <p className="text-blue-600 text-center py-4">
                  タスクがありません。新しいタスクを追加してください。
                </p>
              ) : (
                <AnimatePresence>
                  {todos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-blue-900 mb-2">
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className="text-blue-600 mb-4">
                              {todo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-blue-500">
                            <span>学習回数: {todo.studyCount}回</span>
                            <span>
                              定着率: {Math.round(todo.retention * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigateToDetail(todo.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                          >
                            詳細
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                          >
                            削除
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
