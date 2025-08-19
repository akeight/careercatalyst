import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faMoon } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? (
        <FontAwesomeIcon icon={faSun} size="xl" />
      ) : (
        <FontAwesomeIcon icon={faMoon} size="xl" />
      )}
    </button>
  );
}
