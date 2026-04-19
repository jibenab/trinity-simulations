import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number) {
  return `${minutes} min`;
}

export function formatList(values: string[]) {
  return values.join(" · ");
}

export function titleToSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseConcepts(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
