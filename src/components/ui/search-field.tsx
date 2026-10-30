import { Search, X } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
}

export function SearchField({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  autoFocus,
}: SearchFieldProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "group relative flex items-center rounded-control border border-border-subtle bg-surface transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20",
        className,
      )}
    >
      <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-ink-faint" />
      <input
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? t("common.search")}
        className={cn(
          "h-9 w-full bg-transparent pr-8 pl-8.5 text-[13px] outline-none placeholder:text-ink-faint",
          inputClassName,
        )}
      />
      {value ? (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 rounded-full p-1 text-ink-faint transition hover:bg-surface-sunken hover:text-ink"
          aria-label={t("common.clearSearch")}
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  );
}
