import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import getMatchedUserInfo from '@/lib/utils/getMatchedUserInfo';

interface HeaderProps {
  title: string;
  callEnabled: boolean;
  profileEnabled: boolean;
  matchDetails? : any;
}

const Header: React.FC<HeaderProps> = ({ title, callEnabled, profileEnabled, matchDetails }) => {
    const {user} = useUser();

    // console.log(matchDetails)

  return (
    <View className='p-2 flex flex-row items-center justify-between'
    style={{borderBottomWidth:1/2, borderBottomColor:'gray'}}
    >
      <View className='flex flex-row items-center'>
        <TouchableOpacity
        onPress={()=>router.back()}
        className=''
        >
            <Ionicons name='chevron-back-outline' size={32} color='#ff5864'/>
        </TouchableOpacity>
        {profileEnabled && (

        <Image
        className='h-12 w-12 rounded-full'
        style={{marginLeft:3, marginRight:15}}
        source={{uri: getMatchedUserInfo(matchDetails.users,user?.id).photoURL}}/>
        )}
        <Text className='text-2xl font-bold'>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity className='p-3 bg-red-200 rounded-full'>
            <Ionicons name='call' size={20} color='#ff5864'/>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Header