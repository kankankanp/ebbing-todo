"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

export default function HamburgerMenu({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // トークンを削除
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // メニューを閉じる
      setOpen(false);

      // 少し待ってからリダイレクト
      await new Promise((resolve) => setTimeout(resolve, 100));

      // ルートページにリダイレクト
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  return (
    <>
      {/* ハンバーガーアイコン */}
      <button
        className="fixed top-4 left-4 z-50 flex flex-col justify-center items-center w-12 h-12 bg-white rounded-full shadow-lg focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="メニューを開く"
      >
        <span
          className={`block w-6 h-0.5 bg-blue-900 mb-1 transition-all ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-blue-900 mb-1 transition-all ${
            open ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-blue-900 transition-all ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>
      {/* スライドメニュー */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-40 flex flex-col p-8"
          >
            <button
              className="self-end mb-8 text-2xl text-blue-900 focus:outline-none"
              onClick={() => setOpen(false)}
              aria-label="メニューを閉じる"
            >
              ×
            </button>
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-lg text-blue-900 font-semibold hover:text-blue-500 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-lg text-red-600 font-semibold hover:text-red-500 transition-colors"
                >
                  ログアウト
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
      {/* オーバーレイ */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
