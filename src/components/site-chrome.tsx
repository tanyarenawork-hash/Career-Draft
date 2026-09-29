import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/builder", label: "Skills builder" },
  { to: "/case-studies", label: "Case studies" },
  { to: "/career-fair", label: "Career fair" },
  { to: "/library", label: "Library" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-baseline gap-1.5" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl tracking-tight">
            NextStep <span className="italic">Lab</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-xs font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
              activeProps={{ className: "text-cobalt" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center border border-border md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border px-5 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-xs font-medium tracking-widest text-foreground uppercase hover:bg-secondary"
                  activeProps={{ className: "text-cobalt" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-xs tracking-wider text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>NextStep Lab — a student portfolio project about internship readiness.</p>
        <p className="max-w-md normal-case tracking-normal">
          Privacy note: your drafts are saved only in this browser using local storage. Nothing is
          uploaded, and clearing your browser data removes them.
        </p>
      </div>
    </footer>
  );
}
