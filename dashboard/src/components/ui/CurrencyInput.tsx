import { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder, className = '', disabled = false }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    // Initialize display value from numeric value
    if (value > 0) {
      const formatted = formatCurrency(value);
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const formatCurrency = (num: number): string => {
    // Convert number to string with 2 decimal places
    const numStr = num.toFixed(2);
    // Split into integer and decimal parts
    const [intPart, decPart] = numStr.split('.');
    // Add thousand separators
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Return formatted string
    return `${formattedInt},${decPart}`;
  };

  const parseCurrency = (str: string): number => {
    // Remove all non-digit characters except comma
    const cleaned = str.replace(/[^\d,]/g, '');
    // Replace comma with dot for parsing
    const normalized = cleaned.replace(',', '.');
    // Parse to float
    const num = parseFloat(normalized) || 0;
    return num;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // If empty, set to empty string
    if (inputValue === '' || inputValue === '0' || inputValue === '0,00') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Parse the input
    const numValue = parseCurrency(inputValue);
    
    // If parsed value is 0, clear the display
    if (numValue === 0) {
      setDisplayValue('');
      onChange(0);
      return;
    }
    
    // Format for display
    const formatted = formatCurrency(numValue);
    setDisplayValue(formatted);
    
    // Call onChange with numeric value
    onChange(numValue);
  };

  const handleBlur = () => {
    // Ensure display is properly formatted on blur
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    } else {
      setDisplayValue('');
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder || '0,00'}
      className={className}
      disabled={disabled}
      inputMode="decimal"
    />
  );
}
