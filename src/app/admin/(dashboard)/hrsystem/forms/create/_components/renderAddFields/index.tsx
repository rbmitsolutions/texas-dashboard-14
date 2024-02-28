import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IFormBuildInput } from "@/common/utils/formBuilder";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddField from "./addField";

interface RenderAddFieldsProps {
    inputs: IFormBuildInput[][]
    addField: (field: IFormBuildInput) => void
    addNewPage: () => void
}

function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default function RenderAddFields({ inputs, addField, addNewPage }: RenderAddFieldsProps) {
    return (
        <div className='flex-col-container p-2 border-2 rounded-xl'>
            <h2>Actions</h2>
            <AddField
                addField={addField}
                field={{
                    label: 'Input' + Math.round(Math.random() * 10),
                    type: 'input',
                    register: generateRandomString(10),
                    description: '',
                    required: true,
                    title: 'Input' + Math.round(Math.random() * 10),
                    propsUi: {
                        type: 'text'
                    }
                }}
            >
                <Input
                    placeholder="input"
                    readOnly
                />
            </AddField>
            <AddField
                addField={addField}
                field={{
                    label: 'Select' + Math.round(Math.random() * 10),
                    type: 'select',
                    register: generateRandomString(10),
                    description: '',
                    title: 'Select' + Math.round(Math.random() * 10),
                    options: [{
                        isOptionGroup: false,
                        label: 'Select' + Math.round(Math.random() * 10),
                        options: [{
                            label: 'Option 1',
                            value: 'option1'
                        }, {
                            label: 'Option 2',
                            value: 'option2'
                        }]
                    }],
                    required: true,
                }}
            >
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='Select Optio'>Select Option</SelectItem>
                    </SelectContent>
                </Select>
            </AddField>

            <AddField
                addField={addField}
                field={{
                    label: 'Textarea' + Math.round(Math.random() * 10),
                    type: 'textarea',
                    register: generateRandomString(10),
                    description: '',
                    title: 'Textarea' + Math.round(Math.random() * 10),
                    required: true,
                }}
            >
                <Textarea className='resize-none h-8' placeholder="Textarea" />
            </AddField>

            <AddField
                addField={addField}
                field={{
                    label: 'Radio Group' + Math.round(Math.random() * 10),
                    type: 'radio_group',
                    register: generateRandomString(10),
                    description: '',
                    title: 'Radio Group' + Math.round(Math.random() * 10),
                    options: [{
                        label: 'Option 1',
                        value: 'option1'
                    }, {
                        label: 'Option 2',
                        value: 'option2'
                    }],
                    required: true,
                }}
            >
                <RadioGroup defaultValue="comfortable">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Option1" id="r2" />
                        <Label htmlFor="r2">Option 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Option2" id="r3" />
                        <Label htmlFor="r3">Option 2</Label>
                    </div>
                </RadioGroup>
            </AddField>

            <Button
                leftIcon="Plus"
                onClick={addNewPage}
                disabled={inputs?.length === 4}
                className='self-end'
            >
                Page
            </Button>
        </div>
    )
}