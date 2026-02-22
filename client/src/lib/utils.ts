// =============================================================================
// UTILITY FUNCTIONS (client/src/lib/utils.ts)
// =============================================================================

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// cn() — merges Tailwind CSS class names intelligently.
// Combines clsx (conditional classes) with tailwind-merge (deduplicates conflicting classes).
// Usage: cn("px-4 py-2", isActive && "bg-primary", className)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
