"use client";

import { useTabletAndBelowMediaQuery } from "@/shared/lib/media";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export const ToastProvider = () => {
  const isTabletAndBelow = useTabletAndBelowMediaQuery();

  // Prevent mounting multiple Sonner Toaster instances when the app
  // renders providers from both the /app and /pages routers.
  // We use a global flag on window to ensure only one Toaster is shown.
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // extend Window with a private flag
    type Win = Window & { __sonner_toaster_mounted?: boolean };
    const w = window as Win;

    // If another ToastProvider has already mounted the Toaster, skip rendering.
    if (w.__sonner_toaster_mounted) {
      setShouldRender(false);
      return;
    }

    w.__sonner_toaster_mounted = true;
    setShouldRender(true);

    // no cleanup: keep the flag to avoid double-mounts during HMR/dev reloads
  }, []);

  return (
    <>
      {shouldRender && (
        <Toaster
          position={isTabletAndBelow ? "top-center" : "bottom-right"}
          richColors
          closeButton
          duration={5000}
          theme={"light"}
          className="text-balance"
        />
      )}
    </>
  );
};
