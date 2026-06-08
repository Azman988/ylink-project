import { useContext } from 'react'
import { CartContext } from './Context'

export function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error('useCart must be used within a CartRenderer')
    }

    return context
}