import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import ChatRow from './ChatRow';

const ChatList = () => {
    interface Match {
      id: string;
      users: {
        [key: string]: {
          displayName: string;
          photoURL: string;
          job?: string;
          age?: string;
        }
      };
    }
    
    const [matches, setMatches] = useState<Match[]>([]);
    const {user} = useUser();

    useEffect(()=>{
        onSnapshot(query(collection(db, 'matches'),where('usersMatched', 
            'array-contains', user?.id)),
            (snapshot) => setMatches(snapshot.docs.map(
                doc => ({
                    id: doc.id,
                    ...doc.data(),
                    users: doc.data().users
                })
            ))
        )
    },[user])

    // console.log(matches)

  return (
    matches.length > 0? (
        <FlatList
        className='h-full '
        style={{marginTop: 10}}
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ChatRow matchDetails={item} />}
        />
    )
    : (
        <View className=' p-5'>
            <Text className='text-lg text-center font-bold' style={{marginTop: 300 }} >No matches yet 😢</Text>
        </View>
    )
  )
}

export default ChatList