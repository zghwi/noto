async function authRequest(url: string) {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
}
export async function getUser() {
  const data = await authRequest("http://localhost:5138/profile");
  return data;
}

export async function getFiles() {
  const data = await authRequest("http://localhost:5138/files");
  return data;
}

export async function getFilesDetails() {
  const data = await authRequest("http://localhost:5138/files");
  // @ts-ignore
  return data.map(({ data, ...rest }) => rest);
}