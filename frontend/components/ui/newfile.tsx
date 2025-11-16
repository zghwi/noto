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

export function NewFile() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
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
      return;
    }
    const formData = new FormData();
    formData.append("file", file!);

    const token = localStorage.getItem("token");
    setLoading(true);
    const res = await fetch(`${process.env["NEXT_PUBLIC_API_URL"]}/upload`, {
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
      setFile(null);
      toast.success("File uploaded successfully");
      router.push(`/~/files/${data.id}`);
    } else {
      const err = await res.text();
      console.log(err);
      toast.error("Failed to upload file");
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  };

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
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center w-full p-8 mt-2 mb-3 border-2 border-dashed rounded-lg cursor-pointer transition-all",
            "hover:border-primary/60 bg-muted/30",
            isDragging && "border-primary bg-primary/5 scale-[1.02]"
          )}
        >
          <Upload className={cn(
            "h-8 w-8 mb-3 transition-all",
            isDragging ? "text-primary scale-110" : "text-muted-foreground"
          )} />
          <p className="text-sm text-center">
            {file ? (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <FileIcon className="h-4 w-4 text-primary" />
                <span className="truncate max-w-[200px]">{file.name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                {isDragging ? (
                  <span className="text-primary font-medium">Drop file here</span>
                ) : (
                  <>
                    <span className="font-medium">Click to choose</span> or drag and drop
                  </>
                )}
              </span>
            )}
          </p>
          {!file && !isDragging && (
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, TXT, DOCX, and more
            </p>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] || null;
            setFile(selectedFile);
          }}
        />
        <Button onClick={handleUpload} disabled={loading || file == null}>
          {loading ? <Spinner /> : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}