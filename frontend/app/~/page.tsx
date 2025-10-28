"use client";

import { Spinner } from "@/components/ui/spinner";
import { getUser } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Root() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    username: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const user = await getUser();
      setUser(user.data);
      setLoading(false);
    })();
  }, []);

  function greeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

  return (
    <div>
      {loading ? (
        <Spinner className="size-6 text-center" />
      ) : (
        <h2 className="text-3xl font-semibold">
          {greeting()}, {user?.name}
        </h2>
      )}
    </div>
  );
}
