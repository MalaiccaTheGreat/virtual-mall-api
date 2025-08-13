import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export const Skeleton = ({
  className = '',
  isLoaded = false,
  children = null,
  ...props
}: SkeletonProps) => {
  if (isLoaded) return <>{children}</>;
  
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  );
};

// Skeleton for product cards
export const ProductCardSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="aspect-square bg-gray-200 animate-pulse"></div>
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// Skeleton for product detail page
export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-6 w-20 mb-6" />
        
        <div className="space-y-4 mb-8">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        
        <div className="mt-8">
          <Skeleton className="h-5 w-24 mb-2" />
          <div className="flex space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <Skeleton className="h-5 w-20 mb-2" />
          <div className="flex space-x-2 mb-6">
            {['sm', 'md', 'lg', 'xl'].map((size) => (
              <Skeleton key={size} className="h-10 w-16 rounded-md" />
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex items-center space-x-4">
          <Skeleton className="h-12 w-32 rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for cart items
export const CartItemSkeleton = () => (
  <div className="flex py-6">
    <Skeleton className="h-24 w-24 rounded-md" />
    <div className="ml-4 flex-1">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-4 w-32 mt-2" />
      <div className="flex items-center mt-4">
        <Skeleton className="h-8 w-24 mr-4" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </div>
);

// Skeleton for checkout form
export const CheckoutFormSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i}>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);
