export async function api<T>(path: string, init: RequestInit = {}) {
  console.log(path);
  const res = await fetch(`http://localhost:3000${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      "x-admin-key": localStorage.getItem("admin_key") ?? "",
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
