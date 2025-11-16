"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  SlashIcon, 
  User,
  Palette, 
  AlertTriangle,
  Save,
  Moon,
  Sun,
  Monitor,
  Info,
  LogOut,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteAccount, deleteAccountData, getUser, updateProfile } from "@/utils/api";
import * as z from "zod";

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters")
});

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "system");
    (async () => {
      const userData = await getUser();
      if (userData.error) {
        router.push("/signin");
      } else {
        setUser(userData.data);
        setName(userData.data.name);
        setLoading(false);
      }
    })();
  }, []);

  const handleSaveProfile = async () => {
    const result = updateSchema.safeParse({ name });
    if (!result.success) {
      const err = JSON.parse(result.error.message);
      for (let e of err) toast.error(e.message);
      return;
    }
    await updateProfile(name);
    toast.success("Profile updated successfully!");
  };

  const handleChangeTheme = async () => {
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event("themeChange"));
    toast.success("Changed theme successfully!");
  }

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/signin");
    toast.success("Signed out successfully!");
  };

  const handleDeleteAccount = async () => {
    await deleteAccountData();
    await deleteAccount();
    localStorage.removeItem("token");
    toast.success("Account deleted successfully!");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <Breadcrumb style={{ animation: 'slideIn 0.5s ease-out' }}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/~">~</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6">
        <div 
          className="rounded-xl border bg-card p-6"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full cursor-pointer sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div 
          className="rounded-xl border bg-card p-6"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
              <Palette className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Preferences</h2>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how Noto looks to you
              </p>
            </div>
            <Button onClick={handleChangeTheme} className="w-full cursor-pointer sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div 
          className="rounded-xl border bg-card p-6"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.5s both' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10">
              <Info className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">About</h2>
              <p className="text-sm text-muted-foreground">App information and resources</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium">1.21.0</span>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <a href="https://github.com/zghwi/noto" target="_blank" className="text-sm text-primary hover:underline">
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-6"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.6s both' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Irreversible actions</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div>
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-500/20 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign out of your account?</DialogTitle>
                    <DialogDescription>
                      You'll need to sign in again to access your files and quizzes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSignOut}
                      variant="destructive"
                      className="flex-1 cursor-pointer"
                    >
                      Yes, Sign Out
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
              <div>
                <h3 className="font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete your account?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account,
                      all your files, quizzes, and flashcards.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      className="flex-1 cursor-pointer"
                    >
                      Yes, Delete Everything
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
