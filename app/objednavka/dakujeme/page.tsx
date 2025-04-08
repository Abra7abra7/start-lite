// app/objednavka/dakujeme/page.tsx

import React, { Suspense } from 'react';
import ThankYouContent from './ThankYouContent';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";

function LoadingState() {
    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Skeleton className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100" />
                <Skeleton className="h-10 w-3/4 mx-auto rounded" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-2 rounded" />
            </CardHeader>
            <CardContent className="text-center space-y-6">
                 <Skeleton className="h-5 w-full rounded" />
                 <Skeleton className="h-5 w-5/6 mx-auto rounded" />
                 <div className="flex justify-center gap-4">
                     <Skeleton className="h-10 w-36 rounded" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function ThankYouPage() {
    return (
         <div className="container mx-auto max-w-2xl py-12 px-4">
            <Suspense fallback={<LoadingState />}>
                <ThankYouContent /> 
            </Suspense>
         </div>
    );
}
