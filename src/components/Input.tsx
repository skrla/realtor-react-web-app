import React from "react";

type InputPropsType = {
  id: string;
  name?: string;
  value?: string | number;
  type?: string;
  onChange?: (e: any) => void;
  className?: string;
  onKeyDown?: (e: any) => void;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  min?: number;
  max?: number;
};

function Input({
  type = "text",
  name,
  id,
  value,
  onChange,
  className,
  onKeyDown,
  disabled,
  maxLength,
  minLength,
  required,
  min,
  max,
}: InputPropsType) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      maxLength={maxLength}
      minLength={minLength}
      required
      min={min}
      max={max}
      placeholder={`Enter ${name}`}
      className={`w-full px-4 py-2 text-xl text-gray-700 border-gray-300 rounded transition ease-in-out ${className}`}
    />
  );
}

export default Input;
