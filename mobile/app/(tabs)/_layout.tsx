import { Tabs } from 'expo-router'
import { Home, Search, List, BarChart2, User } from 'lucide-react-native'
import { useT } from '@/i18n/translations'

export default function TabLayout() {
  const t = useT()
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#09090b',
          borderTopColor: '#27272a',
        },
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#71717a',
        headerStyle: { backgroundColor: '#09090b' },
        headerTintColor: '#e4e4e7',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav_home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('nav_search'),
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: t('nav_list'),
          tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t('nav_stats'),
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav_profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
