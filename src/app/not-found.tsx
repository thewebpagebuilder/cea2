import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-cea py-24">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 font-serif text-4xl text-forest-800 md:text-5xl">
          This trail doesn&apos;t go anywhere
        </h1>
        <p className="mt-5 text-charcoal-700">
          The page you were looking for is not here. It may have been moved, or
          the link may have been typed by someone wearing gloves.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Back to the homepage
          </Link>
          <Link href="/trails" className="btn btn-secondary">
            Explore the trail guide
          </Link>
          <Link href="/directory" className="btn btn-secondary">
            Search the directory
          </Link>
        </div>
        <p className="mt-10 text-sm text-charcoal-500">
          Looking for trail status? Call{" "}
          <a href="tel:+15308967899" className="font-semibold underline">
            530-896-7899
          </a>
          .
        </p>
      </div>
    </section>
  );
}
