"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoadingContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams({
      letterboxd_username: searchParams.get("letterboxd") ?? "",
      scorasong_username:  searchParams.get("scorasong")  ?? "",
      backloggd_username:  searchParams.get("backloggd")  ?? "",
      goodreads_username:  searchParams.get("goodreads")  ?? "",
    });

    fetch(`https://personaflavors-production.up.railway.app/user/data?${params.toString()}`)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return <div>Loading...</div>;
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingContent />
    </Suspense>
  );
}