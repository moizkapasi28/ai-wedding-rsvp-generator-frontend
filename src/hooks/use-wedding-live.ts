import { parseSseChunk } from "@/lib/sse";
import { tokenStore } from "@/store/token";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type LiveStatus = "connecting" | "live" | "reconnecting";

const MAX_RETRY_DELAY = 30_000;

export const useWeddingLive = (weddingId: string | null): LiveStatus => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<LiveStatus>("connecting");

  useEffect(() => {
    if (!weddingId) return;

    const controller = new AbortController();
    const refreshDashboard = () =>
      queryClient.invalidateQueries({
        queryKey: ["wedding-dashboard", weddingId],
      });

    const connect = async () => {
      let delay = 1000;

      while (!controller.signal.aborted) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_APP_URL}/wedding/${weddingId}/live`,
            {
              headers: { Authorization: `Bearer ${tokenStore.getAccessToken()}` },
              signal: controller.signal,
            },
          );

          if (!response.ok || !response.body) {
            throw new Error(`Live stream failed with ${response.status}`);
          }

          setStatus("live");
          delay = 1000;
          // Catch up on anything missed before (re)connecting
          refreshDashboard();

          const reader = response.body
            .pipeThrough(new TextDecoderStream())
            .getReader();
          let buffer = "";

          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;

            const { events, rest } = parseSseChunk(buffer + value);
            buffer = rest;
            if (events.some((message) => message.event === "rsvp")) {
              refreshDashboard();
            }
          }
        } catch {
          if (controller.signal.aborted) return;
        }

        setStatus("reconnecting");
        // Goes through api.service, which refreshes an expired access token (e.g. after a 401) before the retry
        refreshDashboard();
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, MAX_RETRY_DELAY);
      }
    };

    connect();

    return () => controller.abort();
  }, [weddingId, queryClient]);

  return status;
};
