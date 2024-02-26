export interface IConditionalGroupRadiosForm {
    title?: string;
    type: "radio_group";
    label: string;
    register: string;
    required: boolean;
    description?: string;
    options: {
        label: string;
        value: string;
    }[];
}

export interface IConditionalSelectForm {
    title?: string;
    type: "select";
    label: string;
    register: string;
    required: boolean;
    description?: string;
    options: { value: string; label: string }[];
}

export interface IConditionalTextareaForm {
    title?: string;
    type: "textarea";
    label: string;
    register: string;
    required: boolean;
    description?: string;
}

export interface IConditionalInputForm {
    title?: string;
    type: "input";
    label: string;
    register: string;
    required: boolean;
    description?: string;
    propsUi?: React.InputHTMLAttributes<HTMLInputElement>
}
