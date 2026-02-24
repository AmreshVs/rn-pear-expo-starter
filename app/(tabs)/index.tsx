import { useCallback, useState } from 'react'
import { Text as NativeText, Pressable, StyleSheet } from 'react-native'
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { backendApi } from '@/backend/api'
import { Container, Text, useTheme, View } from '@/components/Themed'

export default function TabOneScreen() {
  const { colors } = useTheme()
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const buttonScale = useSharedValue(1)

  const handleOnPress = useCallback(async () => {
    setIsLoading(true)
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1)
    })

    try {
      const res = await backendApi.helloWorld()
      setResponse(res.value)
    } catch (error) {
      console.error(error)
      setResponse('Error connecting to bare')
    } finally {
      setIsLoading(false)
    }
  }, [buttonScale])

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    }
  })

  return (
    <Container style={styles.container}>
      <Animated.View entering={FadeInUp} style={styles.header}>
        <NativeText style={styles.logo}>🍐</NativeText>
        <Text variant="h1" style={styles.title}>
          RN Pear Starter
        </Text>
        <Text variant="body" style={styles.subtitle}>
          The power of Pears with the ease of Expo
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.actionSection}>
        <View style={styles.responseContainer}>
          {response ? (
            <Text variant="h3" style={[styles.responseText, { color: colors.success }]}>
              {response}
            </Text>
          ) : (
            <Text variant="caption" style={styles.placeholderText}>
              Response from backend will appear here
            </Text>
          )}
        </View>

        <Animated.View style={animatedButtonStyle}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed,
            ]}
            onPress={handleOnPress}
            disabled={isLoading}
          >
            <Text variant="bodyBold" style={styles.buttonText}>
              {isLoading ? 'Connecting...' : 'Fetch from Backend'}
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} style={styles.kickstartSection}>
        <Text variant="caption" style={styles.kickstartLabel}>
          GET STARTED NOW
        </Text>
        <View style={[styles.kickstartBadge, { backgroundColor: colors.surfaceSecondary }]}>
          <Text variant="bodyBold" style={styles.kickstartText}>
            npm run kickstart
          </Text>
        </View>
      </Animated.View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 64,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.6,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
  },
  responseContainer: {
    marginBottom: 24,
    height: 40,
    justifyContent: 'center',
  },
  responseText: {
    textAlign: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    opacity: 0.4,
  },
  button: {
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  kickstartSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  kickstartLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    opacity: 0.4,
    marginBottom: 12,
  },
  kickstartBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  kickstartText: {
    fontSize: 14,
    opacity: 0.8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    opacity: 0.4,
    fontSize: 12,
  },
  bold: {
    fontWeight: '700',
  },
})
