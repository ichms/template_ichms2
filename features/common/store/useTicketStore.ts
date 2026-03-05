import { create } from 'zustand'

type TicketStoreState = {
  tokenId: string | null
  setTokenId: (tokenId: string | null) => void
}

export const useTicketStore = create<TicketStoreState>((set) => {
  return {
    tokenId: null,
    setTokenId: (tokenId) => {
      set({ tokenId })
    },
  }
})
