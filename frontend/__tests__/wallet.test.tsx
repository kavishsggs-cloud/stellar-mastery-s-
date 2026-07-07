import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useWalletStore } from '../src/store/walletStore'

describe('Wallet Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { disconnect } = useWalletStore.getState()
    act(() => {
      disconnect()
    })
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWalletStore())
    
    expect(result.current.address).toBeNull()
    expect(result.current.isConnected).toBe(false)
    expect(result.current.balance).toBe('0')
    expect(result.current.network).toBe('Test SDF Network ; September 2015')
  })

  it('should set wallet address correctly', () => {
    const { result } = renderHook(() => useWalletStore())
    
    act(() => {
      result.current.setAddress('GBX7...')
      result.current.setIsConnected(true)
    })
    
    expect(result.current.address).toBe('GBX7...')
    expect(result.current.isConnected).toBe(true)
  })

  it('should disconnect and reset state', () => {
    const { result } = renderHook(() => useWalletStore())
    
    act(() => {
      result.current.setAddress('GBX7...')
      result.current.setBalance('100')
      result.current.setIsConnected(true)
    })
    
    expect(result.current.isConnected).toBe(true)
    
    act(() => {
      result.current.disconnect()
    })
    
    expect(result.current.address).toBeNull()
    expect(result.current.balance).toBe('0')
    expect(result.current.isConnected).toBe(false)
  })
})
