import Link from "next/link";
import { site } from "@/lib/nav";

const columns = [
  {
    heading: "Ride",
    links: [
      { label: "Trail Guide", href: "/trails" },
      { label: "Conditions Board", href: "/trails/conditions" },
      { label: "Safety & Etiquette", href: "/safety" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Business Directory", href: "/directory" },
      { label: "Join or Renew", href: "/membership" },
      { label: "Get Involved", href: "/get-involved" },
      { label: "Sponsors", href: "/sponsors" },
    ],
  },
  {
    heading: "Association",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Board & Volunteers", href: "/about/board" },
      { label: "News", href: "/news" },
      { label: "Resources", href: "/resources" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-saddle-200 bg-forest-900 text-cream-100">
      <div className="container-cea py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl text-cream-50">
              Chico Equestrian Association
            </p>
            <p className="mt-3 max-w-xs text-sm text-forest-100/85">
              {site.tagline}. Chico continues to keep Annie Bidwell&apos;s dream
              alive of keeping horses in our park — and we provide education to
              members and the community.
            </p>
            <dl className="mt-6 space-y-1.5 text-sm text-forest-100/85">
              <div className="flex gap-2">
                <dt className="sr-only">Trail status line</dt>
                <dd>
                  Trail status:{" "}
                  <a
                    className="font-semibold text-cream-50 underline decoration-brass-500 decoration-2 underline-offset-4 hover:text-brass-500"
                    href={site.trailLineHref}
                  >
                    {site.trailLine}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="sr-only">Arena Way gate line</dt>
                <dd>
                  Arena Way gate:{" "}
                  <a
                    className="font-semibold text-cream-50 underline decoration-brass-500 decoration-2 underline-offset-4 hover:text-brass-500"
                    href={site.gateLineHref}
                  >
                    {site.gateLine}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-labelledby={`footer-${col.heading}`}>
              <h2
                id={`footer-${col.heading}`}
                className="font-sans text-xs font-bold tracking-[0.16em] text-brass-500 uppercase"
              >
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-forest-100/90 underline-offset-4 hover:text-cream-50 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="rule-hair my-10 bg-forest-700" />

        <div className="flex flex-col gap-4 text-xs text-forest-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. A 501(c)(3) volunteer
            association. All digital assets owned by CEA.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/contact" className="hover:text-cream-50 hover:underline">
              Contact
            </Link>
            <Link href="/admin" className="hover:text-cream-50 hover:underline">
              Volunteer admin
            </Link>
            <Link href="/design" className="hover:text-cream-50 hover:underline">
              Design system
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
