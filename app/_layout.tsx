import { tokenCache } from '@/cache';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, Stack } from 'expo-router';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import '@/global.css';

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoadedComponent />
    </ClerkProvider>
  );
}

function ClerkLoadedComponent() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color="#FF4458" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <Stack>
        <Stack.Screen name='index' options={{
          headerShown: false,
          title: 'Home'
        }}/>
        <Stack.Screen name='chat' options={{
          title: 'Chat',
          headerBackTitle: 'Back' ,
          headerTransparent: true,
          headerTintColor: '#FF4458',
          headerTitleStyle:{color: 'black'}
        }}/>
      </Stack>
    </>
  );
}
