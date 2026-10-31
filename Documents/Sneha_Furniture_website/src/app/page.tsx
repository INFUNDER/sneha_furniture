import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import MinimalProductCard from '@/components/MinimalProductCard';
import ArmchairMark from '@/components/ArmchairMark';
import { parseImages, productImage } from '@/lib/images';
import { displayTitle, formatPrice } from '@/lib/format';

export const revalidate = 60;

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` } as React.CSSProperties);

const PROMISES = [
  { n: '01', title: 'Free delivery', body: 'Every order is delivered free of charge, carefully handled by our own team in and around Dehradun.' },
  { n: '02', title: 'Pay on delivery', body: 'Pay in cash when your furniture arrives and you have seen it in your home.' },
  { n: '03', title: 'Warranty included', body: 'Up to 36 months of warranty on manufacturing defects, listed on every product.' },
  { n: '04', title: 'A showroom to visit', body: 'Sit, touch and compare before you decide, at our showroom on Saharanpur Road.' },
];

const SERVICES = [
  { title: 'Bespoke design', body: 'Pieces made to your measurements, fabric and finish.' },
  { title: 'Interior styling', body: 'A curated room, from layout to the last cushion.' },
  { title: 'Restoration', body: 'New life for the pieces your family already loves.' },
];

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, price: true, discountPrice: true, stock: true, images: true, category: true, primaryMaterial: true, warranty: true, description: true },
  });

  const newArrivals = products.slice(0, 8);

  // Category tiles are built from the catalogue so they never lead to an empty page.
  const categories = new Map<string, { image: string; count: number }>();
  for (const p of [...products].reverse()) {
    const entry = categories.get(p.category);
    if (entry) entry.count += 1;
    else categories.set(p.category, { image: parseImages(p.images)[0] || '', count: 1 });
  }

  // Spotlight the most premium in-stock piece
  const spotlight = [...products].filter((p) => p.stock > 0).sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))[0];
  const spotlightImages = spotlight ? parseImages(spotlight.images) : [];
  const heroPick = products.find((p) => p.category === 'Sofa') ?? products[0];

  return (
    <div className="overflow-x-clip">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative max-w-[1440px] mx-auto px-5 md:px-10 pt-8 md:pt-14 pb-20 md:pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-16 items-center">
        <div className="relative z-10">
          <p className="eyebrow" data-reveal>Furniture studio · Dehradun</p>
          <h1 className="font-display text-[clamp(3.25rem,8.2vw,7.5rem)] leading-[0.92] tracking-[-0.02em] mt-6" data-reveal style={delay(100)}>
            <span className="split-line"><span style={delay(150)}>Crafted for</span></span>
            <span className="split-line"><span style={delay(300)}><em className="text-brass font-light">slow</em> living.</span></span>
          </h1>
          <p className="mt-8 max-w-md text-[17px] leading-relaxed text-stone" data-reveal style={delay(450)}>
            Sofas, beds and dining sets chosen for comfort that lasts and design that stays quiet. See them in our showroom, or have them delivered free to your door.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4" data-reveal style={delay(550)}>
            <Link href="/shop" className="btn btn-primary">
              Explore the collection <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn btn-outline">Visit the showroom</Link>
          </div>
        </div>

        <div className="relative">
          {/* soft backdrop shape */}
          <div className="absolute -right-24 -top-10 w-[70%] aspect-square rounded-full bg-linen -z-10 hidden lg:block" data-parallax="-0.06" />
          <div className="arch relative aspect-[5/4] sm:aspect-[5/6] lg:aspect-[4/5] max-h-[78vh] w-full bg-sand" data-reveal="image">
            <div className="absolute inset-0">
              <div className="absolute inset-[-8%]" data-parallax="0.08">
                <Image src="/hero-pic.jpg" alt="A calm living room with a linen sofa, walnut side table and floor lamp" fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>

          {heroPick && (
            <Link
              href={`/products/${heroPick.id}`}
              className="group absolute -bottom-8 left-4 md:-left-10 w-[230px] md:w-[260px] card p-3 flex items-center gap-3 shadow-[0_20px_50px_-20px_rgba(31,26,23,0.35)] hover:-translate-y-1 transition-transform duration-500"
              data-reveal
              style={delay(900)}
            >
              <span className="relative w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                <Image src={productImage(parseImages(heroPick.images)[0] || '', 200)} alt="" fill sizes="64px" className="object-cover" unoptimized />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-brass">Featured</span>
                <span className="block font-display text-lg leading-tight truncate">{displayTitle(heroPick.title)}</span>
                <span className="block text-sm text-stone">{formatPrice(heroPick.discountPrice ?? heroPick.price)}</span>
              </span>
              <ArrowUpRight size={18} className="ml-auto shrink-0 text-stone group-hover:text-brass transition-colors" />
            </Link>
          )}
        </div>
      </section>

      {/* ─── Shop by room ────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p className="eyebrow" data-reveal>Shop by room</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[1] mt-5" data-reveal style={delay(100)}>
              Every room, <em className="text-brass">considered.</em>
            </h2>
          </div>
          <Link href="/shop" className="link-draw text-sm font-semibold tracking-[0.14em] uppercase" data-reveal style={delay(200)}>
            All furniture
          </Link>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
          {[...categories].map(([category, { image, count }], i) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="group snap-start shrink-0 w-[72vw] sm:w-[45vw] md:w-auto"
              data-reveal
              style={delay(i * 110)}
            >
              <div className="arch relative aspect-[3/4] bg-sand">
                {image && (
                  <Image
                    src={productImage(image, 700)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 72vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out-soft group-hover:scale-[1.06]"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0" />
                <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between text-ivory">
                  <div>
                    <h3 className="font-display text-3xl leading-none">{category}</h3>
                    <p className="text-xs tracking-[0.16em] uppercase mt-2 text-ivory/80">{count} {count === 1 ? 'piece' : 'pieces'}</p>
                  </div>
                  <span className="grid place-items-center w-11 h-11 rounded-full border border-ivory/50 transition-colors duration-500 group-hover:bg-ivory group-hover:text-ink">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Statement ───────────────────────────────────────── */}
      <section className="bg-linen">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-24 md:py-36 text-center flex flex-col items-center">
          <div data-reveal><ArmchairMark className="draw-once w-16 text-brass mb-10" strokeWidth={1.6} /></div>
          <p className="font-display text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.15] text-ink text-balance" data-reveal>
            A home isn&apos;t furnished in a day. It is built <em className="text-brass">one considered piece</em> at a time: the sofa you sink into after work, the table that hosts every festival, the bed you wake up grateful for.
          </p>
          <Link href="/about" className="mt-12 link-draw text-sm font-semibold tracking-[0.14em] uppercase" data-reveal style={delay(150)}>
            Read our story
          </Link>
        </div>
      </section>

      {/* ─── New arrivals ────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p className="eyebrow" data-reveal>Just arrived</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[1] mt-5" data-reveal style={delay(100)}>
              New in the showroom
            </h2>
          </div>
          <Link href="/shop" className="btn btn-outline" data-reveal style={delay(200)}>
            Shop all <ArrowRight size={16} />
          </Link>
        </div>

        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">
            {newArrivals.map((product, i) => (
              <div key={product.id} data-reveal style={delay((i % 4) * 90)}>
                <MinimalProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone">New pieces are on their way. Please check back soon.</p>
        )}
      </section>

      {/* ─── Spotlight ───────────────────────────────────────── */}
      {spotlight && (
        <section className="max-w-[1440px] mx-auto px-5 md:px-10 pb-24 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="relative aspect-[4/3] lg:aspect-[5/6] overflow-hidden rounded-[1.5rem] bg-sand" data-reveal="image">
              <div className="absolute inset-0">
              <div className="absolute inset-[-10%]" data-parallax="0.07">
                <Image
                  src={productImage(spotlightImages[0] || '', 1400)}
                  alt={displayTitle(spotlight.title)}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              </div>
            </div>
            <div>
              <p className="eyebrow" data-reveal>The statement piece</p>
              <h2 className="font-display text-5xl md:text-6xl leading-[1.02] mt-5" data-reveal style={delay(100)}>
                {displayTitle(spotlight.title)}
              </h2>
              <p className="mt-6 text-stone leading-relaxed line-clamp-4" data-reveal style={delay(200)}>
                {spotlight.description}
              </p>
              <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6" data-reveal style={delay(300)}>
                {spotlight.primaryMaterial && (
                  <div className="col-span-2">
                    <dt className="field-label">Materials</dt>
                    <dd className="mt-2 text-sm leading-relaxed">{spotlight.primaryMaterial}</dd>
                  </div>
                )}
                {spotlight.warranty && (
                  <div>
                    <dt className="field-label">Warranty</dt>
                    <dd className="mt-2 text-sm">{spotlight.warranty}</dd>
                  </div>
                )}
                <div>
                  <dt className="field-label">Price</dt>
                  <dd className="mt-2 text-sm">
                    <span className="font-semibold">{formatPrice(spotlight.discountPrice ?? spotlight.price)}</span>
                    {spotlight.discountPrice != null && spotlight.discountPrice < spotlight.price && (
                      <span className="ml-2 text-stone line-through">{formatPrice(spotlight.price)}</span>
                    )}
                  </dd>
                </div>
              </dl>
              <Link href={`/products/${spotlight.id}`} className="btn btn-primary mt-10" data-reveal style={delay(400)}>
                Discover the piece <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Promises ────────────────────────────────────────── */}
      <section className="bg-linen">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow" data-reveal>Our promise</p>
              <h2 className="font-display text-5xl md:text-6xl leading-[1] mt-5" data-reveal style={delay(100)}>
                Simple, <em className="text-brass">honest</em> buying.
              </h2>
            </div>
            <ol className="grid sm:grid-cols-2 gap-x-10">
              {PROMISES.map((p, i) => (
                <li key={p.n} className="border-t border-line py-8" data-reveal style={delay(i * 100)}>
                  <span className="font-display text-brass text-xl">{p.n}</span>
                  <h3 className="font-display text-3xl mt-3">{p.title}</h3>
                  <p className="mt-3 text-stone leading-relaxed">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ─── Services ────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] max-h-[620px] w-full" data-reveal="image">
            <div className="arch absolute inset-0 bg-sand">
              <Image src="/sofa-pic.jpg" alt="A styled corner with an upholstered chair" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div>
            <p className="eyebrow" data-reveal>Beyond the catalogue</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[1] mt-5" data-reveal style={delay(100)}>
              Made to fit <em className="text-brass">your</em> home.
            </h2>
            <ul className="mt-10">
              {SERVICES.map((s, i) => (
                <li key={s.title} className="flex items-baseline justify-between gap-6 border-t border-line py-6 last:border-b" data-reveal style={delay(150 + i * 100)}>
                  <h3 className="font-display text-3xl">{s.title}</h3>
                  <p className="text-sm text-stone text-right max-w-[220px]">{s.body}</p>
                </li>
              ))}
            </ul>
            <Link href="/services" className="btn btn-outline mt-10" data-reveal style={delay(450)}>
              Explore services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
