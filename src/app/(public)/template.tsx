// A template remounts on every navigation, which gives each page a gentle fade-in.

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
