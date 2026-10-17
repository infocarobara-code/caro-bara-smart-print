import type { Metadata } from "next";
import Header from "@/components/Header";
import SignStudio from "@/components/sign-studio/SignStudio";

export const metadata: Metadata = {
  title: { absolute: "Schild-Studio: dein Schild gestalten | Caro Bara Berlin" },
  description: "Gestalte einen unverbindlichen Schildentwurf: Maße, Farben, Beschriftung und Lichtwirkung vergleichen, Vorschau speichern und eine Anfrage vorbereiten.",
  alternates: { canonical: "/sign-studio" },
};
export default function SignStudioPage() {
  return <div style={{ background: "#f6f8f9", minHeight: "100vh" }}><Header /><SignStudio /></div>;
}
