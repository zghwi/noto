"use client";

import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import * as z from "zod";
import { isAuthorized } from "@/utils/api";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const ok = await isAuthorized();
      if (ok) redirect("/~");
    })();
  }, []);

  async function handleSignup() {
    const result = signupSchema.safeParse({
      name,
      username,
      password,
    });

    if (!result.success) {
      const error_list = JSON.parse(result.error.message);
      for (let err of error_list) {
        toast.error(err.message);
      }
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

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
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo_png.png"
              alt="Noto logo"
              className="cursor-pointer"
              onClick={() => router.push("/")}
              width={150}
              height={100}
            />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Create your account
          </CardTitle>
          <CardDescription>
            Start transforming your notes into learning tools
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              className="focus-visible:ring-[oklch(0.606_0.25_292.717)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Choose a username"
              className="focus-visible:ring-[oklch(0.606_0.25_292.717)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Create a password (min. 6 characters)"
              className="focus-visible:ring-[oklch(0.606_0.25_292.717)]"
            />
          </div>

          <Button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full cursor-pointer bg-[oklch(0.606_0.25_292.717)] hover:bg-[oklch(0.556_0.25_292.717)]"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-[oklch(0.606_0.25_292.717)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
