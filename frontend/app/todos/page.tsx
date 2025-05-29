"use client";

import Todo from "../components/Todo";
import HamburgerMenu from "../components/HamburgerMenu";

export default function TodosPage() {
  return (
    <>
      <HamburgerMenu
        navLinks={[
          { href: "/todos", label: "タスク一覧" },
          // 必要に応じて他のページも追加
        ]}
      />
      <Todo />
    </>
  );
}
