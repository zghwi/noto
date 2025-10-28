"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Spinner } from "@/components/ui/spinner";
import { getFileById } from "@/utils/api";
import { SlashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FileById() {
    const [file, setFile] = useState<{
        id: string,
        name: string,
        data: any
    }>();
    const [loading, setLoading] = useState<boolean>();
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            setLoading(true);
            const file = await getFileById(id as string);
            setFile(file);
            setLoading(false);
        })();
    }, []);

    return loading ? <Spinner/> : (
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
                        <BreadcrumbPage>{file?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}