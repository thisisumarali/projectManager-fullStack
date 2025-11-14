"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ProtectedClient({ children }) {
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token && pathname !== "/login") {
            router.replace("/login");
        } else {
            // Simulate smooth loading transition
            const timeout = setTimeout(() => setChecking(false), 600);
            return () => clearTimeout(timeout);
        }
    }, [router, pathname]);

    if (checking)
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
                <Card className="shadow-lg border border-border p-6 rounded-xl flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <CardContent className="text-center text-muted-foreground">
                        Checking authentication...
                    </CardContent>
                </Card>
            </div>
        );

    return children;
}
