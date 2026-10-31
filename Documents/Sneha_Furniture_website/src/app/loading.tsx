import ArmchairMark from '@/components/ArmchairMark';

// Route-level loading state: a small armchair that keeps drawing itself.
export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5" role="status">
      <ArmchairMark className="chair-loop w-20 text-brass" strokeWidth={2} stagger={0.12} />
      <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-stone">Setting the room…</p>
    </div>
  );
}
