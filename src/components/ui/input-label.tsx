import { ChangeEvent, FocusEvent } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { Input } from "./input";
interface InputLabelProps {
  label: string;
  tooltipText?: string;
  value: string;
  require?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  id: string;
  placeholder: string;
  className?: string;
  type?: string; // Optional, defaults to 'text'
}
export const InputLabel = ({
  label,
  tooltipText,
  value,
  require,
  onChange,
  onFocus,
  onBlur,
  id,
  placeholder,
  className,
  type = "text", // Default to 'text' if not provided
}: InputLabelProps) => {
  return (
    <div className={className}>
      <label className="text-sm flex" htmlFor={id}>
        {label}{require && <span className="text-red-500">*</span>}
        {tooltipText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <CircleHelp className="ml-1 text-blue-500" size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </label>
      <Input
        className="w-full"
        type={type}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
};
