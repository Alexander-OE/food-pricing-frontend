// A template remounts on every navigation, which gives each admin page a gentle fade-in.

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
