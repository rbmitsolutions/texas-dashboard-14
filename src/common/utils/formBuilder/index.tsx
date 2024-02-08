import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IConditionalGroupRadiosForm, IConditionalInputForm, IConditionalSelectForm, IConditionalTextareaForm } from "./formBuilder.interface";
import { Input } from "@/components/ui/input";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type IFormBuildInput =
  | ({
    type: "select" | "input" | "radio_group" | "textarea" | "default";
  } & IConditionalGroupRadiosForm)
  | IConditionalInputForm
  | IConditionalTextareaForm
  | IConditionalSelectForm;

export function fieldBuilder(
  input: IFormBuildInput,
  form: UseFormReturn<FieldValues, any, undefined>,
): React.ReactNode {
  switch (input?.type) {
    case "input":
      return (
        <FormField
          key={input?.register}
          control={form.control}
          name={input?.register}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{input?.label}</FormLabel>
              <FormControl>
                <Input
                  placeholder={input?.label}
                  type={input?.propsUi?.type}
                  {...field}
                  value={field?.value || ''}
                />
              </FormControl>
              {input?.description &&
                <FormDescription>
                  {input?.description}
                </FormDescription>
              }
              <FormMessage />
            </FormItem>
          )}
        />
      )
    case "radio_group":
      return (
        <FormField
          control={form.control}
          name={input?.register}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{input?.label}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field?.onChange}
                  defaultValue={field?.value}
                  value={field?.value}
                  className="flex flex-col space-y-1"
                >
                  {input?.options?.map(opt => {
                    return (
                      <FormItem key={opt?.value} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={opt?.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {opt?.label}
                        </FormLabel>
                      </FormItem>
                    )
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "textarea":
      return (
        <FormField
          control={form.control}
          name={input?.register}
          render={({ field: f }) => (
            <FormItem>
              <FormLabel>{input?.label}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={input?.label}
                  className="resize-none h-60"
                  {...f}
                />
              </FormControl>
              {input?.description &&
                <FormDescription>
                  {input?.description}
                </FormDescription>
              }
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "select":
      return (
        <FormField
          control={form.control}
          name={input?.register}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{input?.label}</FormLabel>
              <Select
                onValueChange={field?.onChange}
                defaultValue={field?.value}
                value={field?.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={input?.label} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {input?.options?.map(opt => {
                    return (
                      <SelectItem key={opt?.label} value={opt?.value}>{opt?.label}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {input?.description &&
                <FormDescription>
                  {input?.description}
                </FormDescription>
              }
              <FormMessage />
            </FormItem>
          )}
        />
      );
    default:
      return
  }
}
