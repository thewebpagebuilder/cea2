"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav, site } from "@/lib/nav";

export default function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  // Close everything on navigation.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-saddle-200 bg-cream-50/98 shadow-[0_1px_0_rgba(35,39,36,0.06)] backdrop-blur-[2px]"
          : "border-transparent bg-cream-50"
      }`}
    >
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Utility strip: the two phone numbers riders actually need. */}
      <div className="hidden border-b border-saddle-200/70 bg-forest-800 text-cream-100 lg:block">
        <div className="container-cea flex items-center justify-between py-2 text-xs">
          <p className="tracking-wide">
            {site.tagline} · Chico, California
          </p>
          <p className="flex items-center gap-6">
            <span>
              Are the park trails open?{" "}
              <a
                href={site.trailLineHref}
                className="font-semibold underline decoration-brass-500 decoration-2 underline-offset-4 hover:text-brass-500"
              >
                {site.trailLine}
              </a>
            </span>
            <span>
              Arena Way gate:{" "}
              <a
                href={site.gateLineHref}
                className="font-semibold underline decoration-brass-500 decoration-2 underline-offset-4 hover:text-brass-500"
              >
                {site.gateLine}
              </a>
            </span>
          </p>
        </div>
      </div>

      <div className="container-cea flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} home`}>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-700 bg-forest-700 text-cream-50"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.5 20V9.2c0-1.6.8-2.6 2.2-2.9 1.9-.4 3.3.3 4.3 2 .9 1.6 2.3 2.4 4.3 2 1.4-.3 2.2-1.3 2.2-2.9V20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M6.5 20h11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold text-forest-800">
              Chico Equestrian
            </span>
            <span className="block text-[0.6875rem] font-semibold tracking-[0.2em] text-saddle-700 uppercase">
              Association
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isOpen = openMenu === item.label;
              const active =
                pathname === item.href ||
                (item.children ?? []).some((c) =>
                  c.href.startsWith(pathname + "#") ? false : pathname.startsWith(c.href.split("#")[0]) && c.href.split("#")[0] !== "/",
                );
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    if (hasChildren) setOpenMenu(item.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`${menuId}-${item.label}`}
                        className={`flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:text-forest-600 ${
                          active ? "text-forest-800" : "text-charcoal-700"
                        }`}
                        onClick={() => setOpenMenu(isOpen ? null : item.label)}
                      >
                        {item.label}
                        <svg
                          aria-hidden="true"
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        >
                          <path
                            d="M2 4.5 6 8.5l4-4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <div
                        id={`${menuId}-${item.label}`}
                        hidden={!isOpen}
                        className="absolute left-0 z-50 w-[22rem] border border-saddle-200 bg-white pt-1 shadow-[0_18px_40px_-28px_rgba(21,39,29,0.6)]"
                        onFocus={cancelClose}
                      >
                        <ul className="divide-y divide-saddle-100">
                          {item.children?.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block px-4 py-3 transition-colors hover:bg-forest-50"
                              >
                                <span className="block text-sm font-semibold text-forest-800">
                                  {child.label}
                                </span>
                                <span className="mt-0.5 block text-xs text-charcoal-500">
                                  {child.description}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:text-forest-600 ${
                        active
                          ? "text-forest-800 underline decoration-brass-500 decoration-2 underline-offset-8"
                          : "text-charcoal-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/membership" className="btn btn-primary hidden sm:inline-flex">
            Become a Member
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-sm border border-saddle-300 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span
              aria-hidden="true"
              className={`block h-[2px] w-5 bg-forest-800 transition-transform duration-200 ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              aria-hidden="true"
              className={`block h-[2px] w-5 bg-forest-800 transition-opacity duration-200 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              aria-hidden="true"
              className={`block h-[2px] w-5 bg-forest-800 transition-transform duration-200 ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile panel: slide-in from the right, no layout shift (fixed layer). */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-charcoal-900/45 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal={mobileOpen}
          aria-label="Site menu"
          className={`absolute top-0 right-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-cream-50 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-saddle-200 px-5 py-4">
            <p className="font-serif text-lg text-forest-800">Menu</p>
            <button
              type="button"
              tabIndex={mobileOpen ? 0 : -1}
              onClick={() => setMobileOpen(false)}
              className="rounded-sm border border-saddle-300 px-3 py-1.5 text-sm font-semibold text-forest-800"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="px-5 py-4">
            <ul className="space-y-1">
              {mainNav.map((item) => (
                <li key={item.label} className="border-b border-saddle-100 pb-3 pt-2">
                  <Link
                    href={item.href}
                    tabIndex={mobileOpen ? 0 : -1}
                    className="block font-serif text-xl text-forest-800"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mt-2 space-y-1 pl-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            tabIndex={mobileOpen ? 0 : -1}
                            className="block py-1 text-sm text-charcoal-600"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3">
              <Link
                href="/membership"
                tabIndex={mobileOpen ? 0 : -1}
                className="btn btn-primary w-full"
              >
                Become a Member
              </Link>
              <Link
                href="/trails"
                tabIndex={mobileOpen ? 0 : -1}
                className="btn btn-secondary w-full"
              >
                Explore Trails
              </Link>
            </div>

            <dl className="mt-8 space-y-2 rounded-sm bg-forest-50 p-4 text-sm">
              <div>
                <dt className="font-semibold text-forest-800">Trails open?</dt>
                <dd>
                  <a href={site.trailLineHref} className="underline">
                    {site.trailLine}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-forest-800">Arena Way gate</dt>
                <dd>
                  <a href={site.gateLineHref} className="underline">
                    {site.gateLine}
                  </a>
                </dd>
              </div>
            </dl>
          </nav>
        </div>
      </div>
    </header>
  );
}
