// 共通fetchヘルパーとTodo用API関数

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // デバッグ情報
  console.log("認証トークン:", token ? "存在します" : "存在しません");

  if (!token) {
    throw new Error("認証トークンが見つかりません。ログインしてください。");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  console.log("リクエストヘッダー:", headers);

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    try {
      const error = await res.json();
      if (res.status === 401) {
        // 認証エラーの場合、トークンを削除してログインページに誘導
        localStorage.removeItem("token");
        throw new Error("認証に失敗しました。再度ログインしてください。");
      }
      throw new Error(error.message || `エラーが発生しました（${res.status}）`);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error(`リクエストに失敗しました（${res.status}）`);
    }
  }
  return res;
}

// Todo API
export async function fetchTodos() {
  const res = await apiFetch("http://localhost:3001/todos");
  return res.json();
}

export async function addTodo(newTodo: {
  title: string;
  description?: string;
}) {
  const res = await apiFetch("http://localhost:3001/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  return res.json();
}

export async function updateTodo(id: number, completed: boolean) {
  const res = await apiFetch(`http://localhost:3001/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed }),
  });
  return res.json();
}

export async function deleteTodo(id: number) {
  const res = await apiFetch(`http://localhost:3001/todos/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
