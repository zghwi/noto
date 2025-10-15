export async function getUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://localhost:5138/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
}
