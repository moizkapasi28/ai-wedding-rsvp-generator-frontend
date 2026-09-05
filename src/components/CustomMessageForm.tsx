import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { AiInviteFormValues } from "@/validations/aiInviteCard.validation";
import { useFormContext } from "react-hook-form";


export default function CustomMessageForm() {
  const form = useFormContext<AiInviteFormValues>();

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Custom Invitation Message (Optional)</CardTitle>
        <CardDescription>
          Add a personalized message, quote, or cultural greeting to include on your invitation card.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="customMessage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder="E.g., We joyfully invite you to share in our happiness..."
                  className="min-h-[100px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
