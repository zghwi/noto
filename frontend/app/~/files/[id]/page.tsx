"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { getFileById } from "@/utils/api";
import { FileQuestion, SlashIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FileById() {
    const [file, setFile] = useState<{
        id: string,
        name: string,
        data: any
    } |  {
        type: string,
        error: boolean
    } | null>();
    const [loading, setLoading] = useState<boolean>();
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            setLoading(true);
            const file = await getFileById(id as string);
            console.log(file);
            if (file.error) {
                if (file.type == "Not Found") setFile(null);
                if (file.type == "Unauthorized") {
                    localStorage.removeItem("token");
                    redirect("/signin");
                }
            }
            else setFile(file.data);
            setLoading(false);
        })();
    }, []);

    return loading ? <Spinner/> : (
        file ? (
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/~">~</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <SlashIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/~/files">Your Files</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <SlashIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            {/**@ts-ignore */}
                            <BreadcrumbPage>{file?.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        ) : (
            <div>
                <Empty className="border rounded-xl">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FileQuestion />
                        </EmptyMedia>
                        <EmptyTitle>File not found</EmptyTitle>
                    </EmptyHeader>
                </Empty>
            </div>
        )
    );
}