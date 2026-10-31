import { BRAND_NAME } from '@/lib/site';

const MARKS = {
  // Transparent cut-outs of the official logo (public/brand), used as CSS masks so the
  // mark can take any brand colour through `currentColor`.
  monogram: { src: '/brand/sf-monogram.png', ratio: 568 / 356 },
  lockup: { src: '/brand/sf-lockup.png', ratio: 614 / 413 },
} as const;

export default function BrandMark({
  variant = 'monogram',
  className = '',
  decorative = false,
}: {
  variant?: keyof typeof MARKS;
  className?: string;
  decorative?: boolean;
}) {
  const mark = MARKS[variant];
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : `${BRAND_NAME} logo`}
      aria-hidden={decorative || undefined}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        aspectRatio: mark.ratio,
        maskImage: `url(${mark.src})`,
        WebkitMaskImage: `url(${mark.src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}
