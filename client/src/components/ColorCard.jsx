import { useState } from 'react';

export default function ColorCard({ color }) {
  const [copied, setCopied] = useState('');

  const copy = (value, label) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-800">
      <div className="h-24 w-full" style={{ backgroundColor: color.hex }} />
      <div className="p-3 space-y-1.5 text-xs">
        {[
          { label: 'HEX', value: color.hex },
          { label: 'RGB', value: color.rgb },
          { label: 'HSL', value: color.hsl },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => copy(value, label)}
            className="w-full flex justify-between items-center px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="text-gray-400 font-mono">{label}</span>
            <span className="text-white font-mono truncate ml-2">
              {copied === label ? '✅ Copied!' : value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
