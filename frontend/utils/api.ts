import AI from "./ai";

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
  body?: string
) {
  const token = localStorage.getItem("token");
  const res = await fetch(process.env["NEXT_PUBLIC_API_URL"] + url, {
    method: type || "GET",
    headers: type === "POST" ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json"} : { Authorization: `Bearer ${token}` },
    body: body
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

export async function getFileByIdDetails(id: string) {
  const result = await getFileById(id);
  const { data: bigData, ...restData } = result.data;

  return {
    ...result,
    data: restData
  };
}


export async function deleteFileById(id: string) {
  const req = await authRequest(`/files/${id}`, "DELETE");
  return req;
}

export async function getQuizByFileId(fileId: string) {
  const data = await authRequest(`/quizzes/${fileId}`);
  return data;
}

export async function getFlashcardsByFileId(fileId: string) {
  const data = await authRequest(`/cardspacks/${fileId}`);
  console.log(data);
  return data;
}

export async function createXByFileId(x: "quiz" | "flashcards", fileId: string, q: number) {
  const file = await getFileById(fileId);
  const ai = new AI(file.data.data, file.data.contentType);
  const questions = await ai.generate(x, q);
  const req = await authRequest(`/${x === "quiz" ? "quizzes" : "cardspacks"}/${fileId}`, "POST", x === "quiz" ? JSON.stringify({ questions }) : JSON.stringify({ cards: questions }));
  return req;
}

export async function deleteQuizByFileId(fileId: string) {
  const res = await authRequest(`/quizzes/${fileId}`, "DELETE");
  console.log(res);
  return res;
}

export async function cardsPacks() {
  const res = await authRequest("/user_cardspacks");
  return res;
}

export async function quizAverage() {
  const res = await authRequest("/user_quizzes");
  console.log(res);
  if (res.error) return "--";
  let sum = 0;
  let n = 0;

  for (const q of res.data) {
    if (q.score !== -1) {
      sum += q.score;
      n++;
    }
  }

  if (n !== 0) return sum/n;
  return "--";
}

export async function updateProfile(name: string) {
  const res = await authRequest("/update_profile", "POST", JSON.stringify({ name }));
  return res;
}

export async function deleteAccountData() {
  const res = await authRequest("/delete_data", "DELETE");
  return res;
}

export async function deleteAccount() {
  const res = await authRequest("/delete_account", "DELETE");
  return res;
}