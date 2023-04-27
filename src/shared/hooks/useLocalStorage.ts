import { useState, useEffect } from 'react'

type LocalStorageHook<T> = {
  value: T | null
  setValue: (value: T | null) => void
  hasValue: () => boolean
}

export const useLocalStorage = <T>(
  key: string,
  defaultValue?: T
): LocalStorageHook<T> => {
  const [state, setState] = useState<{ value: T | null }>({
    value: defaultValue ?? null,
  })

  useEffect(() => {
    const storageValue = localStorage.getItem(key)

    storageValue
      ? setState({ value: JSON.parse(storageValue) })
      : setState({ value: defaultValue ?? null })
  }, [key, defaultValue])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state.value))
  }, [key, state.value])

  return {
    value: state.value,
    setValue: (value) => setState({ value }),
    hasValue: () => state.value !== null,
  }
}
