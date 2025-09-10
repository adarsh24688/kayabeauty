interface FormRowProps {
  label: string;
  children: React.ReactNode;
}

export default function FormRow({ label, children }: FormRowProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
