"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  return (
    <div>
      <h2 className="text-3xl font-semibold">Settings</h2>
      <br />
      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
          <Button className="cursor-pointer" variant="destructive">
            Sign out
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <Button
            onClick={() => router.replace("/signout")}
            className="cursor-pointer"
            variant="destructive"
          >
            Yes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
