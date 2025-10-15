"use client";

import { Plus } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { useState } from "react";
import * as z from "zod";
import { toast } from "sonner";
import { Spinner } from "./spinner";

function NewFile() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fileSchema = z.object({
    file: z
      .instanceof(File)
      .refine((file) => file.size > 0, "File is required"),
  });

  async function handleUpload() {
    const validation = fileSchema.safeParse({ file });
    if (!validation.success) {
      toast.error(validation.error.message);
    }
    const formData = new FormData();
    formData.append("file", file!);

    const token = localStorage.getItem("token");
    setLoading(true);
    const res = await fetch("http://localhost:5138/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    setLoading(false);

    if (res.ok) {
      setOpen(false);
      toast.success("File uploaded successfully");
    } else {
      const err = await res.text();
      console.log(err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button className="cursor-pointer">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New file</DialogTitle>
        </DialogHeader>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={handleUpload} disabled={loading}>
          {loading ? <Spinner /> : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export { NewFile };
