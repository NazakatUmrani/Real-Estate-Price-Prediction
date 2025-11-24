import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Types
interface Option {
  id: string;
  label: string;
}

interface CommandListContentProps {
  options: Option[];
  value: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  searchPlaceholder: string;
  setOpen: (open: boolean) => void;
  name: string;
  showSearch: boolean;
}

interface SearchableDropdownProps {
  htmlFor: string;
  options: Option[];
  value: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  showSearch?: boolean;
}

// Media query hook implementation
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    
    // Initial check
    setMatches(media.matches)
    
    // Modern event listener
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    media.addEventListener('change', listener)
    
    // Cleanup
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

const CommandListContent: React.FC<CommandListContentProps> = ({
  options,
  value,
  onChange,
  searchPlaceholder,
  setOpen,
  name,
  showSearch,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <Command shouldFilter={false}>
      {showSearch && <CommandInput 
        placeholder={searchPlaceholder}
        className="h-12"
        value={searchTerm}
        onValueChange={setSearchTerm}
      />}
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {filteredOptions.map((option) => (
            <CommandItem
              key={option.id}
              value={option.id}
              onSelect={() => {
                onChange({
                  target: {
                    name: name,
                    value: option.id
                  }
                })
                setOpen(false)
              }}
              className={cn(
                "flex items-center justify-between my-1",
                value === option.id ? "bg-primary text-primary-foreground" : ""
              )}
            >
              {option.label}
              <Check
                className={cn(
                  "h-4 w-4",
                  value === option.id ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  htmlFor,
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
  required = false,
  disabled = false,
  showSearch = true,
}) => {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const selectedOption = options.find((option) => option.id === value)

  if (isDesktop) {
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="inputLabel" htmlFor={htmlFor} >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={htmlFor}
              variant="outline"
              className={cn("w-full justify-between py-6", disabled && "opacity-50 cursor-not-allowed")}
              disabled={disabled}
            >
              <p className="truncate">{selectedOption ? selectedOption.label : placeholder}</p>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <CommandListContent
              options={options}
              value={value}
              onChange={onChange}
              searchPlaceholder={searchPlaceholder}
              setOpen={setOpen}
              name={htmlFor}
              showSearch={showSearch}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="inputLabel" htmlFor={htmlFor} >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            id={htmlFor}
            variant="outline"
            className={cn("w-full justify-between py-6", disabled && "opacity-50 cursor-not-allowed")}
            disabled={disabled}
          >
            <p className="truncate">{selectedOption ? selectedOption.label : placeholder}</p>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t mb-6">
            <CommandListContent
              options={options}
              value={value}
              onChange={onChange}
              searchPlaceholder={searchPlaceholder}
              setOpen={setOpen}
              name={htmlFor}
              showSearch={showSearch}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SearchableDropdown