"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヒーローセクション */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <motion.div
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
              エビングハウスの忘却曲線で
              <br />
              効率的な学習を
            </h1>
            <p className="text-xl text-blue-600 mb-8 max-w-3xl mx-auto">
              科学的な記憶の仕組みを活用して、効率的な学習と復習を実現。
              タスク管理と学習効果を最大化する新しいTodoアプリケーション。
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/todos"
                className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full font-medium text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                始める
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 text-white"
            viewBox="0 0 1440 100"
            fill="currentColor"
          >
            <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </motion.div>

      {/* 特徴セクション */}
      <motion.div
        className="py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-bold text-center mb-16 text-blue-900"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            主な特徴
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all shadow-lg hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                タスク管理
              </h3>
              <p className="text-blue-600">
                シンプルで使いやすいタスク管理機能で、学習内容を効率的に整理できます。
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all shadow-lg hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                忘却曲線の可視化
              </h3>
              <p className="text-blue-600">
                エビングハウスの忘却曲線に基づいて、最適な復習タイミングを視覚的に確認できます。
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all shadow-lg hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                学習進捗の追跡
              </h3>
              <p className="text-blue-600">
                学習回数と定着率を記録し、効果的な学習計画を立てることができます。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* 学習の流れセクション */}
      <motion.div
        className="py-24 bg-gradient-to-br from-blue-50 to-sky-50 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.h2
            className="text-3xl font-bold text-center mb-16 text-blue-900"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            学習の流れ
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-900">
                タスク作成
              </h3>
              <p className="text-blue-600">学習したい内容をタスクとして登録</p>
            </motion.div>
            <motion.div
              className="text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-900">
                学習実行
              </h3>
              <p className="text-blue-600">タスクに沿って学習を実施</p>
            </motion.div>
            <motion.div
              className="text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-900">
                定着率確認
              </h3>
              <p className="text-blue-600">忘却曲線に基づく定着率を確認</p>
            </motion.div>
            <motion.div
              className="text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-900">
                復習計画
              </h3>
              <p className="text-blue-600">最適なタイミングで復習を実施</p>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 text-white"
            viewBox="0 0 1440 100"
            fill="currentColor"
          >
            <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </motion.div>

      {/* メリットセクション */}
      <motion.div
        className="py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-bold text-center mb-16 text-blue-900"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            このアプリで得られるメリット
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-2 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ x: 10 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                効率的な学習
              </h3>
              <p className="text-blue-600">
                科学的な記憶の仕組みを活用することで、最小限の努力で最大の学習効果を得ることができます。
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ x: 10 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                継続的な成長
              </h3>
              <p className="text-blue-600">
                学習の進捗を可視化することで、モチベーションを維持し、継続的な成長を実現できます。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTAセクション */}
      <motion.div
        className="py-24 bg-gradient-to-br from-blue-50 to-sky-50 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h2
            className="text-3xl font-bold mb-8 text-blue-900"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            効率的な学習を始めましょう
          </motion.h2>
          <motion.p
            className="text-xl text-blue-600 mb-12 max-w-3xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            科学的なアプローチで、あなたの学習効果を最大化します。
            今すぐ始めて、より効率的な学習を実現しましょう。
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/todos"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full font-medium text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              無料で始める
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
