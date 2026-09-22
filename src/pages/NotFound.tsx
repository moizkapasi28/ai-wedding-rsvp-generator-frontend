import ErrorState from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <ErrorState
      code="404"
      title="This page doesn't exist"
      body="The link may be mistyped, or the page may have moved. Nothing is broken — you're just somewhere that isn't there."
      action={
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      }
    />
  );
}
