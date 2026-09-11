"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { Trail, TrailReport } from "@/lib/types";

const CONDITION_COLOR: Record<string, string> = {
  open: "#2f5a3b",
  caution: "#b08d2f",
  closed: "#8b3a2f",
};

const CONDITION_LABEL: Record<string, string> = {
  open: "Open",
  caution: "Ride with care",
  closed: "Closed",
};

const STAGING_AREAS: { name: string; x: number; y: number }[] = [
  { name: "One Mile", x: 150, y: 500 },
  { name: "Five Mile", x: 330, y: 470 },
  { name: "Cedar Grove", x: 520, y: 470 },
  { name: "CEA Arena", x: 620, y: 300 },
  { name: "Horseshoe Lake", x: 760, y: 380 },
  { name: "Ten Mile House", x: 860, y: 300 },
  { name: "Wildwood Ave", x: 700, y: 545 },
];

type Filters = {
  conditions: Record<string, boolean>;
  trailerParking: boolean;
  water: boolean;
  difficulty: string;
};

const DEFAULT_FILTERS: Filters = {
  conditions: { open: true, caution: true, closed: true },
  trailerParking: false,
  water: false,
  difficulty: "all",
};

export default function TrailMap({
  trails,
  reports,
  compact = false,
}: {
  trails: Trail[];
  reports: TrailReport[];
  compact?: boolean;
}) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ active: boolean; x: number; y: number } | null>(null);

  // Conditions surfaced from rider reports override nothing — they annotate.
  const reportCount = useMemo(() => {
    const map = new Map<string, number>();
    reports.forEach((r) => map.set(r.trailSlug, (map.get(r.trailSlug) ?? 0) + 1));
    return map;
  }, [reports]);

  const visible = useMemo(
    () =>
      trails.filter((t) => {
        if (!filters.conditions[t.condition]) return false;
        if (filters.trailerParking && !t.trailerParking) return false;
        if (filters.water && !t.hasWater) return false;
        if (filters.difficulty !== "all" && t.difficulty !== filters.difficulty)
          return false;
        return true;
      }),
    [trails, filters],
  );

  const selectedTrail = trails.find((t) => t.slug === selected) ?? null;

  const setCondition = (key: string) =>
    setFilters((f) => ({
      ...f,
      conditions: { ...f.conditions, [key]: !f.conditions[key] },
    }));

  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    drag.current = { active: true, x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d?.active) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    drag.current = { active: true, x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-3 border border-saddle-200 bg-white p-4">
          <fieldset>
            <legend className="eyebrow mb-2">Trail condition</legend>
            <div className="flex flex-wrap gap-2">
              {(["open", "caution", "closed"] as const).map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 border border-saddle-200 px-3 py-1.5 text-sm transition-colors hover:bg-forest-50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-forest-700"
                    checked={filters.conditions[key]}
                    onChange={() => setCondition(key)}
                  />
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: CONDITION_COLOR[key] }}
                  />
                  {CONDITION_LABEL[key]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-2">Facilities</legend>
            <div className="flex flex-wrap gap-2">
              <label className="flex cursor-pointer items-center gap-2 border border-saddle-200 px-3 py-1.5 text-sm transition-colors hover:bg-forest-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-forest-700"
                  checked={filters.trailerParking}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, trailerParking: e.target.checked }))
                  }
                />
                Trailer parking
              </label>
              <label className="flex cursor-pointer items-center gap-2 border border-saddle-200 px-3 py-1.5 text-sm transition-colors hover:bg-forest-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-forest-700"
                  checked={filters.water}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, water: e.target.checked }))
                  }
                />
                Water for horses
              </label>
            </div>
          </fieldset>

          <div>
            <label htmlFor="difficulty" className="eyebrow mb-2 block">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="field w-44"
              value={filters.difficulty}
              onChange={(e) =>
                setFilters((f) => ({ ...f, difficulty: e.target.value }))
              }
            >
              <option value="all">All levels</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Strenuous">Strenuous</option>
            </select>
          </div>

          <p className="ml-auto text-sm text-charcoal-500" aria-live="polite">
            {visible.length} of {trails.length} routes shown
          </p>
        </div>

        {/* Map canvas */}
        <div
          className={`relative overflow-hidden border border-forest-700 bg-forest-50 ${
            compact ? "h-[26rem]" : "h-[34rem]"
          }`}
        >
          <svg
            viewBox="0 0 1000 700"
            className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
            role="application"
            aria-label="Interactive map of equestrian trails in Bidwell Park. Use the trail list beside the map for keyboard navigation."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <defs>
              <pattern id="parkFill" width="12" height="12" patternUnits="userSpaceOnUse">
                <rect width="12" height="12" fill="#eef3ea" />
                <path d="M0 12 L12 0" stroke="#dbe5d6" strokeWidth="1" />
              </pattern>
            </defs>

            <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
              {/* Park boundary */}
              <polygon
                points="30,120 120,90 400,80 700,70 960,110 975,300 960,520 820,600 520,620 200,590 50,520"
                fill="url(#parkFill)"
                stroke="#94b492"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <text x="60" y="140" fontSize={18 / zoom} fill="#648f65" fontFamily="serif">
                Bidwell Park
              </text>

              {/* Big Chico Creek */}
              <path
                d="M40,430 C160,400 240,470 360,455 C470,442 520,390 640,392 C760,394 860,352 960,330"
                fill="none"
                stroke="#7fa7c4"
                strokeWidth="10"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x="470"
                y="470"
                fontSize={15 / zoom}
                fill="#4d7794"
                fontFamily="sans-serif"
              >
                Big Chico Creek
              </text>

              {/* Roads */}
              <path
                d="M70,300 C200,270 330,320 470,300 C620,278 760,240 950,225"
                fill="none"
                stroke="#cfa87c"
                strokeWidth="6"
                strokeDasharray="14 10"
                vectorEffect="non-scaling-stroke"
              />
              <text x="470" y="288" fontSize={14 / zoom} fill="#8b5730" fontFamily="sans-serif">
                Upper Park Road
              </text>

              {/* Trails */}
              {visible.map((trail) => {
                const isSelected = selected === trail.slug;
                return (
                  <g key={trail.slug}>
                    <polyline
                      points={trail.mapCoords.map((c) => c.join(",")).join(" ")}
                      fill={trail.mapCoords.length > 3 ? "none" : "none"}
                      stroke={CONDITION_COLOR[trail.condition]}
                      strokeWidth={isSelected ? 8 : 5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={isSelected ? 1 : 0.88}
                      vectorEffect="non-scaling-stroke"
                      className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                      onClick={() => setSelected(trail.slug)}
                    />
                    <polyline
                      points={trail.mapCoords.map((c) => c.join(",")).join(" ")}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={18}
                      className="cursor-pointer"
                      onClick={() => setSelected(trail.slug)}
                    />
                    {(isSelected || zoom > 1.4) && (
                      <text
                        x={trail.mapCoords[Math.floor(trail.mapCoords.length / 2)][0]}
                        y={trail.mapCoords[Math.floor(trail.mapCoords.length / 2)][1] - 12 / zoom}
                        fontSize={16 / zoom}
                        fontFamily="sans-serif"
                        fontWeight={isSelected ? 700 : 500}
                        fill="#1e3727"
                        textAnchor="middle"
                        paintOrder="stroke"
                        stroke="#fdfbf6"
                        strokeWidth={4 / zoom}
                        style={{ pointerEvents: "none" }}
                      >
                        {trail.name}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Staging areas */}
              {STAGING_AREAS.map((area) => (
                <g key={area.name}>
                  <circle
                    cx={area.x}
                    cy={area.y}
                    r={7 / zoom}
                    fill="#fdfbf6"
                    stroke="#1e3727"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={area.x}
                    cy={area.y}
                    r={2.5 / zoom}
                    fill="#1e3727"
                  />
                  <text
                    x={area.x}
                    y={area.y + 22 / zoom}
                    fontSize={13 / zoom}
                    fontFamily="sans-serif"
                    fill="#363b38"
                    textAnchor="middle"
                    paintOrder="stroke"
                    stroke="#fdfbf6"
                    strokeWidth={4 / zoom}
                    style={{ pointerEvents: "none" }}
                  >
                    {area.name}
                  </text>
                </g>
              ))}
            </g>

            {/* Compass + scale bar are drawn outside the transformed group so
                they never distort. */}
            <g transform="translate(940 640)" aria-hidden="true">
              <circle r="20" fill="#fdfbf6" stroke="#94b492" strokeWidth="1.5" />
              <path d="M0,-13 L4,4 L0,1 L-4,4 Z" fill="#1e3727" />
              <text y="-24" fontSize="12" textAnchor="middle" fill="#26472f" fontFamily="sans-serif">
                N
              </text>
            </g>
          </svg>

          <div className="absolute right-3 top-3 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.6, +(z + 0.3).toFixed(2)))}
              className="h-9 w-9 border border-forest-700 bg-cream-50 text-lg font-semibold text-forest-800 hover:bg-forest-50"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.3).toFixed(2)))}
              className="h-9 w-9 border border-forest-700 bg-cream-50 text-lg font-semibold text-forest-800 hover:bg-forest-50"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              onClick={reset}
              className="h-9 w-9 border border-forest-700 bg-cream-50 text-[0.625rem] font-bold tracking-wide text-forest-800 uppercase hover:bg-forest-50"
              aria-label="Reset map view"
            >
              Reset
            </button>
          </div>

          <p className="sr-only" aria-live="polite">
            {visible.length} routes match the current filters.
          </p>
        </div>

        {/* Legend */}
        <ul className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal-600">
          {(["open", "caution", "closed"] as const).map((key) => (
            <li key={key} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-8"
                style={{ background: CONDITION_COLOR[key] }}
              />
              {CONDITION_LABEL[key]}
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-full border-2 border-forest-800 bg-cream-50"
            />
            Staging area
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-8"
              style={{ background: "#7fa7c4" }}
            />
            Big Chico Creek
          </li>
        </ul>
      </div>

      {/* Keyboard-navigable trail list, synced with the map selection */}
      <aside className="border border-saddle-200 bg-white" aria-label="Trail list">
        <h3 className="border-b border-saddle-200 bg-forest-700 px-4 py-3 font-serif text-lg text-cream-50">
          {compact ? "Trails at a glance" : "All routes"}
        </h3>
        <ul className={`divide-y divide-saddle-100 overflow-y-auto ${compact ? "max-h-[24rem]" : "max-h-[32rem]"}`}>
          {visible.map((trail) => (
            <li key={trail.slug}>
              <button
                type="button"
                onClick={() => setSelected(trail.slug)}
                aria-pressed={selected === trail.slug}
                className={`w-full px-4 py-3 text-left transition-colors hover:bg-forest-50 ${
                  selected === trail.slug ? "bg-forest-50" : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: CONDITION_COLOR[trail.condition] }}
                  />
                  <span className="font-semibold text-forest-800">{trail.name}</span>
                </span>
                <span className="mt-1 block text-xs text-charcoal-500">
                  {trail.area} · {trail.lengthMiles} · {trail.difficulty}
                  {reportCount.get(trail.slug)
                    ? ` · ${reportCount.get(trail.slug)} rider report${
                        reportCount.get(trail.slug) === 1 ? "" : "s"
                      }`
                    : ""}
                </span>
              </button>
            </li>
          ))}
          {visible.length === 0 ? (
            <li className="px-4 py-6 text-sm text-charcoal-500">
              No routes match these filters. Clear a filter to see more.
            </li>
          ) : null}
        </ul>

        {selectedTrail ? (
          <div className="border-t border-saddle-200 bg-cream-100 p-4">
            <p className="eyebrow">{selectedTrail.area}</p>
            <h4 className="mt-1 font-serif text-xl text-forest-800">
              {selectedTrail.name}
            </h4>
            <p className="mt-2 text-sm text-charcoal-600">
              {selectedTrail.summary}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-y-1 text-xs text-charcoal-600">
              <dt className="font-semibold">Distance</dt>
              <dd>{selectedTrail.lengthMiles}</dd>
              <dt className="font-semibold">Difficulty</dt>
              <dd>{selectedTrail.difficulty}</dd>
              <dt className="font-semibold">Surface</dt>
              <dd>{selectedTrail.surface}</dd>
              <dt className="font-semibold">Status</dt>
              <dd>{CONDITION_LABEL[selectedTrail.condition]}</dd>
            </dl>
            <Link
              href={`/trails/${selectedTrail.slug}`}
              className="btn btn-secondary mt-4 w-full"
            >
              Full trail detail
            </Link>
          </div>
        ) : (
          <p className="border-t border-saddle-200 bg-cream-100 p-4 text-sm text-charcoal-500">
            Select a route on the map or from this list to see its detail card.
          </p>
        )}
      </aside>
    </div>
  );
}
