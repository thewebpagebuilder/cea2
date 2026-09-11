"use client";

import { useState } from "react";

const CATEGORIES = [
  "Farrier",
  "Veterinary",
  "Feed & Tack",
  "Boarding & Stables",
  "Riding Instruction",
  "Hauling & Transport",
  "Equine Dentistry",
  "Bodywork & Therapy",
  "Fencing & Facilities",
  "Rescue & Sanctuary",
  "Insurance & Services",
  "Farm Services",
  "Tack & Fitting",
];

const SERVICE_SUGGESTIONS = [
  "Emergency call-out",
  "Barn calls",
  "Delivery",
  "Youth programs",
  "Clinics",
  "Board",
  "Lessons",
  "Hauling",
  "Repairs",
  "Special orders",
];

const REGIONS = ["Chico", "Butte County", "Durham", "Oroville", "Paradise"];

export default function ListingForm() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      category: data.get("category"),
      region: data.get("region"),
      city: data.get("city"),
      phone: data.get("phone"),
      email: data.get("email"),
      website: data.get("website"),
      contactName: data.get("contactName"),
      description: data.get("description"),
      services: data.getAll("services"),
    };

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrors(body.errors ?? {});
        setResult({ ok: false, message: body.error ?? "Submission failed." });
        return;
      }
      setResult({ ok: true, message: body.message });
      form.reset();
    } catch {
      setResult({
        ok: false,
        message: "We could not send that. Email info@chicoequestrianassociation.org instead.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 md:p-8">
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
              Business name *
            </label>
            <input id="name" name="name" className="field" required />
            {errors.name ? (
              <p className="mt-1 text-sm text-[#7d2f22]">{errors.name}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-semibold">
              Category *
            </label>
            <select id="category" name="category" className="field" required defaultValue="">
              <option value="" disabled>
                Choose a category…
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="mt-1 text-sm text-[#7d2f22]">{errors.category}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="region" className="mb-1.5 block text-sm font-semibold">
              Region served *
            </label>
            <select id="region" name="region" className="field" defaultValue="Butte County" required>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.region ? (
              <p className="mt-1 text-sm text-[#7d2f22]">{errors.region}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="city" className="mb-1.5 block text-sm font-semibold">
              Town *
            </label>
            <input id="city" name="city" className="field" required placeholder="Chico, CA" />
            {errors.city ? (
              <p className="mt-1 text-sm text-[#7d2f22]">{errors.city}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">
              Phone
            </label>
            <input id="phone" name="phone" className="field" inputMode="tel" />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
              Contact email *
            </label>
            <input id="email" name="email" type="email" className="field" required />
            {errors.email ? (
              <p className="mt-1 text-sm text-[#7d2f22]">{errors.email}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="website" className="mb-1.5 block text-sm font-semibold">
              Website or Facebook page
            </label>
            <input id="website" name="website" className="field" placeholder="https://" />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="contactName" className="mb-1.5 block text-sm font-semibold">
              Who should we contact? *
            </label>
            <input id="contactName" name="contactName" className="field" required />
            {errors.contactName ? (
              <p className="mt-1 text-sm text-[#7d2f22]">{errors.contactName}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-semibold">
            What you do, in a rider&apos;s words *
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="field"
            required
            minLength={30}
            placeholder="Tell riders what you do, where you travel, and how to reach you. Two or three sentences is right — 30 characters minimum."
          />
          {errors.description ? (
            <p className="mt-1 text-sm text-[#7d2f22]">{errors.description}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">
            Services (pick all that apply)
          </legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_SUGGESTIONS.map((service) => (
              <label
                key={service}
                className="flex cursor-pointer items-center gap-2 border border-saddle-200 bg-white px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  className="h-4 w-4 accent-forest-700"
                />
                {service}
              </label>
            ))}
          </div>
        </fieldset>

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

        <div className="flex flex-wrap items-center gap-4 border-t border-saddle-200 pt-6">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending…" : "Submit application"}
          </button>
          <p className="text-xs text-charcoal-500">
            Review usually takes a week. Business membership dues are invoiced
            after approval.
          </p>
        </div>
      </div>
    </form>
  );
}
