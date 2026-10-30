const BASE = `${import.meta.env.VITE_API_URL}/api/expenses`;

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const getExpenses = () => request(BASE);

export const createExpense = (expense) =>
  request(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });

export const updateExpense = (id, changes) =>
  request(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

export const deleteExpense = (id) =>
  request(`${BASE}/${id}`, { method: "DELETE" });