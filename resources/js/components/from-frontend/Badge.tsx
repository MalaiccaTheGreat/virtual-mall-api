import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-cyan-100 text-cyan-800',
        purple: 'bg-purple-100 text-purple-800',
        pink: 'bg-pink-100 text-pink-800',
        indigo: 'bg-indigo-100 text-indigo-800',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
      rounded: {
        full: 'rounded-full',
        md: 'rounded-md',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'full',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
  color?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'pink' | 'indigo';
}

export function Badge({
  children,
  className,
  variant,
  size,
  rounded,
  color,
  ...props
}: BadgeProps) {
  // Map color prop to variant if provided (for backward compatibility)
  const variantFromColor = color ? {
    default: 'default',
    primary: 'primary',
    success: 'success',
    danger: 'danger',
    warning: 'warning',
    info: 'info',
    purple: 'purple',
    pink: 'pink',
    indigo: 'indigo',
  }[color] : variant;

  return (
    <span
      className={cn(badgeVariants({ variant: variantFromColor, size, rounded }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

// Status Badge Variant
type StatusVariant = 'active' | 'inactive' | 'draft' | 'published' | 'archived' | 'pending' | 'completed' | 'cancelled' | 'refunded' | 'shipped' | 'processing' | 'on-hold' | 'failed' | 'approved' | 'rejected';

interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: StatusVariant;
  children?: ReactNode;
}

export function StatusBadge({ status, children, ...props }: StatusBadgeProps) {
  const statusMap: Record<StatusVariant, { variant: string; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    draft: { variant: 'default', label: 'Draft' },
    published: { variant: 'primary', label: 'Published' },
    archived: { variant: 'default', label: 'Archived' },
    pending: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    refunded: { variant: 'default', label: 'Refunded' },
    shipped: { variant: 'info', label: 'Shipped' },
    processing: { variant: 'info', label: 'Processing' },
    'on-hold': { variant: 'warning', label: 'On Hold' },
    failed: { variant: 'danger', label: 'Failed' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'danger', label: 'Rejected' },
  };

  const { variant, label } = statusMap[status] || { variant: 'default', label: status };

  return (
    <Badge variant={variant as any} {...props}>
      {children || label}
    </Badge>
  );
}

// Stock Status Badge
interface StockStatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  inStock: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
}

export function StockStatusBadge({ 
  inStock, 
  stockQuantity = 0, 
  lowStockThreshold = 10, 
  ...props 
}: StockStatusBadgeProps) {
  if (!inStock) {
    return <Badge variant="danger" {...props}>Out of Stock</Badge>;
  }
  
  if (stockQuantity <= lowStockThreshold) {
    return <Badge variant="warning" {...props}>Low Stock ({stockQuantity})</Badge>;
  }
  
  return <Badge variant="success" {...props}>In Stock ({stockQuantity})</Badge>;
}

// Price Badge
interface PriceBadgeProps extends Omit<BadgeProps, 'children'> {
  price: number;
  salePrice?: number | null;
  currency?: string;
}

export function PriceBadge({ 
  price, 
  salePrice, 
  currency = '$',
  className,
  ...props 
}: PriceBadgeProps) {
  const formattedPrice = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  if (salePrice && salePrice < price) {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-red-600 font-medium">{formattedPrice(salePrice)}</span>
        <span className="text-gray-400 line-through text-sm">{formattedPrice(price)}</span>
      </div>
    );
  }

  return <span className={cn('font-medium', className)} {...props}>{formattedPrice(price)}</span>;
}
