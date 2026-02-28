import React, { useMemo } from 'react'
import {
  Text as DefaultText,
  View as DefaultView,
  useColorScheme as useDeviceColorScheme,
} from 'react-native'

import Colors from '@/constants/Colors'
import { Layout, Spacing } from '@/constants/Spacing'
import { Typography } from '@/constants/Typography'

/**
 * Hook to access the current theme tokens.
 */
export function useTheme() {
  const colorScheme = useDeviceColorScheme() ?? 'light'

  return useMemo(
    () => ({
      colors: Colors[colorScheme],
      colorScheme,
      spacing: Spacing,
      layout: Layout,
      typography: Typography,
    }),
    [colorScheme],
  )
}

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}

export type TextProps = ThemeProps &
  DefaultText['props'] & {
    variant?: keyof typeof Typography
  }
export type ViewProps = ThemeProps & DefaultView['props']

/**
 * Theme-aware Text component with typography variants.
 */
export function Text(props: TextProps) {
  const { style, lightColor, darkColor, variant = 'body', ...otherProps } = props
  const theme = useTheme()

  const color =
    theme.colorScheme === 'light' ? lightColor || theme.colors.text : darkColor || theme.colors.text
  const typographyStyle = Typography[variant]

  return <DefaultText style={[{ color }, typographyStyle, style]} {...otherProps} />
}

/**
 * Theme-aware View component.
 */
export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const theme = useTheme()

  const backgroundColor =
    theme.colorScheme === 'light'
      ? lightColor || theme.colors.background
      : darkColor || theme.colors.background

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />
}

/**
 * Pre-styled Container with standard padding.
 */
export function Container(props: ViewProps) {
  const theme = useTheme()
  return <View {...props} style={[{ flex: 1, padding: theme.spacing.md }, props.style]} />
}

/**
 * Pre-styled Card component.
 */
export function Card(props: ViewProps) {
  const theme = useTheme()
  return (
    <View
      {...props}
      style={[
        {
          padding: theme.spacing.md,
          borderRadius: theme.layout.borderRadius.md,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        props.style,
      ]}
    />
  )
}
