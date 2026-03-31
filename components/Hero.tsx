import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Caro Bara Smart Print
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Erhalte dein Angebot in wenigen Sekunden
        </p>

        <Link
          href="/request"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
        >
          Jetzt Angebot erstellen
        </Link>
      </div>
    </section>
  );
}