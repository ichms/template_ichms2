import { atom, useAtomValue, useSetAtom } from 'jotai'

const tokenIdAtom = atom<string | null>(null)

export const useTokenIdValue = () => {
  return useAtomValue(tokenIdAtom)
}

export const useSetTokenId = () => {
  return useSetAtom(tokenIdAtom)
}
