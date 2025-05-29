interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "password";
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export function FormInput({
  id,
  name,
  label,
  type,
  value,
  onChange,
  required = false,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-darkblue focus:border-darkblue"
        required={required}
      />
    </div>
  );
}
