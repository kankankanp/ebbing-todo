"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "登録に失敗しました");
      }

      login(responseData.token);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : "登録に失敗しました");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-900">新規会員登録</h2>
        <p className="mt-2 text-blue-600">
          アカウントを作成して学習を始めましょう
        </p>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blue-900"
          >
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "有効なメールアドレスを入力してください",
              },
            })}
            className="mt-1 block w-full rounded-lg bg-white border-blue-200 text-blue-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-blue-900"
          >
            パスワード
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "パスワードは必須です",
              minLength: {
                value: 8,
                message: "パスワードは8文字以上で入力してください",
              },
            })}
            className="mt-1 block w-full rounded-lg bg-white border-blue-200 text-blue-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-blue-900"
          >
            パスワード（確認）
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "パスワードの確認は必須です",
              validate: (value) =>
                value === watch("password") || "パスワードが一致しません",
            })}
            className="mt-1 block w-full rounded-lg bg-white border-blue-200 text-blue-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          新規登録
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-blue-600">
          すでにアカウントをお持ちの方は
          <Link
            href="/login"
            className="font-medium text-blue-500 hover:text-blue-400 ml-1"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
