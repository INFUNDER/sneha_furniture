import Image from 'next/image';

// Split layout for sign in / sign up: arched room photo on the left, form on the right.
export default function AuthLayout({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-12 md:py-20 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[80vh]">
      <div className="hidden lg:block relative">
        <div className="arch relative aspect-[4/5] max-h-[75vh] bg-sand">
          <Image src="/hero-pic.jpg" alt="" fill sizes="45vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <p className="absolute bottom-8 left-8 right-8 font-display text-3xl leading-tight text-ivory">
          Save favourites, track deliveries and review the pieces you live with.
        </p>
      </div>

      <div className="w-full max-w-md mx-auto lg:mx-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display text-6xl leading-[0.95] mt-5 mb-10">{title}</h1>
        {children}
      </div>
    </div>
  );
}
