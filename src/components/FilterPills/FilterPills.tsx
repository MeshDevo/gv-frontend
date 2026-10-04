interface FilterPillsProps<Value extends string> {
  options: { label: string; value: Value | "" }[];
  selectedValue: Value | "";
  onSelect: (value: Value | "") => void;
}

export function FilterPills<Value extends string>({ options, selectedValue, onSelect }: FilterPillsProps<Value>) {
  return (
    <div className="filter-pills">
      {options.map((option) => (
        <button key={option.value} className="filter-pill" aria-pressed={option.value === selectedValue}
          onClick={() => onSelect(option.value)}>{option.label}</button>
      ))}
    </div>
  );
}
