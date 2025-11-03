"use client";

import { NewFile } from "@/components/ui/newfile";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  File,
  FileQuestion,
  SlashIcon,
  Trash,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { deleteFileById, getFilesDetails } from "@/utils/api";
import { useEffect, useState } from "react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function Files() {
  const router = useRouter();
  const [files, setFiles] = useState<any>([]);
  const [filteredFiles, setFilteredFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const files = await getFilesDetails();
      if (files.error) {
        if (files.type == "Unauthorized") {
          toast.error("Session expired");
        }
        router.push("/signin");
      } else {
        setFiles(files.data);
        setFilteredFiles(files.data);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(
        (file: any) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.contentType.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFiles(filtered);
    }
  }, [searchQuery, files]);

  const dateToString = (d: string) => {
    const date = new Date(d);
    const fmt = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    return fmt;
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const d = await deleteFileById(id);
      toast.success(d.data.message);

      setTimeout(() => {
        setFiles((prev: any[]) => prev.filter((file) => file.id !== id));
        setDeletingId(null);
      }, 300);
    } catch (error) {
      toast.error("Failed to delete file");
      console.error(error);
      setDeletingId(null);
    }
  };

  const DeleteDialog = ({ file }: { file: any }) => {
    return (
      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-8 w-8 transition-all hover:scale-110"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{file.name}"?</DialogTitle>
            <DialogDescription>
              This action can't be undone. This will permanently delete your
              file.
            </DialogDescription>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleDelete(file.id)}
                variant="destructive"
                className="flex-1"
              >
                Delete File
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

  const FileRow = ({ file, index }: { file: any; index: number }) => {
    const isDeleting = deletingId === file.id;

    return (
      <TableRow
        key={file.id}
        className={`group transition-all duration-300 hover:bg-muted/50 ${
          isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <TableCell className="w-12">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all group-hover:scale-105">
            <File className="h-5 w-5 text-primary" />
          </div>
        </TableCell>
        <TableCell className="font-medium">
          <Link
            href={`/~/files/${file.id}`}
            className="hover:text-primary transition-colors hover:underline flex items-center gap-2 max-w-screen"
          >
            {file.name}
          </Link>
        </TableCell>
        <TableCell className="w-29"></TableCell>
        <TableCell className="text-muted-foreground">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
            {file.contentType}
          </span>
        </TableCell>
        <TableCell className="w-29"></TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {dateToString(file.createdAt)}
        </TableCell>
        <TableCell className="text-right w-12">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DeleteDialog file={file} />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const FileCard = ({ file }: { file: any }) => {
    const isDeleting = deletingId === file.id;

    return (
      <div
        key={file.id}
        className={`group relative p-6 border rounded-xl bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 ${
          isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <DeleteDialog file={file} />
        </div>

        <Link href={`/~/files/${file.id}`} className="block">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
              <File className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2 w-full">
              <p className="font-semibold group-hover:text-primary transition-colors truncate">
                {file.name}
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
                {file.contentType}
              </span>
              <p className="text-xs text-muted-foreground">
                {dateToString(file.createdAt)}
              </p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const MobileFileCard = ({ file }: { file: any }) => {
    const isDeleting = deletingId === file.id;

    return (
      <div
        key={file.id}
        className={`group relative p-4 border rounded-xl bg-card hover:shadow-md hover:border-primary/50 transition-all duration-300 ${
          isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="absolute -top-2 -right-2 z-10">
          <DeleteDialog file={file} />
        </div>
        <div className="flex items-start gap-3 max-w-[220px]">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
            <File className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <Link href={`/~/files/${file.id}`} className="block">
              <p className="font-semibold hover:text-primary transition-colors hover:underline truncate">
                {file.name}
              </p>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {file.contentType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {dateToString(file.createdAt)}
            </p>
          </div>
        </div>
      </div>
    );
  };

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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/~">~</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Your Files</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="absolute right-10">
            <NewFile />
          </div>
        </div>

        {!loading && files.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-full"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-full"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : filteredFiles.length > 0 ? (
        <div>
          <div className="hidden md:block">
            {viewMode === "list" ? (
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-29"></TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-29"></TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file: any, index: number) => (
                      <FileRow key={file.id} file={file} index={index} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file: any) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            )}
          </div>

          <div className="md:hidden space-y-3">
            {filteredFiles.map((file: any) => (
              <MobileFileCard key={file.id} file={file} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12">
          <Empty className="border rounded-xl">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileQuestion className="h-12 w-12" />
              </EmptyMedia>
              <EmptyTitle>
                {searchQuery
                  ? `No files matching "${searchQuery}"`
                  : "No files yet"}
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  );
}
