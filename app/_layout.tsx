import { tokenCache } from '@/cache';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import '@/global.css';
import { StatusBar } from 'expo-status-bar';

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
      <Stack>
        <Stack.Screen name='index' options={{
          headerShown: false,
          title: 'Home'
        }}/>
        <Stack.Screen name='chat' options={{
          title: 'Chat',
          headerShown: false
        }}/>
        <Stack.Screen name='ModalScreen' options={{
          presentation: 'modal',
          title: 'Modal Screen',
          headerShown: false
        }}/>
        <Stack.Screen name='MatchScreen' options={{
          presentation: 'transparentModal',
          title: 'Match Screen',
          headerShown: false
        }} />
        <Stack.Screen name='(auth)' options={{
          headerShown: false
        }} />
        <Stack.Screen name='MessageScreen'
        options={{
          title: 'Message Screen',
          headerShown: false 
        }}/>
      </Stack>
      
      
    </>
  );
}
