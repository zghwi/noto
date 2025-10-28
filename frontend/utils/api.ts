async function authRequest(
  url: string,
  type?: "POST" | "DELETE" | "PUT" | "GET",
) {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch(url, {
      method: type ? type : "GET",
      headers: { Authorization: `Bearer ${token}` },
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
  const data = await getFiles();
  // @ts-ignore
  return data.map(({ data, ...rest }) => rest);
}

export async function getFileById(id: string) {
  const data = await authRequest(`http://localhost:5138/files/${id}`);
  return data;
}

export async function deleteFileById(id: string) {
  const req = await authRequest(`http://localhost:5138/files/${id}`, "DELETE");
  return req;
}
