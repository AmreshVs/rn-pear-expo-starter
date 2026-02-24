import { Link, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

import { Container, Text, useTheme } from '@/components/Themed'

export default function NotFoundScreen() {
  const { colors } = useTheme()

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Container style={styles.container}>
        <Text variant="h3" style={styles.title}>
          This screen doesn't exist.
        </Text>

        <Link href="/" style={styles.link}>
          <Text variant="bodyBold" style={[styles.linkText, { color: colors.primary }]}>
            Go to home screen!
          </Text>
        </Link>
      </Container>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    textAlign: 'center',
  },
})
