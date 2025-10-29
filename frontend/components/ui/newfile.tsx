"use client";

import { Plus, Upload, FileIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { useRef, useState } from "react";
import * as z from "zod";
import { toast } from "sonner";
import { Spinner } from "./spinner";
import { useRouter } from "next/navigation";

function NewFile({ props }: { props?: HTMLElement }) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setOpen(false);
      toast.success("File uploaded successfully");
      router.push(`/~/files/${data.id}`);
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
          <DialogTitle>Upload new file</DialogTitle>
        </DialogHeader>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center w-full p-6 mt-2 mb-3 border border-dashed rounded-lg cursor-pointer",
            "hover:border-primary/60 transition-colors bg-muted/30",
          )}
        >
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {file ? (
              <span className="flex items-center gap-2 text-foreground">
                <FileIcon className="h-4 w-4 text-primary" />
                <span className="truncate max-w-[200px]">{file.name}</span>
              </span>
            ) : (
              "Click to choose a file"
            )}
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={handleUpload} disabled={loading || file == null}>
          {loading ? <Spinner /> : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export { NewFile };
