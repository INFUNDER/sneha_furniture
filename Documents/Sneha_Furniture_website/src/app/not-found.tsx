import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white px-6 text-center">
      <h1 className="text-9xl font-black uppercase tracking-tighter text-black/10">404</h1>
      <h2 className="text-4xl font-black uppercase tracking-widest mt-4">Page Not Found</h2>
      <p className="mt-6 text-sm font-medium opacity-70 max-w-md mx-auto leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/"
        className="mt-12 inline-flex items-center justify-center bg-black text-white rounded-full px-12 py-5 text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition"
      >
        RETURN HOME
      </Link>
    </div>
  );
}
