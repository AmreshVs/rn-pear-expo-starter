import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Directory, Paths } from 'expo-file-system'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import 'react-native-reanimated'

import { ErrorScreen } from '@/components/ErrorScreen'
import { useColorScheme } from '@/components/useColorScheme'
import { startWorklet } from '@/utils/worklet'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

SplashScreen.preventAutoHideAsync()

const coreDir = new Directory(Paths.document, 'core')
const storagePath = coreDir.uri.replace(/^file:\/+/, '/')

export default function RootLayout() {
  const [worketLoaded, setWorkletLoaded] = useState(false)
  const [fatalError, setFatalError] = useState<string | null>(null)

  const [loaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  const initWorklet = useCallback(async () => {
    try {
      setFatalError(null)
      await startWorklet(storagePath)
      setWorkletLoaded(true)
    } catch (e) {
      console.error('Error in initWorklet', e)
      setFatalError(e instanceof Error ? e.message : 'Failed to initialize backend runtime.')
      setWorkletLoaded(false)
    }
  }, [])

  useEffect(() => {
    if (fontError) setFatalError('Failed to load system fonts.')
  }, [fontError])

  useEffect(() => {
    initWorklet()
  }, [initWorklet])

  useEffect(() => {
    if (loaded && worketLoaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded, worketLoaded])

  if (fatalError) {
    return <ErrorScreen message={fatalError} onRetry={initWorklet} />
  }

  if (!loaded || !worketLoaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}
