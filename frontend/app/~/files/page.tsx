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
import { File, FileQuestion, SlashIcon, Trash } from "lucide-react";
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

export default function Files() {
  const router = useRouter();
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        setLoading(false);
      }
    })();
  }, []);

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
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This action can't be undone.</DialogDescription>
            <Button
              onClick={() => handleDelete(file.id)}
              variant="destructive"
              className="cursor-pointer"
            >
              Yes, delete file
            </Button>
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
        className={`group transition-all duration-300 ${
          isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
        }}
      >
        <TableCell className="w-12">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <File className="h-5 w-5 text-primary" />
          </div>
        </TableCell>
        <TableCell className="font-medium">
          <Link 
            href={`/~/files/${file.id}`}
            className="hover:text-primary transition-colors hover:underline"
          >
            {file.name}
          </Link>
        </TableCell>
        <TableCell className="w-30"></TableCell>
        <TableCell className="text-muted-foreground">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
            {file.contentType}
          </span>
        </TableCell>
        <TableCell className="w-30"></TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {dateToString(file.createdAt)}
        </TableCell>
        <TableCell className="text-right">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DeleteDialog file={file} />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const MobileFileCard = ({ file, index }: { file: any; index: number }) => {
    const isDeleting = deletingId === file.id;
    
    return (
      <div 
        key={file.id}
        className={`group relative p-4 border rounded-xl bg-card hover:shadow-md hover:border-primary/50 transition-all duration-300 ${
          isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
        }}
      >
        <div className="absolute -top-2 -right-2 z-10">
          <DeleteDialog file={file} />
        </div>
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
            <File className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/~/files/${file.id}`}>
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
      `}</style>

      <div className="absolute right-10">
        <NewFile />
      </div>

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
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : files.length > 0 ? (
        <div>
          <div className="hidden md:block">
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-30"></TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-30"></TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-17"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file: any, index: number) => (
                    <FileRow key={file.id} file={file} index={index} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {files.map((file: any, index: number) => (
              <MobileFileCard key={file.id} file={file} index={index} />
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
              <EmptyTitle>No files yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  );
}