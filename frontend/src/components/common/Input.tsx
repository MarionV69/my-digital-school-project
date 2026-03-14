import type { InputHTMLAttributes } from "react";

type InputProps = {
  label: string;
  type?: string;
  id?: string;
  name?: string;
  helperText?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function Input({
  label,
  type = "text",
  id,
  helperText,
  error,
  ...props
}: InputProps) {
  // Generate ID if not provided
  const inputId = id || `input-${label.toLowerCase().replace(/\s/g, "-")}`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={`input ${error && "border-red-600"}`}
        type={type}
        {...props}
      />
      {helperText && !error && (
        <small id={`${inputId}-helper`} className="helper-text">
          {helperText}
        </small>
      )}
      {error && <small className="text-red-600">{error}</small>}
    </div>
  );
}
export default Input;
