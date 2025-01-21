import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import getMatchedUserInfo from '@/lib/utils/getMatchedUserInfo'
import { router } from 'expo-router';

interface MatchDetails {
    users: Record<string, any>;
}

interface MatchedUserInfo {
    photoURL: string;
    displayName: string;
}

const ChatRow = ({matchDetails}: { matchDetails: MatchDetails }) => {
    const [matchedUserInfo, setMatchedUserInfo] = useState<MatchedUserInfo | null>(null);
    const {user} = useUser();

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(
            matchDetails.users,
            user?.id
        ))
    },[matchDetails,user]);

    useEffect(() => {
        // 
    }, []);


  return (
    <TouchableOpacity
    onPress={() => {
        // console.log('matchDetails:', matchDetails);
        // console.log(JSON.stringify(matchDetails));
        router.push({
        pathname: '/MessageScreen',
        params: { matchDetails: JSON.stringify(matchDetails) }
    })}}
    className='flex flex-row items-center
    py-3 my-1 rounded-lg h-20 px-5'
    style={[{borderColor:'#EEEEEE',borderRadius:25 ,borderRightWidth:0,
        borderLeftWidth:0, borderWidth:3/4, borderTopWidth:0},styles.cardShadow]}
    >
        <Image 
        className='rounded-full h-16 w-16'
        source={{uri: matchedUserInfo?.photoURL}}
        />
        <View className=''>
            <Text className='text-lg font-bold'>{matchedUserInfo?.displayName}</Text>
            <Text>Say Hi! 👋</Text>
        </View>
    </TouchableOpacity>
  )
}

export default ChatRow

const styles =StyleSheet.create({
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1/2,
        elevation: 2,
        gap: 17,
      }
})