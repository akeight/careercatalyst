"use client";

import Header from "./Header";

export default function ClientHeader({ authed = false }: { authed?: boolean }) {
  return <Header authed={authed} />;
}
