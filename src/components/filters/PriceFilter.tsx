import { useState, useEffect } from 'react';
import { formatINR } from '../../utils/currency';

interface PriceFilterProps {
  min: number;
  max: number;
  maxLimit: number;
  onchange: (min: number, max: number) => void;
}

export function PriceFilter({ min, max, maxLimit, onchange }: PriceFilterProps) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max || maxLimit);

  useEffect(() => {
    setLocalMin(min);
    setLocalMax(max || maxLimit);
  }, [min, max, maxLimit]);

  const handleMin = (v: number) => {
    const clamped = Math.min(v, localMax - 1);
    setLocalMin(clamped);
    onchange(clamped, localMax);
  };

  const handleMax = (v: number) => {
    const clamped = Math.max(v, localMin + 1);
    setLocalMax(clamped);
    onchange(localMin, clamped);
  };

  // Convert USD limits to display in INR
  const minINR = formatINR(localMin);
  const maxINR = localMax >= maxLimit ? `${formatINR(localMax)}+` : formatINR(localMax);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '0 1 230px', minWidth: 170 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
          PRICE (INR)
        </span>
        <span style={{ fontSize: 11.5, color: 'var(--accent-2)', fontWeight: 700 }}>
          {minINR} – {maxINR}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="range"
          min={0}
          max={maxLimit}
          value={localMin}
          onChange={(e) => handleMin(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer', height: 4 }}
        />
        <input
          type="range"
          min={0}
          max={maxLimit}
          value={localMax}
          onChange={(e) => handleMax(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer', height: 4 }}
        />
      </div>
    </div>
  );
}
