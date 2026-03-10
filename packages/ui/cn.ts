import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customFontScales = ['displayXL', 'displaySm', 'headlineXL', 'headlineLg', 'headlineMd', 'headlineSm', 'titleLg', 'titleMd', 'titleSm', 'bodyLg', 'bodyMd', 'bodySm', 'captionLg', 'captionMd']
const customFontWeights = ['B', 'SB', 'M', 'R']

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            (value: string) => {
              const lastDash = value.lastIndexOf('-')
              if (lastDash === -1) return false
              const scale = value.slice(0, lastDash)
              const weight = value.slice(lastDash + 1)
              return customFontScales.includes(scale) && customFontWeights.includes(weight)
            },
          ],
        },
      ],
    },
  },
});

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
