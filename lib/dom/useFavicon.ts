import { useEffect, useState } from 'react'
import { updateElementAttributes } from './updateElementAttributes'

type Params = {
  alternateIcon?: {
    defaultImage?: string
    darkImage?: string
  }
  maskIcon?: {
    image?: string
    color?: string
  }
  icon?: {
    defaultImage?: string
    darkImage?: string
  }
}

/**
 * Hook for updating favicon meta tags in the document head when dark mode is
 * toggled.
 *
 * @param params See {@link Params}.
 */
export function useFavicon({
  alternateIcon,
  icon,
  maskIcon,
}: Params) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const matchMedia = typeof window.matchMedia !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : undefined
  const [isDarkMode, setIsDarkMode] = useState<boolean>(matchMedia?.matches === true)

  const colorSchemeChangeHandler = (event: MediaQueryListEvent) => setIsDarkMode(event.matches)

  useEffect(() => {
    matchMedia?.addEventListener('change', colorSchemeChangeHandler)

    return () => {
      matchMedia?.removeEventListener('change', colorSchemeChangeHandler)
    }
  }, [])

  useEffect(() => updateElementAttributes('link', [{
    name: 'rel',
    value: 'mask-icon',
    key: true,
  },
  {
    name: 'type',
    value: 'image/svg+xml',
    key: true,
  },
  ...maskIcon?.image ? [{
    name: 'href',
    value: maskIcon.image,
  }] : [],
  ...maskIcon?.color ? [{
    name: 'color',
    value: maskIcon.color,
  }] : []], {
    parent: document.head,
    autoCreate: !!maskIcon?.image,
  }), [maskIcon])

  useEffect(() => updateElementAttributes('link', [{
    name: 'rel',
    value: 'icon',
    key: true,
  },
  {
    name: 'type',
    value: 'image/x-icon',
    key: true,
  },
  ...!isDarkMode && icon?.defaultImage ? [{
    name: 'href',
    value: icon.defaultImage,
  }] : [],
  ...isDarkMode && icon?.darkImage ? [{
    name: 'href',
    value: icon.darkImage,
  }] : []], {
    parent: document.head,
    autoCreate: !!icon?.defaultImage,
  }), [isDarkMode, icon])

  useEffect(() => updateElementAttributes('link', [{
    name: 'rel',
    value: 'alternate icon',
    key: true,
  },
  {
    name: 'type',
    value: 'image/png',
    key: true,
  },
  ...!isDarkMode && alternateIcon?.defaultImage ? [{
    name: 'href',
    value: alternateIcon.defaultImage,
  }] : [],
  ...isDarkMode && alternateIcon?.darkImage ? [{
    name: 'href',
    value: alternateIcon.darkImage,
  }] : []], {
    parent: document.head,
    autoCreate: !!alternateIcon?.defaultImage,
  }), [isDarkMode, alternateIcon])
}
