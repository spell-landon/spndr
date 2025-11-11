// app/components/Money.tsx
interface MoneyProps {
  value: number;
  className?: string;
  currency?: string; // default to USD
}

export default function Money({
  value,
  className = '',
  currency = 'USD',
}: MoneyProps) {
  return (
    <span className={className}>
      {value.toLocaleString(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
