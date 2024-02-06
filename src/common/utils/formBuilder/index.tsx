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
  field: IFormBuildInput,
  form: UseFormReturn<FieldValues, any, undefined>,
): React.ReactNode {
  switch (field?.type) {
    case "input":
      return (
        <FormField
          control={form.control}
          name={field?.register}
          render={({ field: f }) => (
            <FormItem>
              <FormLabel>{field?.label}</FormLabel>
              <FormControl>
                <Input placeholder={field?.label} {...field?.propsUi} {...f} />
              </FormControl>
              {field?.description &&
                <FormDescription>
                  {field?.description}
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
          name={field?.register}
          render={({ field: f }) => (
            <FormItem className="space-y-3">
              <FormLabel>{field?.label}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={f.onChange}
                  defaultValue={f.value}
                  value={f.value}
                  className="flex flex-col space-y-1"
                >
                  {field?.options?.map(opt => {
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
          name={field?.register}
          render={({ field: f }) => (
            <FormItem>
              <FormLabel>{field?.label}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={field?.label}
                  className="resize-none h-60"
                  {...f}
                />
              </FormControl>
              {field?.description &&
                <FormDescription>
                  {field?.description}
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
          name={field?.register}
          render={({ field: f }) => (
            <FormItem>
              <FormLabel>{field?.label}</FormLabel>
              <Select
                onValueChange={f.onChange}
                defaultValue={f.value}
                value={f.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={field?.label} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field?.options?.map(opt => {
                    return (
                      <SelectItem key={opt?.label} value={opt?.value}>{opt?.label}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {field?.description &&
                <FormDescription>
                  {field?.description}
                </FormDescription>
              }
              <FormMessage />
            </FormItem>
          )}
        />

        // <FormField
        //   control={form.control}
        //   name={field?.register}
        //   render={({ field: f }) => (
        //     <FormItem>
        //       <FormLabel>{field?.label}</FormLabel>
        //       <FormControl>
        //         <Input placeholder="shadcn" {...f} />
        //       </FormControl>
        //       {field?.description &&
        //         <FormDescription>
        //           {field?.description}
        //         </FormDescription>
        //       }
        //       <FormMessage />
        //     </FormItem>
        //   )}
        // />
      );
    default:
      return
  }
}
