import ErrorState from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const COPY: Record<number, { title: string; body: string }> = {
  401: {
    title: "You're signed out",
    body: "Your session has ended. Sign in again to pick up where you left off.",
  },
  403: {
    title: "This isn't yours to open",
    body: "You don't have access to this page. If you think that's wrong, check you're signed in with the right account.",
  },
  500: {
    title: "Something went wrong",
    body: "An unexpected error stopped this page from loading. Reloading usually fixes it; if it doesn't, try again in a few minutes.",
  },
};

/** react-router `errorElement`: thrown render errors and failed route loads. */
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const code = isRouteErrorResponse(error) ? error.status : 500;
  const { title, body } = COPY[code] ?? COPY[500];

  return (
    <ErrorState
      code={String(code)}
      title={title}
      body={body}
      action={
        // Also the escape hatch for a stale tab whose lazy chunk 404s after a deploy
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload
        </Button>
      }
    />
  );
}
