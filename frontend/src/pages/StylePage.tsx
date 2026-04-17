
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

function StylePage() {
  return (
      <div className="p-8 flex flex-col gap-4">
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 2</h3>
        <p>Body 1</p>
        <p className="text-muted-foreground">Body 2</p>

        <div className="flex flex-row gap-4">
            <Button>Primary button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive button</Button>
            <Button variant="ghost">Ghost button</Button>
        </div>
        
        <Field>
            <FieldLabel htmlFor="exemple">
                Label
            </FieldLabel>
            <Input id="exemple" placeholder="Placeholder"/>
            <FieldDescription>
                Description for the input.
            </FieldDescription>
        </Field>

        <NativeSelect>
            <NativeSelectOption value="">Select a fruit</NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
            <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
            <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
        </NativeSelect>

        <Textarea placeholder="Placeholder"/>

        <Card>
            <CardHeader>
                <CardTitle>Title of the card</CardTitle>
                <CardDescription>Description of the card</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
        <Badge>Badge test</Badge>
        <Switch></Switch>
        <Checkbox></Checkbox>
      </div>
  );
}

export default StylePage;
