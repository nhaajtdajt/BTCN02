import { Film } from 'lucide-react';

// Simple skeleton placeholder for movie card while loading
export default function MovieCardSkeleton() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
            <div className="w-full aspect-2/3 bg-gray-200 flex items-center justify-center text-gray-400">
                <Film className="w-10 h-10" />
            </div>
            <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-2 pt-1">
                    <span className="h-6 bg-gray-200 rounded-full w-16" />
                    <span className="h-6 bg-gray-200 rounded-full w-12" />
                </div>
            </div>
        </div>
    );
}