import HamburgerMenu from "./HamburgerMenu";

export default function Sidebar() {
  return (
    <>
      <HamburgerMenu navLinks={[{ href: "/todos", label: "タスク一覧" }]} />
      {/* 既存のサイドバーUI */}
      <aside className="hidden md:block w-64 bg-white shadow-lg h-full p-6">
        {/* ...既存のサイドバーUI... */}
      </aside>
    </>
  );
}
