// src/components/ThemeSwitcher.tsx
import { useTheme } from "./ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Palette, Settings } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, darkMode, toggleDarkMode, changeTheme } = useTheme();

  const themes = [
    "Slate",
    "Red",
    "Rose",
    "Orange",
    "Green",
    "Blue",
    "Yellow",
    "Violet",
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Settings className="h-6 w-6" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 z-101" align="end">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>

        <DropdownMenuItem onClick={toggleDarkMode}>
          {darkMode ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Theme Color</DropdownMenuLabel>
        <div className="max-h-60 overflow-y-auto">
          {themes.map((t) => (
            <DropdownMenuItem
              key={t}
              onClick={() => changeTheme(t)}
              className={`py-1 px-2 ${
                theme === t
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              } flex items-center justify-between`}
            >
              <span className="flex">
                <Palette className="w-4 h-4 mr-3" />
                {t}
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center`}
              >
                {theme === t && <span className="text-xs">✓</span>}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;