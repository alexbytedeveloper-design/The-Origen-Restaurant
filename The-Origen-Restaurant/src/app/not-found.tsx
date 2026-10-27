import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center text-center">
      <p aria-hidden className="font-display text-8xl leading-none text-gold/40">
        404
      </p>
      <h1 className="display-2 mt-4">Esta página no está en la carta.</h1>
      <p className="lead mt-3">This page is not on the menu.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/es" className="btn btn-primary">
          Ir al inicio
        </Link>
        <Link href="/en" className="btn btn-secondary">
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
