import { BookOpen, Box, ExternalLink, GitBranch, Layers, Zap } from 'lucide-react-native'
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import { Container, Text, useTheme } from '@/components/Themed'

const resources = [
  {
    category: 'Core Runtime',
    icon: Zap,
    items: [
      {
        title: 'Bare Runtime',
        description: 'Fast, modular JS runtime for P2P environments.',
        url: 'https://github.com/holepunchto/bare',
      },
      {
        title: 'React Native Bare Kit',
        description: 'Bridge between React Native and the Bare Runtime.',
        url: 'https://github.com/holepunchto/react-native-bare-kit',
      },
    ],
  },
  {
    category: 'Communication',
    icon: GitBranch,
    items: [
      {
        title: 'HRPC',
        description: 'Schema-driven, type-safe RPC protocol by Holepunch.',
        url: 'https://github.com/holepunchto/hrpc',
      },
      {
        title: 'Hyperschema',
        description: 'Define and generate typed RPC schemas.',
        url: 'https://github.com/holepunchto/hyperschema',
      },
    ],
  },
  {
    category: 'Frontend',
    icon: Layers,
    items: [
      {
        title: 'Expo Router',
        description: 'File-based routing for React Native apps.',
        url: 'https://expo.github.io/router',
      },
      {
        title: 'React Native Reanimated',
        description: 'High-performance animations for React Native.',
        url: 'https://docs.swmansion.com/react-native-reanimated/',
      },
    ],
  },
  {
    category: 'Pear Ecosystem',
    icon: Box,
    items: [
      {
        title: 'Pear Documentation',
        description: 'Official docs for the Pear P2P ecosystem.',
        url: 'https://docs.pears.com',
      },
      {
        title: 'Holepunch GitHub',
        description: 'Explore all open-source Holepunch modules.',
        url: 'https://github.com/holepunchto',
      },
    ],
  },
]

export default function TabTwoScreen() {
  const { colors, spacing } = useTheme()

  return (
    <Container style={{ padding: 0 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingVertical: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={[styles.header, { paddingHorizontal: spacing.md }]}
        >
          <BookOpen size={28} color={colors.primary} style={styles.headerIcon} />
          <Text variant="h2" style={styles.title}>
            Explore Pear
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: colors.textSecondary }]}>
            Resources and documentation for every package powering this template.
          </Text>
        </Animated.View>

        {resources.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <Animated.View
              key={section.category}
              entering={FadeInDown.delay(100 + sectionIndex * 100).duration(500)}
              style={[styles.section, { paddingHorizontal: spacing.md }]}
            >
              <View style={styles.sectionHeader}>
                <Icon size={16} color={colors.textSecondary} style={styles.sectionIcon} />
                <Text
                  variant="label"
                  style={[styles.sectionTitle, { color: colors.textSecondary }]}
                >
                  {section.category}
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                {section.items.map((item, itemIndex) => (
                  <Pressable
                    key={item.title}
                    style={({ pressed }) => [
                      styles.item,
                      itemIndex !== section.items.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                      pressed && { opacity: 0.6 },
                    ]}
                    onPress={() => Linking.openURL(item.url)}
                  >
                    <View style={styles.itemContent}>
                      <Text variant="bodyBold">{item.title}</Text>
                      <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }}>
                        {item.description}
                      </Text>
                    </View>
                    <ExternalLink size={16} color={colors.textSecondary} />
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )
        })}
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 24,
  },
  header: {
    marginBottom: 8,
  },
  headerIcon: {
    marginBottom: 8,
  },
  title: {},
  subtitle: {
    marginTop: 6,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionIcon: {},
  sectionTitle: {},
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  itemContent: {
    flex: 1,
  },
})
