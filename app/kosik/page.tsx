import React, { Suspense } from 'react';
import CartContent from './CartContent';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingState() {
    return (
        <div className="container mx-auto py-8 px-4">
            <Skeleton className="h-10 w-1/3 mb-6" />
            <div className="border rounded-lg overflow-hidden mb-6">
                {[1, 2].map((i) => (
                     <div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0 flex-wrap gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                             <Skeleton className="h-16 w-16 rounded" />
                             <div className="space-y-2">
                                 <Skeleton className="h-4 w-[150px]" />
                                 <Skeleton className="h-4 w-[100px]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Skeleton className="w-16 h-9 rounded" />
                            <Skeleton className="h-9 w-9 rounded" />
                        </div>
                        <Skeleton className="h-6 w-[80px]" />
                    </div>
                ))}
            </div>
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                 <Skeleton className="h-10 w-36" />
                 <div className="text-right w-full sm:w-auto space-y-2">
                     <Skeleton className="h-6 w-48 ml-auto" />
                     <Skeleton className="h-12 w-48 ml-auto" />
                 </div>
             </div>
        </div>
    );
}

export default function KosikPage() {
    return (
        <Suspense fallback={<LoadingState />}> 
            <CartContent /> 
        </Suspense>
    );
}
