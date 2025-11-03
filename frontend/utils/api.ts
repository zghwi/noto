function errorType(code: number): string {
  const statusMap: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    408: "Request Timeout",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  if (statusMap[code]) {
    return statusMap[code];
  }

  return "unknown";
}

async function authRequest(
  url: string,
  type?: "POST" | "DELETE" | "PUT" | "GET",
) {
  const token = localStorage.getItem("token");
  const res = await fetch(process.env["NEXT_PUBLIC_API_URL"] + url, {
    method: type || "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { error: true, type: errorType(res.status) };
  const data = await res.json();
  return {
    error: false,
    data: data,
  };
}
export async function getUser() {
  const data = await authRequest("/profile");
  return data;
}

export async function isAuthorized() {
  const res = await getUser();
  if (res.error) return false;
  return true;
}

export async function getFiles() {
  const data = await authRequest("/files");
  return data;
}

export async function getFilesDetails() {
  let data = await getFiles();
  if (!data.error) {
    return {
      ...data, //@ts-ignore
      data: data.data.map(({ data, ...rest }) => rest),
    };
  }
  return {
    ...data,
    data: [],
  };
}

export async function getFileById(id: string) {
  const data = await authRequest(`/files/${id}`);
  return data;
}

export async function deleteFileById(id: string) {
  const req = await authRequest(`/files/${id}`, "DELETE");
  return req;
}
