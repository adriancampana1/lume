type Props = { size?: 'sm' | 'md' };

export function Wordmark({ size = 'md' }: Props) {
  const fontSize = size === 'sm' ? 18 : 26;
  return (
    <span
      className="wordmark"
      style={{ fontSize: `${fontSize}pt`, color: 'var(--ink)' }}
    >
      Lume
    </span>
  );
}
