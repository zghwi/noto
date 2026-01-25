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
  body?: string | FormData,
) {
  const token = localStorage.getItem("token");
  const res = await fetch(process.env["NEXT_PUBLIC_API_URL"] + url, {
    method: type || "GET",
    headers:
      type === "POST"
        ? typeof body === "string"
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : { Authorization: `Bearer ${token}` }
        : { Authorization: `Bearer ${token}` },
    body: body,
  });
  if (!res.ok) return { error: true, type: errorType(res.status) };
  const data = await res.json();
  return {
    error: false,
    data: data,
  };
}
export async function getUser() {
  return await authRequest("/profile");
}

export async function isAuthorized() {
  const res = await getUser();
  return !res.error;
}

export async function getFiles() {
  return await authRequest("/files");
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
  return await authRequest(`/files/${id}`);
}

export async function getFileByIdDetails(id: string) {
  const result = await getFileById(id);
  const { data: bigData, ...restData } = result.data;

  return {
    ...result,
    data: restData,
  };
}

export async function deleteFileById(id: string) {
  return await authRequest(`/files/${id}`, "DELETE");
}

export async function getQuizByFileId(fileId: string) {
  return await authRequest(`/quizzes/${fileId}`);
}

export async function getQuizByQuizId(quizId: string) {
  return await authRequest(`/quiz/${quizId}`);
}

export async function getFlashcardsByFileId(fileId: string) {
  return await authRequest(`/cardspacks/${fileId}`);
}

export async function createXByFileId(
  x: "quiz" | "flashcards",
  fileId: string,
  q: number,
) {
  const file = await getFileById(fileId);
  const ai = new AI(file.data.data, file.data.contentType);
  const data = await ai.generate(x, q);
  const p = JSON.parse(data);
  if ("error" in p) return { error: true, type: p.error };
  return await authRequest(
      `/${x === "quiz" ? "quizzes" : "cardspacks"}/${fileId}`,
      "POST",
      x === "quiz"
          ? JSON.stringify({questions: data})
          : JSON.stringify({cards: data}),
  );
}

export async function uploadFile(formData: FormData) {
  return await authRequest("/upload", "POST", formData);
}

export async function deleteQuizByFileId(fileId: string) {
  return await authRequest(`/quizzes/${fileId}`, "DELETE");
}

export async function deleteCardsByFileId(fileId: string) {
  return await authRequest(`/cardspacks/${fileId}`, "DELETE");
}

export async function cardsPacks() {
  return await authRequest("/user_cardspacks");
}

export async function quizAverage() {
  const res = await authRequest("/user_quizzes");
  if (res.error) return "--";
  let sum = 0;
  let n = 0;

  for (const q of res.data) {
    if (q.score !== -1) {
      sum += q.score;
      n++;
    }
  }

  if (n !== 0) return Number((sum / n).toFixed(2));
  return "--";
}

export async function updateProfile(name: string) {
  return await authRequest(
      "/update_profile",
      "POST",
      JSON.stringify({name}),
  );
}

export async function getUserById(id: string) {
  return await authRequest(`/get_user/${id}`);
}

export async function updateQuizScore(quizId: string, score: number) {
  return await authRequest(
      `/update_quiz_score/${quizId}`,
      "POST",
      JSON.stringify({score}),
  );
}

export async function deleteAccountData() {
  return await authRequest("/delete_data", "DELETE");
}

export async function deleteAccount() {
  return await authRequest("/delete_account", "DELETE");
}
