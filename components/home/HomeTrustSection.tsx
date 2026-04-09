"use client";

type Props = {
  language: "ar" | "de" | "en";
};

export default function HomeTrustSection({ language }: Props) {
  return (
    <section
      aria-hidden="true"
      style={{
        display: "none",
      }}
    />
  );
}