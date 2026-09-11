"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { ListingCard } from "@/components/cards";
import type { Listing } from "@/lib/types";

const REGIONS = ["All regions", "Chico", "Butte County"];

export default function DirectoryExplorer({
  listings,
}: {
  listings: Listing[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [region, setRegion] = useState("All regions");
  const [service, setService] = useState("All services");
  const [active, setActive] = useState<Listing | null>(null);

  const categories = useMemo(
    () => [
      "All categories",
      ...Array.from(new Set(listings.map((l) => l.category))).sort((a, b) =>
        a.localeCompare(b),
      ),
    ],
    [listings],
  );

  const services = useMemo(
    () =>
      Array.from(new Set(listings.flatMap((l) => l.services)))
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 24),
    [listings],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((listing) => {
      if (category !== "All categories" && listing.category !== category) return false;
      if (region !== "All regions" && listing.region !== region) return false;
      if (service !== "All services" && !listing.services.includes(service))
        return false;
      if (!q) return true;
      const haystack = [
        listing.name,
        listing.category,
        listing.city,
        listing.description,
        ...listing.services,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [listings, query, category, region, service]);

  const reset = () => {
    setQuery("");
    setCategory("All categories");
    setRegion("All regions");
    setService("All services");
  };

  return (
    <>
      <div className="sticky top-[72px] z-30 -mx-5 border-y border-saddle-200 bg-cream-50/98 px-5 py-4 backdrop-blur-[2px]">
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
          <div>
            <label htmlFor="directory-search" className="eyebrow mb-1.5 block">
              Search
            </label>
            <input
              id="directory-search"
              type="search"
              className="field"
              placeholder="Farrier, boarding, trailer repair…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="directory-category" className="eyebrow mb-1.5 block">
              Category
            </label>
            <select
              id="directory-category"
              className="field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="directory-region" className="eyebrow mb-1.5 block">
              Region
            </label>
            <select
              id="directory-region"
              className="field"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {REGIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="directory-service" className="eyebrow mb-1.5 block">
              Service
            </label>
            <select
              id="directory-service"
              className="field"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option>All services</option>
              {services.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="button" onClick={reset} className="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm text-charcoal-500" aria-live="polite">
          Showing {results.length} of {listings.length} listings
        </p>
      </div>

      {results.length ? (
        <ul className="mt-8 grid list-none gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((listing) => (
            <li key={listing.slug} className="flex">
              <ListingCard listing={listing} onSelect={setActive} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border border-saddle-200 bg-white p-10 text-center">
          <h2 className="font-serif text-2xl text-forest-800">
            Nothing matches that yet
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-600">
            We are building this directory business by business. If you provide
            an equine service in the north valley and are not listed, we would
            like to hear from you.
          </p>
          <button type="button" onClick={reset} className="btn btn-secondary mt-6">
            Clear filters
          </button>
        </div>
      )}

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.name ?? ""}
        description={active ? `${active.category} · ${active.city}` : undefined}
      >
        {active ? (
          <div>
            <p className="text-sm text-charcoal-700">{active.description}</p>

            <h3 className="mt-6 font-serif text-lg text-forest-800">Services</h3>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              {active.services.map((s) => (
                <li
                  key={s}
                  className="border border-saddle-200 bg-cream-100 px-2.5 py-1 text-charcoal-700"
                >
                  {s}
                </li>
              ))}
            </ul>

            <dl className="mt-6 grid gap-3 border-t border-saddle-200 pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-forest-800">Membership</dt>
                <dd className="text-charcoal-700">
                  {active.memberLevel}
                  {active.memberSince ? ` since ${active.memberSince}` : ""}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-forest-800">Serving</dt>
                <dd className="text-charcoal-700">{active.region}</dd>
              </div>
              {active.phone ? (
                <div>
                  <dt className="font-semibold text-forest-800">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${active.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-forest-700 underline"
                    >
                      {active.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {active.email ? (
                <div>
                  <dt className="font-semibold text-forest-800">Email</dt>
                  <dd>
                    <a href={`mailto:${active.email}`} className="text-forest-700 underline">
                      {active.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {active.website ? (
                <div>
                  <dt className="font-semibold text-forest-800">Website</dt>
                  <dd>
                    <a
                      href={active.website}
                      className="text-forest-700 underline"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Visit site
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-6 border-t border-saddle-200 pt-5 text-xs text-charcoal-500">
              Listings are provided as a member benefit. CEA does not endorse or
              warrant any business listed here — ask for references, as you
              would anywhere else.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActive(null)}
              >
                Back to directory
              </button>
              {active.phone ? (
                <a
                  className="btn btn-secondary"
                  href={`tel:${active.phone.replace(/[^0-9+]/g, "")}`}
                >
                  Call
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
