import { Card, CardContent, CardHeader } from '../../ui/card';

const ShimmerBox = ({ className = '' }) => (
    <div
        className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded ${className}`}
    />
);

const OrderDetailsSkeleton = () => {
    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="flex items-center justify-between gap-2 w-full mb-4">
                    <ShimmerBox className="h-10 w-40" />
                    <ShimmerBox className="h-10 w-32" />
                </div>
                <ShimmerBox className="h-7 w-64 mb-2" />
                <ShimmerBox className="h-4 w-48" />
            </div>

            <div className="flex flex-col gap-4">
                {/* Customization Card Skeleton */}
                <Card className="shadow-none">
                    <CardHeader>
                        <ShimmerBox className="h-6 w-48 mb-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <ShimmerBox className="h-4 w-24" />
                                        <ShimmerBox className="h-4 w-32" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <ShimmerBox className="h-4 w-28" />
                                        <div className="flex flex-wrap gap-2">
                                            <ShimmerBox className="h-6 w-20 rounded-full" />
                                            <ShimmerBox className="h-6 w-24 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <ShimmerBox className="h-5 w-32 mb-4" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ShimmerBox className="h-64 w-full rounded-lg" />
                                <ShimmerBox className="h-64 w-full rounded-lg" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact and Price Cards Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Contact Card Skeleton */}
                    <Card className="shadow-none">
                        <CardHeader>
                            <ShimmerBox className="h-6 w-40 mb-2" />
                            <ShimmerBox className="h-4 w-56" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <ShimmerBox className="h-4 w-16" />
                                <ShimmerBox className="h-4 w-48" />
                                <ShimmerBox className="h-3 w-32" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <ShimmerBox className="h-4 w-20" />
                                    <ShimmerBox className="h-4 w-36" />
                                </div>
                                <div className="space-y-2">
                                    <ShimmerBox className="h-4 w-20" />
                                    <ShimmerBox className="h-4 w-32" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <ShimmerBox className="h-4 w-20" />
                                <ShimmerBox className="h-4 w-56" />
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <ShimmerBox className="h-4 w-40" />
                                <ShimmerBox className="h-3 w-48" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Summary Card Skeleton */}
                    <Card className="shadow-none">
                        <CardHeader>
                            <ShimmerBox className="h-6 w-52 mb-2" />
                            <ShimmerBox className="h-4 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <ShimmerBox className="h-4 w-36" />
                                <ShimmerBox className="h-4 w-48" />
                                <ShimmerBox className="h-3 w-32" />
                            </div>
                            <div className="space-y-2 border-t border-gray-100 pt-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <ShimmerBox className="h-4 w-32" />
                                        <ShimmerBox className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <ShimmerBox className="h-5 w-40" />
                                <ShimmerBox className="h-5 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Card Skeleton */}
                <Card className="shadow-none">
                    <CardHeader>
                        <ShimmerBox className="h-6 w-40 mb-2" />
                        <ShimmerBox className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <ShimmerBox className="h-9 w-24 rounded-md" />
                            <ShimmerBox className="h-8 w-48 rounded-full" />
                            <ShimmerBox className="h-9 w-32 rounded-md" />
                        </div>
                        <div className="space-y-3">
                            <ShimmerBox className="h-4 w-40" />
                            <ShimmerBox className="h-10 w-full rounded-md" />
                        </div>
                        <ShimmerBox className="h-16 w-full rounded-lg" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderDetailsSkeleton;

