import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as AppleAuthentication from 'expo-apple-authentication';
import Svg, { Path } from 'react-native-svg';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInPage() {
  useWarmUpBrowser();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const { signIn, setActive } = useSignIn();

  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const handleGoogleOAuth = useCallback(async () => {
    try {
      setIsGoogleLoading(true);
      const { createdSessionId, setActive: googleSetActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        await googleSetActive?.({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth Error:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [startGoogleFlow]);

  const handleAppleSignIn = async () => {
    try {
      setIsAppleLoading(true);
      
      // Start the OAuth flow first
      const { createdSessionId, setActive: appleSetActive } = await startAppleFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        await appleSetActive?.({ session: createdSessionId });
      }
    } catch (err) {
      if ((err as any).code === 'ERR_REQUEST_CANCELED') {
        console.log('User canceled Apple Sign in');
      } else {
        console.error('Apple Sign in Error:', err);
      }
    } finally {
      setIsAppleLoading(false);
    }
  };

  // Rest of the component remains the same...
  const buttonStyle = {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  };

  const buttonTextStyle = {
    color: '#333333',
    fontSize: 18,
    fontWeight: '600' as const,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 80 }}>
        <Text style={{ fontSize: 48, color: '#FF4458', fontWeight: 'bold' }}>❤️</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: 16, color: '#FF4458' }}>
          tinder
        </Text>
      </View>

      {/* Welcome Text */}
      <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#333333' }}>
          Swipe Right®
        </Text>
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 16, color: '#666666' }}>
          Create an account to find your perfect match
        </Text>
      </View>

      {/* Sign-In Buttons */}
      <View style={{ paddingHorizontal: 32, paddingBottom: 64 }}>
        {/* Google Button */}
        <TouchableOpacity
          onPress={handleGoogleOAuth}
          disabled={isGoogleLoading || isAppleLoading}
          style={buttonStyle}
        >
          {isGoogleLoading ? (
            <ActivityIndicator color="#666666" />
          ) : (
            <>
              <View style={{ marginRight: 12 }}>
                <GoogleIcon />
              </View>
              <Text style={buttonTextStyle}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Apple Button - Only show on iOS */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            onPress={handleAppleSignIn}
            disabled={isGoogleLoading || isAppleLoading}
            style={buttonStyle}
          >
            {isAppleLoading ? (
              <ActivityIndicator color="#666666" />
            ) : (
              <>
                <View style={{ marginRight: 12,  }}>
                  <AppleIcon />
                </View>
                <Text style={buttonTextStyle}>Continue with Apple</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Terms Text */}
        <Text
          style={{
            fontSize: 12,
            textAlign: 'center',
            marginTop: 24,
            color: '#666666',
            paddingHorizontal: 16,
          }}
        >
          By tapping Create Account or Sign In, you agree to our Terms. Learn how we process your data
          in our Privacy Policy and Cookies Policy.
        </Text>
      </View>
    </View>
  );
}

// Google Icon Component
const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
      fill="#FFC107"
    />
    <Path
      d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
      fill="#FF3D00"
    />
    <Path
      d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.0011 12 18C9.39904 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
      fill="#4CAF50"
    />
    <Path
      d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
      fill="#1976D2"
    />
  </Svg>
);

// Apple Icon Component
const AppleIcon = () => (
    <Svg stroke="currentColor" color={'black'}  fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="28" width="28">
        <Path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z">
        </Path>
    </Svg>
);