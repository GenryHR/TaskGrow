import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  try {
    return twMerge(clsx(inputs))
  } catch (error) {
    console.error("Error in cn function:", error)
    // Fallback to simple class concatenation
    return inputs
      .filter(Boolean)
      .map(input => {
        if (typeof input === "string") return input
        if (typeof input === "object" && input !== null) {
          return Object.entries(input)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(" ")
        }
        return ""
      })
      .join(" ")
      .trim()
  }
}
