"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import type { Trail, TrailReport } from "@/lib/types";

const CONDITION_COPY: Record<string, { label: string; hint: string }> = {
  open: { label: "Open", hint: "Good to ride — nothing that would stop a sane horse." },
  caution: {
    label: "Ride with care",
    hint: "Passable but awkward: deadfall, slick rock, loose footing.",
  },
  closed: {
    label: "Closed",
    hint: "Not rideable — flooding, washout, or a signed closure.",
  },
};

const BADGE: Record<string, string> = {
  open: "border-forest-300 bg-forest-50 text-forest-800",
  caution: "border-brass-500 bg-[#fbf6e6] text-[#6f5420]",
  closed: "border-[#b8604f] bg-[#fbeeea] text-[#7d2f22]",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ConditionsBoard({
  trails,
  reports,
}: {
  trails: Trail[];
  reports: TrailReport[];
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/trail-conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors ?? {});
        setResult({ ok: false, message: data.error ?? "Something went wrong." });
        return;
      }
      setResult({ ok: true, message: data.message });
      (event.target as HTMLFormElement).reset();
    } catch {
      setResult({
        ok: false,
        message: "We could not send that. Please call the trail line at 530-896-7899.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <section aria-labelledby="conditions-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-t-2 border-forest-800 pt-5">
          <div>
            <p className="eyebrow">Rider reports</p>
            <h2 id="conditions-heading" className="mt-2 font-serif text-3xl text-forest-800">
              Conditions board
            </h2>
          </div>
          <p className="text-sm text-charcoal-500">
            {reports.length} approved report{reports.length === 1 ? "" : "s"}
          </p>
        </div>

        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-serif text-lg text-forest-800">{report.trailName}</p>
                  <p className="text-xs text-charcoal-500">
                    {report.reporterName} · ridden {report.riddenOn ?? "recently"} ·
                    logged {formatDate(report.createdAt)}
                  </p>
                </div>
                <span
                  className={`border px-3 py-1 text-xs font-bold tracking-wide uppercase ${
                    BADGE[report.condition]
                  }`}
                >
                  {CONDITION_COPY[report.condition]?.label ?? report.condition}
                </span>
              </div>
              <p className="mt-3 text-sm text-charcoal-700">{report.note}</p>
            </li>
          ))}
          {reports.length === 0 ? (
            <li className="card p-6 text-sm text-charcoal-600">
              No rider reports yet. If you were out there this week, be the first
              to tell everyone else.
            </li>
          ) : null}
        </ul>
      </section>

      <aside id="report" className="lg:sticky lg:top-28 lg:self-start">
        <div className="card border-l-4 border-l-saddle-600 p-6">
          <p className="eyebrow">Report a condition</p>
          <h2 className="mt-2 font-serif text-2xl text-forest-800">
            Tell other riders what you found
          </h2>
          <p className="mt-3 text-sm text-charcoal-600">
            Deadfall across the tread, a washout, a gate someone left open — if
            you rode it, your report helps the next rider decide whether to haul
            out. A CEA volunteer reviews every submission before it appears on
            the board, usually within a day.
          </p>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setErrors({});
              setOpen(true);
            }}
            className="btn btn-primary mt-5 w-full"
          >
            Open the report form
          </button>
          <p className="mt-4 text-xs text-charcoal-500">
            Urgent hazard or an injured rider? Call the park trail line at{" "}
            <a href="tel:+15308967899" className="font-semibold underline">
              530-896-7899
            </a>
            .
          </p>
        </div>

        <div className="card mt-6 bg-forest-50 p-6">
          <h3 className="font-serif text-lg text-forest-800">What makes a good report</h3>
          <ul className="mt-3 space-y-2 text-sm text-charcoal-700">
            <li>— Name the trail and roughly where the problem is.</li>
            <li>— Say when you rode it. Conditions change fast.</li>
            <li>— Describe the hazard, not the horse.</li>
            <li>— Note whether a green horse could get past it.</li>
          </ul>
        </div>
      </aside>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Trail condition report"
        description="Moderated by CEA volunteers before it goes live. Fields marked * are required."
      >
        <form onSubmit={onSubmit} noValidate>
          <div className="grid gap-5">
            <div>
              <label htmlFor="trailSlug" className="mb-1.5 block text-sm font-semibold">
                Trail *
              </label>
              <select id="trailSlug" name="trailSlug" className="field" required defaultValue="">
                <option value="" disabled>
                  Choose a trail…
                </option>
                {trails.map((trail) => (
                  <option key={trail.slug} value={trail.slug}>
                    {trail.name} — {trail.area}
                  </option>
                ))}
              </select>
              {errors.trailSlug ? (
                <p className="mt-1 text-sm text-[#7d2f22]">{errors.trailSlug}</p>
              ) : null}
            </div>

            <fieldset>
              <legend className="mb-1.5 text-sm font-semibold">
                What did you find? *
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {(["open", "caution", "closed"] as const).map((key) => (
                  <label
                    key={key}
                    className="flex cursor-pointer flex-col gap-1 border border-saddle-200 bg-white p-3 text-sm transition-colors hover:bg-forest-50"
                  >
                    <span className="flex items-center gap-2 font-semibold text-forest-800">
                      <input
                        type="radio"
                        name="condition"
                        value={key}
                        className="h-4 w-4 accent-forest-700"
                        required
                      />
                      {CONDITION_COPY[key].label}
                    </span>
                    <span className="pl-6 text-xs text-charcoal-500">
                      {CONDITION_COPY[key].hint}
                    </span>
                  </label>
                ))}
              </div>
              {errors.condition ? (
                <p className="mt-1 text-sm text-[#7d2f22]">{errors.condition}</p>
              ) : null}
            </fieldset>

            <div>
              <label htmlFor="note" className="mb-1.5 block text-sm font-semibold">
                Your report *
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                className="field"
                required
                minLength={12}
                placeholder="Two oaks down across the tread near the two-mile mark. Crossable on the uphill side for an experienced horse."
              />
              {errors.note ? (
                <p className="mt-1 text-sm text-[#7d2f22]">{errors.note}</p>
              ) : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="reporterName" className="mb-1.5 block text-sm font-semibold">
                  Your name *
                </label>
                <input
                  id="reporterName"
                  name="reporterName"
                  className="field"
                  required
                  autoComplete="name"
                />
                {errors.reporterName ? (
                  <p className="mt-1 text-sm text-[#7d2f22]">{errors.reporterName}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="reporterEmail" className="mb-1.5 block text-sm font-semibold">
                  Email *
                </label>
                <input
                  id="reporterEmail"
                  name="reporterEmail"
                  type="email"
                  className="field"
                  required
                  autoComplete="email"
                />
                {errors.reporterEmail ? (
                  <p className="mt-1 text-sm text-[#7d2f22]">{errors.reporterEmail}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="riddenOn" className="mb-1.5 block text-sm font-semibold">
                  Date ridden
                </label>
                <input id="riddenOn" name="riddenOn" type="date" className="field" />
              </div>
              <div className="flex items-end">
                <p className="text-xs text-charcoal-500">
                  We publish your first name only. We never publish your email.
                </p>
              </div>
            </div>

            {result ? (
              <p
                role="status"
                className={`border-l-4 p-4 text-sm ${
                  result.ok
                    ? "border-forest-600 bg-forest-50 text-forest-800"
                    : "border-[#8b3a2f] bg-[#fbeeea] text-[#7d2f22]"
                }`}
              >
                {result.message}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 border-t border-saddle-200 pt-5">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Sending…" : "Submit report"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                {result?.ok ? "Close" : "Cancel"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
