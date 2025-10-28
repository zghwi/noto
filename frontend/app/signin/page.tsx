"use client";

import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export default function SigninPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      redirect("/~");
    }
  }, []);

  async function handleLogin() {
    const res = await fetch("http://localhost:5138/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/~");
      toast.success(`Welcome ${data.name}!`);
    } else {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="flex flex-col items-center">
          <Image src="/logo_png.png" alt="logo" width={165} height={200} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <Button onClick={handleLogin} className="w-full cursor-pointer">
            Sign In
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-gray-400">
          Don't have an account?&nbsp;
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
          .
        </CardFooter>
      </Card>
    </div>
  );
}
