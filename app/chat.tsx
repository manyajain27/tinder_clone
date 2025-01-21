import ChatList from '@/components/ChatList';
import Header from '@/components/Header';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';


const Chat = () => {
  return (
    <SafeAreaView className=''>
      <View className='mx-3'>
        <Header headerBorder={false} profileEnabled={false} title='Chat' callEnabled={false} />
        <ChatList/>
      </View>
        
    </SafeAreaView>
  );
};

export default Chat;
