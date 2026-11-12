import { forwardRef, HTMLAttributes, ReactNode, useState, useRef, useEffect, useCallback, Children } from 'react';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  slidesToShow?: number;
  gap?: number;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      style,
      children,
      autoPlay = false,
      autoPlayInterval = 5000,
      showDots = true,
      showArrows = true,
      loop = true,
      slidesToShow = 1,
      gap = 16,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const carouselId = useId();

    const slides = Children.toArray(children);
    const totalSlides = slides.length;
    const maxIndex = Math.max(0, totalSlides - slidesToShow);

    const goToSlide = useCallback((index: number) => {
      if (loop) {
        if (index < 0) index = maxIndex;
        if (index > maxIndex) index = 0;
      } else {
        index = Math.max(0, Math.min(index, maxIndex));
      }
      setCurrentIndex(index);
    }, [loop, maxIndex]);

    const goToPrevious = useCallback(() => {
      goToSlide(currentIndex - 1);
    }, [currentIndex, goToSlide]);

    const goToNext = useCallback(() => {
      goToSlide(currentIndex + 1);
    }, [currentIndex, goToSlide]);

    useEffect(() => {
      if (autoPlay && !isHovered && !reducedMotion) {
        const timer = setInterval(goToNext, autoPlayInterval);
        return () => clearInterval(timer);
      }
    }, [autoPlay, autoPlayInterval, isHovered, reducedMotion, goToNext]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(maxIndex);
          break;
      }
    };

    const slideWidth = `calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`;

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div
          ref={containerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Image carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--lg-ring)]"
        >
          <div
            aria-live={autoPlay ? 'off' : 'polite'}
            className="flex"
            style={{
              gap,
              transform: `translateX(calc(-${currentIndex} * (${slideWidth} + ${gap}px)))`,
              transition: reducedMotion ? 'none' : 'transform 400ms var(--lg-ease)',
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${totalSlides}`}
                aria-hidden={index < currentIndex || index >= currentIndex + slidesToShow}
                className="flex-shrink-0"
                style={{ width: slideWidth }}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow controls */}
        {showArrows && totalSlides > slidesToShow && (
          <>
            <button
              onClick={goToPrevious}
              disabled={!loop && currentIndex === 0}
              aria-label="Previous slide"
              className={cn(
                'lg-glass lg-interactive',
                'absolute top-1/2 left-2 -translate-y-1/2',
                'w-10 h-10 rounded-full',
                'flex items-center justify-center',
                'border-0 cursor-pointer',
                'disabled:opacity-30 disabled:cursor-default',
                'hover:bg-[var(--lg-glass-active)] transition-colors'
              )}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              disabled={!loop && currentIndex === maxIndex}
              aria-label="Next slide"
              className={cn(
                'lg-glass lg-interactive',
                'absolute top-1/2 right-2 -translate-y-1/2',
                'w-10 h-10 rounded-full',
                'flex items-center justify-center',
                'border-0 cursor-pointer',
                'disabled:opacity-30 disabled:cursor-default',
                'hover:bg-[var(--lg-glass-active)] transition-colors'
              )}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {showDots && totalSlides > slidesToShow && (
          <div
            role="tablist"
            aria-label="Carousel navigation"
            className="flex items-center justify-center gap-2 mt-4"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full border-0 cursor-pointer',
                  'transition-all duration-200',
                  index === currentIndex
                    ? 'bg-[var(--lg-accent)] w-6'
                    : 'bg-[var(--lg-muted)] opacity-50 hover:opacity-100'
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

Carousel.displayName = 'Carousel';
