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
import { File } from "lucide-react";
import { getFilesDetails } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Files() {
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const files = await getFilesDetails();
      setFiles(files);
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
      hour12: true
    }).format(date);

    return fmt;
  };

  return (
    <div>
      <div className="absolute right-10">
        <NewFile />
      </div>
      <h2 className="text-3xl font-semibold">Your files</h2>
      <br />
      {loading ? (
        <Spinner className="flex justify-center items-center h-full" />
      ) : (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file: any) => (
                  <TableRow key={file.id} className="cursor-pointer">
                    <TableCell>
                      <File size={20} />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>{file.name}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4">
            {files.map((file: any) => (
              <div key={file.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <File size={20} />
                  <p className="font-semibold">{file.name}</p>
                </div>
                <p className="text-sm text-gray-500">{file.contentType}</p>
                <p className="text-xs text-gray-400">{dateToString(file.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
