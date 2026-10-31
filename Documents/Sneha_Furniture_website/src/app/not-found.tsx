import Link from 'next/link';
import ArmchairMark from '@/components/ArmchairMark';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-5 py-24 text-center">
      <div className="relative">
        <p className="font-display text-[clamp(8rem,22vw,16rem)] leading-none text-sand select-none" aria-hidden="true">404</p>
        <ArmchairMark className="draw-once absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 md:w-32 text-brass" strokeWidth={1.6} />
      </div>
      <h1 className="font-display text-5xl md:text-6xl leading-none mt-4">This room is empty</h1>
      <p className="mt-5 max-w-md text-stone leading-relaxed">
        The page you are looking for may have moved, or the piece is no longer in our collection.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="btn btn-primary">Browse the collection</Link>
        <Link href="/" className="btn btn-outline">Back to home</Link>
      </div>
    </div>
  );
}
