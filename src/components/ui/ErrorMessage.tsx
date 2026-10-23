// A friendly error box with a "Try again" button.
import Button from "./Button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="rounded-2xl border border-rise/30 bg-rise/5 p-6 text-center">
      <p className="font-display text-lg font-semibold text-rise">We could not load this</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" small className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
