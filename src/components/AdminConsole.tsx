"use client";

import { useCallback, useEffect, useState } from "react";
import type { Listing, TrailReport } from "@/lib/types";

const ROLES = [
  { id: "visitor", label: "Visitor" },
  { id: "rider", label: "Registered Rider" },
  { id: "business", label: "Business Owner" },
  { id: "admin", label: "CEA Admin" },
] as const;

const MATRIX: {
  capability: string;
  visitor: string;
  rider: string;
  business: string;
  admin: string;
}[] = [
  {
    capability: "Read trails, conditions, events, news",
    visitor: "Yes",
    rider: "Yes",
    business: "Yes",
    admin: "Yes",
  },
  {
    capability: "Search the business directory",
    visitor: "Yes",
    rider: "Yes",
    business: "Yes",
    admin: "Yes",
  },
  {
    capability: "Submit a trail condition report",
    visitor: "No — email only",
    rider: "Yes, queued",
    business: "Yes, queued",
    admin: "Yes, auto-published",
  },
  {
    capability: "Submit or edit a directory listing",
    visitor: "No",
    rider: "No",
    business: "Own listing only",
    admin: "All listings",
  },
  {
    capability: "Approve or reject submissions",
    visitor: "No",
    rider: "No",
    business: "No",
    admin: "Yes",
  },
  {
    capability: "Publish events, news, and resources",
    visitor: "No",
    rider: "No",
    business: "No",
    admin: "Yes",
  },
  {
    capability: "Vote at the AGM, hold office",
    visitor: "No",
    rider: "Yes, if current",
    business: "Yes, if current",
    admin: "Yes, if current",
  },
];

export default function AdminConsole() {
  const [role, setRole] = useState<string>("admin");
  const [reports, setReports] = useState<TrailReport[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async (currentRole: string) => {
    if (currentRole !== "admin") {
      setReports([]);
      setListings([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/queue", {
        headers: { "x-cea-role": currentRole },
        cache: "no-store",
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Could not load the queue.");
      }
      const body = await response.json();
      setReports(body.reports ?? []);
      setListings(body.listings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQueue(role);
  }, [role, loadQueue]);

  async function moderate(
    kind: "report" | "listing",
    id: number,
    action: "approved" | "rejected",
  ) {
    setMessage(null);
    try {
      const response = await fetch("/api/admin/moderate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-cea-role": role },
        body: JSON.stringify({ kind, id, action }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Moderation failed.");
      setMessage(`${kind === "report" ? "Trail report" : "Listing"} ${body.message}`);
      if (kind === "report") {
        setReports((prev) => prev.filter((r) => r.id !== id));
      } else {
        setListings((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Moderation failed.");
    }
  }

  return (
    <div className="space-y-12">
      {/* Role switcher (demo) */}
      <section className="card p-6" aria-labelledby="role-heading">
        <h2 id="role-heading" className="font-serif text-xl text-forest-800">
          Viewing as
        </h2>
        <p className="mt-2 text-sm text-charcoal-600">
          In production this role comes from the volunteer&apos;s signed-in
          session. Switch it here to see how each permission level experiences
          the site.
        </p>
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Demo role switcher"
        >
          {ROLES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRole(item.id)}
              aria-pressed={role === item.id}
              className={`border px-4 py-2 text-sm font-semibold transition-colors ${
                role === item.id
                  ? "border-forest-700 bg-forest-700 text-cream-50"
                  : "border-saddle-200 bg-white text-forest-800 hover:bg-forest-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Moderation queue */}
      <section aria-labelledby="queue-heading">
        <div className="mb-5 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">Moderation queue</p>
          <h2 id="queue-heading" className="mt-2 font-serif text-3xl text-forest-800">
            Waiting on a volunteer
          </h2>
        </div>

        {role !== "admin" ? (
          <p className="border border-saddle-200 bg-cream-100 p-6 text-sm text-charcoal-700">
            The moderation queue is only visible to CEA admins. Switch the role
            above to <strong>CEA Admin</strong> to review submitted trail
            condition reports and directory applications.
          </p>
        ) : loading ? (
          <p className="text-sm text-charcoal-600">Loading queue…</p>
        ) : (
          <div className="space-y-10">
            {message ? (
              <p role="status" className="border-l-4 border-forest-600 bg-forest-50 p-4 text-sm">
                {message}
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="border-l-4 border-[#8b3a2f] bg-[#fbeeea] p-4 text-sm text-[#7d2f22]">
                {error}
              </p>
            ) : null}

            <div>
              <h3 className="font-serif text-xl text-forest-800">
                Trail condition reports ({reports.length})
              </h3>
              {reports.length === 0 ? (
                <p className="mt-3 text-sm text-charcoal-600">
                  Nothing queued. Rider reports appear here the moment they are
                  submitted.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {reports.map((report) => (
                    <li key={report.id} className="card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-serif text-lg text-forest-800">
                            {report.trailName}
                          </p>
                          <p className="text-xs text-charcoal-500">
                            {report.reporterName} · {report.reporterEmail} ·
                            condition: {report.condition}
                            {report.riddenOn ? ` · ridden ${report.riddenOn}` : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moderate("report", report.id, "approved")}
                            className="btn btn-primary"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => moderate("report", report.id, "rejected")}
                            className="btn btn-secondary"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-charcoal-700">{report.note}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="font-serif text-xl text-forest-800">
                Directory applications ({listings.length})
              </h3>
              {listings.length === 0 ? (
                <p className="mt-3 text-sm text-charcoal-600">
                  No pending business listings.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {listings.map((listing) => (
                    <li key={listing.id} className="card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-serif text-lg text-forest-800">
                            {listing.name}
                          </p>
                          <p className="text-xs text-charcoal-500">
                            {listing.category} · {listing.city} · {listing.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moderate("listing", listing.id, "approved")}
                            className="btn btn-primary"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => moderate("listing", listing.id, "rejected")}
                            className="btn btn-secondary"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-charcoal-700">
                        {listing.description}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Permission matrix */}
      <section aria-labelledby="matrix-heading">
        <div className="mb-5 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">Permissions</p>
          <h2 id="matrix-heading" className="mt-2 font-serif text-3xl text-forest-800">
            Who can do what
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-sm">
            <caption className="sr-only">
              User roles and the capabilities each one has on the CEA site
            </caption>
            <thead>
              <tr className="bg-forest-800 text-cream-50">
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  Capability
                </th>
                {ROLES.map((r) => (
                  <th
                    key={r.id}
                    scope="col"
                    className={`px-4 py-3 text-left font-semibold ${
                      role === r.id ? "bg-forest-700" : ""
                    }`}
                  >
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row, i) => (
                <tr key={row.capability} className={i % 2 ? "bg-cream-100" : "bg-white"}>
                  <th scope="row" className="px-4 py-3 text-left font-medium text-forest-800">
                    {row.capability}
                  </th>
                  {(["visitor", "rider", "business", "admin"] as const).map((key) => (
                    <td
                      key={key}
                      className={`px-4 py-3 text-charcoal-700 ${
                        role === key ? "bg-forest-50 font-semibold" : ""
                      }`}
                    >
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
