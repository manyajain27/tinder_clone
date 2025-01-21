import { View, Text, Image, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';

const MatchScreen = () => {
    const {LoggedInProfile,userSwiped} = useLocalSearchParams();
    const parsedLoggedInProfile = typeof LoggedInProfile === 'string' ? JSON.parse(LoggedInProfile) : LoggedInProfile;
    const parsedUserSwiped = typeof userSwiped === 'string' ? JSON.parse(userSwiped) : userSwiped;


  return (
    <View className='h-full bg-red-500 pt-20 opacity-[0.89]'>
        <View className='justify-center px-10 pt-20'>
            <Image source={{uri: "https://links.papareact.com/mg9"}}
            className='h-20 w-full mb-10' 
            resizeMode='contain'
            />
        </View>
        <Text className='text-gray-200 text-center mt-5 font-bold text-2xl' >You and {parsedUserSwiped?.displayName} have liked each other</Text>

        <View className='flex-row justify-evenly mt-5'>
            <Image source={{
                uri: parsedLoggedInProfile?.photoURL
            }}
            resizeMode='center'
            className='h-32 w-32 rounded-full'
            />
            <Image source={{
                uri: parsedUserSwiped?.photoURL
            }}
            resizeMode='center'
            className='h-32 w-32 rounded-full'
            />
        </View>
        <TouchableOpacity 
        onPress={() => router.replace('/chat')}
        className='bg-white m-5 px-10 py-6 rounded-full mt-20'>
            <Text className='text-center text-xl font-medium'>Send a message</Text>
        </TouchableOpacity>
    
    </View>
  )
}

export default MatchScreen