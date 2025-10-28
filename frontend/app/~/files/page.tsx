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

export default function Files() {
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const files = await getFilesDetails();
      setFiles(files.data);
      setLoading(false);
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
      const d = await deleteFileById(id);
      toast.success(d.data.message);
      setFiles((prev: any[]) => prev.filter((file) => file.id !== id));
    } catch (error) {
      toast.error("Failed to delete file");
      console.error(error);
    }
  };

  const DeleteDialog = ({ file }: { file: any }) => {
    return (
      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
          <Button variant="destructive" className="border rounded-full">
            <Trash />
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
              Yes
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div>
      <div className="absolute right-10">
        <NewFile />
      </div>
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
      <br />
      {loading ? (
        <Spinner className="flex justify-center items-center h-full" />
      ) : files.length > 0 ? (
        <div>
          <div className="hidden md:block w-full overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file: any) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <File size={20} />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell className="hover:underline cursor-pointer">
                      <Link href={`/~/files/${file.id}`}>{file.name}</Link>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{file.contentType}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{dateToString(file.createdAt)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <DeleteDialog file={file} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4">
            {files.map((file: any) => (
              <div key={file.id} className="p-4 border rounded-lg relative">
                <div className="absolute -top-2 -right-2 z-10">
                  <DeleteDialog file={file} />
                </div>
                <div className="flex items-center gap-2">
                  <File size={20} />
                  <p className="font-semibold hover:underline cursor-pointer">
                    <Link href={`/~/files/${file.id}`}>{file.name}</Link>
                  </p>
                </div>
                <p className="text-sm text-gray-500">{file.contentType}</p>
                <p className="text-xs text-gray-400">
                  {dateToString(file.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Empty className="border rounded-xl">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileQuestion />
              </EmptyMedia>
              <EmptyTitle>No files yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  );
}
