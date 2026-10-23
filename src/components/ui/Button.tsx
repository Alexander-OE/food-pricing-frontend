// The app's button, in four looks. It accepts every normal <button> prop.

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  small?: boolean;
}

const LOOKS: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:opacity-90",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-soft",
  danger: "bg-rise text-white hover:opacity-90",
  ghost: "text-muted hover:bg-surface-soft hover:text-ink",
};

export default function Button({ variant = "primary", small = false, className = "", ...props }: ButtonProps) {
  const size = small ? "px-3 py-1.5 text-sm" : "px-5 py-2.5 text-sm";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${size} ${LOOKS[variant]} ${className}`}
      {...props}
    />
  );
}
