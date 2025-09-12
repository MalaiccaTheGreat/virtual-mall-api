import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Placement = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
  /**
   * The content to show in the tooltip
   */
  content: ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: ReactNode;
  /**
   * Where to place the tooltip relative to the trigger element
   * @default 'top'
   */
  placement?: Placement;
  /**
   * Delay in milliseconds before showing the tooltip
   * @default 300
   */
  delay?: number;
  /**
   * Additional class names for the tooltip
   */
  className?: string;
}

const placementClasses: Record<Placement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
};

const arrowClasses: Record<Placement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-gray-900 border-r-transparent border-b-0 border-l-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-gray-900 border-t-transparent border-b-transparent border-l-0',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-gray-900 border-r-transparent border-t-0 border-l-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-gray-900 border-t-transparent border-r-0 border-b-transparent',
};

export const Tooltip = ({
  content,
  children,
  placement = 'top',
  delay = 300,
  className = '',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  let timeoutId: NodeJS.Timeout;

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
      setIsMounted(true);
    }, delay);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
    
    // Wait for the animation to complete before unmounting
    setTimeout(() => {
      if (!isVisible) {
        setIsMounted(false);
      }
    }, 200);
  };

  // Update tooltip position
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
    }

    // Ensure the tooltip stays within the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewportHeight - 8) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    setPosition({ top, left });
  };

  // Handle window resize
  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }

    const handleResize = () => {
      if (isVisible) {
        updatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setTimeout(() => setIsMounted(false), 200);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isMounted && createPortal(
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-1.5 text-sm text-white bg-gray-900 rounded-md shadow-lg transition-opacity duration-200 pointer-events-none ${
            isVisible ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          role="tooltip"
        >
          {content}
          <div 
            className={`absolute w-2 h-2 border-4 ${arrowClasses[placement]}`}
            aria-hidden="true"
          />
        </div>,
        document.body
      )}
    </>
  );
};
