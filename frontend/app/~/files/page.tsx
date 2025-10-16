"use client";

import { NewFile } from "@/components/ui/newfile";
import { Spinner } from "@/components/ui/spinner";
import { getFiles, getFilesDetails } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Files() {
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const files = await getFilesDetails();
      console.log(files);
      setFiles(files);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="absolute right-10"><NewFile /></div>
      <h2 className="text-3xl font-semibold">Your files</h2>
      { loading ? (
        <Spinner />
      ) : files.map((file: any) => (
        <div key={file.id}>{file.name}</div>
      ))}
    </div>
  );
}
