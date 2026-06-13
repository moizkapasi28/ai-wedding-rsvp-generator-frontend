import { DietaryBreakDownChart } from "./DietaryBreakDownChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function DietaryBreakDownCard() {
  return (
    <Card className="py-5">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Dietary breakdown</CardTitle>

          <CardDescription>How each function is filling up</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="">
        <DietaryBreakDownChart />
      </CardContent>

      <CardFooter className="bg-transparent border-none"></CardFooter>
    </Card>
  );
}
