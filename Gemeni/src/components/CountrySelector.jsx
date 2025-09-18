import React from 'react';

export default function CountrySelector({ countries, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded p-2 
      bg=white text black
      dark:bg-gray-800 dark:text-white dark:border-gray-600"
      
      aria-label="Country calling code"
    >
      {countries.length === 0 && <option>Loading...</option>}
      {countries.map((c) => {
        const root = c.idd?.root || '+1';
        const suffix = (c.idd?.suffixes && c.idd.suffixes[0]) || '';
        const call = `${root}${suffix}`;
        return (
          <option key={c.cca2 || c.name.common} value={call}>
            {c.name?.common} ({call})
          </option>
        );
      })}
    </select>
  );
}