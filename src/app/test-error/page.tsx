"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasErrored = localStorage.getItem("hasErrored");

    if (!hasErrored) {
      localStorage.setItem("hasErrored", "true");
      throw new Error("Lỗi lần đầu để test reset()");
    } else {
      setReady(true); // để tránh lỗi hydration mismatch
    }
  }, []);

  if (!ready) return null;

  return <div className="p-8 text-green-700">✅ Đã render thành công sau khi reset!</div>;
}
