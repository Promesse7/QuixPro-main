export async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(path, opts)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
