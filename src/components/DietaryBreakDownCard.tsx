import {
  DietaryBreakDownChart,
  type BreakdownItem,
} from "./DietaryBreakDownChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Props = {
  title: string;
  description: string;
  data: BreakdownItem[];
};

export default function DietaryBreakDownCard({
  title,
  description,
  data,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <p className="flex h-[215px] items-center justify-center text-sm text-muted-foreground">
            Nothing to show yet
          </p>
        ) : (
          <DietaryBreakDownChart data={data} />
        )}
      </CardContent>
    </Card>
  );
}
