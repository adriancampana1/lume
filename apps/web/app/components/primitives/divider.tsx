type Props = { className?: string; tone?: 'default' | 'strong' };

export function Divider({ className = '', tone = 'default' }: Props) {
  const color = tone === 'strong' ? 'bg-[var(--color-border-strong)]' : 'bg-[var(--color-border)]';
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`h-px w-full ${color} ${className}`}
    />
  );
}
