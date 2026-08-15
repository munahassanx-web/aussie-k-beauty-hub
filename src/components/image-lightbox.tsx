import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export type LightboxImage = { src: string; alt: string };

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
  title: string;
};

export function ImageLightbox({ open, onOpenChange, images, index, onIndexChange, title }: Props) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const count = images.length;
  const image = images[index];

  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Reset the view whenever the viewer opens or the visible image changes.
  useEffect(() => {
    reset();
  }, [open, index, reset]);

  const zoomAt = useCallback((nextZoom: number, px?: number, py?: number) => {
    setZoom((current) => {
      const next = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
      const rect = containerRef.current?.getBoundingClientRect();
      const anchorX = px ?? (rect ? rect.width / 2 : 0);
      const anchorY = py ?? (rect ? rect.height / 2 : 0);
      const k = next / current;
      setOffset((o) =>
        next === MIN_ZOOM
          ? { x: 0, y: 0 }
          : { x: anchorX - (anchorX - o.x) * k, y: anchorY - (anchorY - o.y) * k },
      );
      return next;
    });
  }, []);

  // Native non-passive wheel listener: React's onWheel is passive, so
  // preventDefault there is ignored and the page scrolls behind the viewer.
  const zoomAtRef = useRef(zoomAt);
  zoomAtRef.current = zoomAt;
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !open) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const rect = el.getBoundingClientRect();
      setZoom((z) => {
        zoomAtRef.current(z * Math.exp(-dy * 0.0015), e.clientX - rect.left, e.clientY - rect.top);
        return z;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [open]);

  const step = (delta: number) => onIndexChange((index + delta + count) % count);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Escape is handled by the dialog primitive.
    if (e.key === 'ArrowRight' && count > 1) {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft' && count > 1) {
      e.preventDefault();
      step(-1);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomAt(zoom + 0.5);
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomAt(zoom - 0.5);
    } else if (e.key === '0') {
      e.preventDefault();
      reset();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom === MIN_ZOOM) return;
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onKeyDown={onKeyDown}
        className="h-dvh max-w-none rounded-none border-0 bg-background p-0 sm:rounded-none"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Image {index + 1} of {count}. Use the arrow keys to change image, plus and minus to zoom,
          0 to reset, and Escape to close.
        </DialogDescription>

        <div className="grid h-full grid-rows-[1fr_auto]">
          <div
            ref={containerRef}
            className="relative overflow-hidden bg-secondary"
            style={{ touchAction: 'none', cursor: zoom > 1 ? 'grab' : 'default' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={() => (zoom > 1 ? reset() : zoomAt(2))}
          >
            <img
              src={image.src}
              alt={image.alt}
              draggable={false}
              className="h-full w-full select-none object-contain"
              style={{
                transformOrigin: '0 0',
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              }}
            />
            <p aria-live="polite" className="sr-only">
              Image {index + 1} of {count}, zoom {Math.round(zoom * 100)} percent
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border bg-background p-4">
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary"
                >
                  ›
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => zoomAt(zoom - 0.5)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              −
            </button>
            <span className="min-w-14 text-center text-xs text-muted-foreground" aria-hidden="true">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => zoomAt(zoom + 0.5)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              +
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:bg-secondary"
            >
              Reset zoom
            </button>
            <p className="ml-auto hidden text-xs text-muted-foreground sm:block" aria-hidden="true">
              Scroll to zoom · drag to pan · Esc to close
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
