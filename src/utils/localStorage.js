export const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))
export const load = (key, fallback) => {
  const v = localStorage.getItem(key)
  return v? JSON.parse(v) : fallback
}