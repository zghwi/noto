"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    // if (token) {
    //     redirect("/~");
    // }
    if (token) {
      try {
        const _d = jwt.verify(
          token as string,
          process.env["JWT_SECRET"] as string,
        );
        console.log("verified");
        redirect("/~");
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);
  return <div>landing page</div>;
}
