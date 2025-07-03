"use client";
import { useEffect, useState } from "react";

export function HouseSubmittedModal() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("showHouseSubmitted") === "1") setShow(true);
    }
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 max-w-md">
        <div className="text-2xl font-bold text-primary mb-2">Thank you for submitting your home!</div>
        <div className="text-muted-foreground text-center">
          It will take up to 24 hours to review the information. You can check the status in your settings.
        </div>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          onClick={() => setShow(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
