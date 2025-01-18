import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

const Chat = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: 18 }}>Welcome to the Chat Page!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
