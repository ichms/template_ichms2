import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 * 
 * @description
 * - clsx: 조건부 클래스를 처리
 * - twMerge: Tailwind 클래스 충돌을 해결
 * 
 * @example
 * ```tsx
 * cn("px-4 py-2", "px-6") // "py-2 px-6"
 * cn("text-red-500", condition && "text-blue-500") // 조건부 클래스
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
