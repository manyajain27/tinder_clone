import { View, Text, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import getMatchedUserInfo from '@/lib/utils/getMatchedUserInfo'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams } from 'expo-router'
import SenderMessage from '@/components/SenderMessage'
import ReceiverMessage from '@/components/ReceiverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebaseConfig'

const MessageScreen = () => {
    interface Message {
      id: string;
      userId: string;
      displayName: string;
      photoURL: string;
      message: string;
      timeStamp: any;
    }
    const {user} = useUser();
    const params = useLocalSearchParams();
    const matchDetails = params.matchDetails ? JSON.parse(params.matchDetails as string) : null;
    const [input, setInput] = useState('');
    const [inputHeight, setInputHeight] = useState(40);
    
    const [messages, setMessages] = useState<Message[]>([]);
    // console.log(matchDetails)
    
    useEffect(() => {
        const unsubscribe =  onSnapshot(query(collection(db, 'matches', matchDetails.id, 'messages'),
         orderBy('timeStamp', 'desc')), (snapshot) => {
            setMessages(snapshot.docs.map(
                doc => ({
                    id: doc.id,
                    userId: doc.data().userId,
                    displayName: doc.data().displayName,
                    photoURL: doc.data().photoURL,
                    message: doc.data().message,
                    timeStamp: doc.data().timeStamp
                })
            ))
         })

         return unsubscribe;

    },[matchDetails?.id])

    const sendMessage = () => {
        const trimmedInput = input.trim();
        
        if (!trimmedInput || !user?.id) return; // Don't send if message is empty or no user
    
        addDoc(collection(db, 'matches', matchDetails.id, 'messages' ), {
            timeStamp: serverTimestamp(),
            userId: user.id,
            displayName: user.fullName,
            photoURL: matchDetails.users[user.id].photoURL,
            message: trimmedInput                  
        });
        
        setInput('');
    };

  return (
    <SafeAreaView className='flex-1'>
      <Header matchDetails={matchDetails} profileEnabled={true} headerBorder={true}
      title={getMatchedUserInfo(matchDetails.users,user?.id).displayName} callEnabled/>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1'
      keyboardVerticalOffset={10}
      >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <FlatList
            data={messages}
            inverted={true}
            keyExtractor={(item) => item.id}
            renderItem={({item: message}) => (
                message.userId == user?.id ? (
                    <SenderMessage key={message.id} message={message} />
                ) : (
                    <ReceiverMessage key={message.id} message={message} />
                )
            )}
            className='pl-4 py-3'

            />
        </TouchableWithoutFeedback>

        <View 
        className='flex flex-row items-center justify-between 
        border-t border-gray-200 px-5 py-2'
        >
            <TextInput
            className='text-lg w-full relative'
            placeholder='Send message...'
            placeholderTextColor={'#A0AEC0'}
            onChangeText={setInput}
            onContentSizeChange={(event) => 
            setInputHeight(event.nativeEvent.contentSize.height) // Adjust height dynamically
            }
            value={input}
            multiline={true} // Enable multiline input
            style={{
            height: Math.min(inputHeight, 120), // Limit max height to 120 for usability
            maxHeight: 120,
            maxWidth: '83%', // Limit width to 90% for usability
            minHeight: 40, // Default height
            textAlignVertical: 'top', // Ensures text starts at the top
            }}
        />
            <View className='absolute right-5'>
                <Button onPress={sendMessage} title='Send' color={'#ff5864'} />
            </View>
        </View>
        </KeyboardAvoidingView>

      
    </SafeAreaView>
  )
}
export default MessageScreen