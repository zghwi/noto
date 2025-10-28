"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import * as z from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      redirect("/~");
    }
  }, []);
  async function handleSignup() {
    const result = signupSchema.safeParse({
      name,
      username,
      password,
    });
    if (!result.success) {
      // toast.error(result.error.message);
      const error_list = JSON.parse(result.error.message);
      for (let err of error_list) {
        toast.error(err.message);
      }
      return;
    }
    const res = await fetch("http://localhost:5138/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password }),
    });

    // const data = await res.json();

    if (res.ok) {
      toast.success("Account successfully created", {
        action: {
          label: "Sign in",
          onClick: () => redirect("/signin"),
        },
      });
    } else {
      const error = await res.json();
      toast.error(error);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
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
          <Button
            onClick={handleSignup}
            type="submit"
            className="w-full cursor-pointer"
          >
            Sign Up
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-gray-400">
          Already have an account?&nbsp;
          <Link href="/signin" className="text-blue-500">
            Sign in
          </Link>
          .
        </CardFooter>
      </Card>
    </div>
  );
}
