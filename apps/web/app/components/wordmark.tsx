type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  as?: 'span' | 'h1' | 'div';
  className?: string;
};

const sizeMap = {
  sm: { font: '1.125rem', dotW: 7, dotH: 3, dotRight: -10, dotBottom: 4 },
  md: { font: '1.375rem', dotW: 9, dotH: 4, dotRight: -12, dotBottom: 6 },
  lg: { font: '2rem', dotW: 12, dotH: 5, dotRight: -16, dotBottom: 8 },
  xl: { font: 'clamp(2.5rem, 9vw, 3.5rem)', dotW: 16, dotH: 6, dotRight: -22, dotBottom: 10 },
} as const;

export function Wordmark({ size = 'md', as: Tag = 'span', className = '' }: Props) {
  const cfg = sizeMap[size];
  return (
    <Tag
      aria-label="Lume"
      className={`relative inline-flex items-baseline font-semibold text-[var(--color-ink)] ${className}`}
      style={{
        fontSize: cfg.font,
        letterSpacing: '-0.04em',
        lineHeight: 1,
      }}
    >
      <span aria-hidden="true">lume</span>
      <span
        aria-hidden="true"
        className="lume-blink absolute rounded-[2px] bg-[var(--color-accent)]"
        style={{
          width: cfg.dotW,
          height: cfg.dotH,
          right: cfg.dotRight,
          bottom: cfg.dotBottom,
        }}
      />
    </Tag>
  );
}
