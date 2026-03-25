import Link from "next/link";

const LINKS = {
  Product: ["Markets", "Leaderboard", "Create Market", "Profile"],
  Resources: ["Docs", "API", "Discord", "Twitter/X"],
  Legal: ["Terms of Service", "Privacy Policy", "Risk Disclaimer"],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--teal)] to-[var(--purple)] flex items-center justify-center text-sm font-bold text-black">◈</div>
              <span className="font-display font-extrabold text-base">CardCast</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[200px]">
              The prediction market built for TCG collectors and traders.
            </p>
            <div className="flex gap-3 mt-5">
              {["𝕏", "⌥", "◎"].map((icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] mb-4 font-display">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-dim)]">
            © 2025 CardCast. All rights reserved. Not financial advice.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-blink" />
              All systems operational
            </span>
            <span className="text-xs font-mono text-[var(--text-dim)]">v0.1.0-beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
