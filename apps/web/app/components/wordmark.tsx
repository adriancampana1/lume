type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizeMap = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-7xl',
  xl: 'text-8xl',
} as const;

export function Wordmark({ size = 'md' }: Props) {
  return (
    <span
      className={`font-serif italic tracking-tight text-[var(--color-ink)] ${sizeMap[size]}`}
      style={{ fontFamily: 'var(--font-instrument-serif)' }}
    >
      Lume
    </span>
  );
}
