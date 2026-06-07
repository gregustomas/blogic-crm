export function PageError({ message }: { message: string }) {
  return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
