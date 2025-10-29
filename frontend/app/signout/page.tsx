"use client";

import { redirect } from "next/navigation";

export default function Signout() {
  const token = localStorage.getItem("token");
  if (token) {
    localStorage.removeItem("token");
    redirect("/");
  }
}
