import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface SelectOption {
    value: string;
    label: string;
    description?: string;
}

// --- Custom Select Component for a Modern UI ---
interface CustomSelectDropdownProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

const CustomSelectDropdown: React.FC<CustomSelectDropdownProps> = ({ options, value, onChange, placeholder, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-blue-500 bg-white ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {icon && <span className="text-slate-400">{icon}</span>}
                    <span className={`truncate font-medium ${!selectedOption ? 'text-slate-400' : 'text-slate-700'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden animate-fade-in">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-3 cursor-pointer transition-colors flex flex-col gap-0.5 ${value === option.value ? 'bg-blue-50' : 'hover:bg-slate-50'
                                    }`}
                            >
                                <span className={`text-sm font-bold ${value === option.value ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {option.label}
                                </span>
                                {option.description && (
                                    <span className="text-xs text-slate-500">
                                        {option.description}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelectDropdown;