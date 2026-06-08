"use client";

import { Label, TextField, InputGroup, FieldError, Select, ListBox, Description } from "@heroui/react";

interface BaseFieldProps {
  label: string;
  error?: string;
  isRequired?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type: "text" | "date" | "time" | "datetime-local";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

type FormFieldProps = InputFieldProps | SelectFieldProps;

export function FormField(props: FormFieldProps) {
  const { label, error, isRequired, type } = props;

  if (type === "select") {
    const { value, onChange, options, placeholder } = props as SelectFieldProps;
    return (
      <Select
        value={value || null}
        onChange={(key) => onChange(key?.toString() ?? "")}
        isRequired={isRequired}
        isInvalid={Boolean(error)}
        placeholder={placeholder ?? `Select ${label.toLowerCase()}`}
      >
        <Label className="text-sm font-medium text-[--foreground]">
          {label}
          {isRequired && <span className="text-[--danger] ml-0.5">*</span>}
        </Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        {error && <Description className="text-xs text-[--danger]">{error}</Description>}
        <Select.Popover>
          <ListBox>
            {options.map((opt) => (
              <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                {opt.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    );
  }

  const { value, onChange, placeholder, min } = props as InputFieldProps;
  return (
    <TextField
      value={value}
      onChange={onChange}
      isRequired={isRequired}
      isInvalid={Boolean(error)}
      className="flex flex-col gap-1"
    >
      <Label className="text-sm font-medium text-[--foreground]">{label}</Label>
      <InputGroup>
        <InputGroup.Input
          type={type}
          placeholder={placeholder}
          min={min}
          className="w-full"
        />
      </InputGroup>
      {error && <FieldError className="text-xs text-[--danger]">{error}</FieldError>}
    </TextField>
  );
}
