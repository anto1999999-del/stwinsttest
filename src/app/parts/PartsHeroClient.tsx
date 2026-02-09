// /root/s-twins/s-twins-web/src/app/parts/PartsHeroClient.tsx
"use client";

import dynamic from "next/dynamic";

const Parts = dynamic(() => import("@/pages/Parts"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function PartsHeroClient() {
  return <Parts />;
}
