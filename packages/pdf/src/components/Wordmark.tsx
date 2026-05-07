import React from 'react';

type Props = { size?: 'sm' | 'md' | 'lg' };

const SIZES: Record<NonNullable<Props['size']>, number> = {
  sm: 13,
  md: 18,
  lg: 26,
};

export function Wordmark({ size = 'md' }: Props) {
  const fontSize = SIZES[size];
  return (
    <span className="wordmark" style={{ fontSize: `${fontSize}pt` }}>
      lume
      <span className="pulse" aria-hidden="true" />
    </span>
  );
}
