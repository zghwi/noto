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
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%]"></TableHead>
              <TableHead className="w-[60%]">Name</TableHead>
              <TableHead className="w-[35%]">Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file: any) => (
              <TableRow key={file.id} className="cursor-pointer">
                <TableCell>
                  <File size={20} />
                </TableCell>
                <TableCell>{file.name}</TableCell>
                <TableCell>{dateToString(file.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
