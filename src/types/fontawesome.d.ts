import type { IconLookup, IconName } from "@awesome.me/kit-3cb9aa7d8b/icons";
import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

declare module "@fortawesome/fontawesome-svg-core" {
  export function icon(icon: IconName | IconLookup, params?: unknown): unknown;
  export function findIconDefinition(iconLookup: IconLookup): IconDefinition;
}

declare module "@fortawesome/react-fontawesome" {
  interface FontAwesomeIconProps {
    icon: IconDefinition | IconLookup | IconName | unknown;
  }
}
