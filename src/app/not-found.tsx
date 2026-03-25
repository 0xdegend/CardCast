import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-7xl mb-6 animate-float">🎴</div>
      <h1 className="font-display font-extrabold text-5xl tracking-tight mb-3">404</h1>
      <p className="font-display font-bold text-xl mb-2">Page Not Found</p>
      <p className="text-[var(--text-muted)] max-w-sm mb-8">
        This card doesn&apos;t exist in our binder. Maybe it was pulled already?
      </p>
      <div className="flex gap-3">
        <Link href="/"><Button>Go Home</Button></Link>
        <Link href="/markets"><Button variant="secondary">Browse Markets</Button></Link>
      </div>
    </div>
  );
}
