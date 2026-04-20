import { usePreferredDark } from '@vueuse/core'

export function useThemePreference() {
  const themeCookie = useCookie<'light' | 'dark' | null>('theme', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null,
  })

  if (import.meta.client) {
    const prefersDark = usePreferredDark()
    watchEffect(() => {
      if (themeCookie.value === null) {
        themeCookie.value = prefersDark.value ? 'dark' : 'light'
      }
    })
  }

  const currentTheme = computed(() => themeCookie.value ?? 'light')
  const isDark = computed(() => currentTheme.value === 'dark')

  useHead({
    htmlAttrs: {
      class: computed(() => isDark.value ? 'dark' : ''),
    },
  })

  function toggleTheme() {
    themeCookie.value = isDark.value ? 'light' : 'dark'
  }

  return { currentTheme, isDark, toggleTheme }
}
