import React from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { Text, View, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import tinderlogo from '@/assets/images/tinderlogo.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import Swiper from 'react-native-deck-swiper';
import {DUMMY_DATA} from '@/dummy_data'
import { Colors } from 'react-native/Libraries/NewAppScreen';


export default function Index() {
  const { isLoaded, signOut, userId } = useAuth();
  const { user } = useUser();



  if (!isLoaded) {
    return <ActivityIndicator size="large" color="#FF4458" />;

  }

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Signed Out', 'You have been successfully signed out.');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      {/* signed out */}

      <SignedOut>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity
              style={{
                backgroundColor: '#FF4458',
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>
                Get Started
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>

        {/* signed in */}

      <SignedIn>

        {/* header */}
        <View className='flex flex-row justify-between items-center relative px-5'> 
          <TouchableOpacity onPress={handleSignOut} className=''>
            <Image source={{uri: user?.imageUrl}}
            className='h-12 w-12 rounded-full'
            resizeMode='contain' />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image source={tinderlogo} className='h-14 w-14' 
            resizeMode='contain'/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>router.push('/chat')} className=''>
            <Ionicons name='chatbubbles-sharp' size={30} color='#FF4458'/>
          </TouchableOpacity>
        </View>
        {/* end header */}

        {/* cards */}
        <View className='flex-1 -mt-6'>
        <Swiper 
        cards={DUMMY_DATA}
        renderCard={(card)=>(
          <View key={card.id} className='bg-white h-3/4 rounded-xl relative'>
            <Image source={{uri: card.photoURL}} className='h-full w-full rounded-xl absolute top-0' resizeMode='cover' />

            <View className='bg-white w-full h-20 
            absolute bottom-0 flex-row justify-between items-center
             px-6 py-2 rounded-b-xl' style={styles.cardShadow}>
              <View>
                <Text className='text-xl font-bold'> {card.firstName} {card.lastName} </Text>
                <Text> {card.occupation} </Text>
              </View>
              <Text className='text-xl font-bold'> {card.age} </Text>
            </View>


          </View>
          
        )}
        containerStyle={{backgroundColor: 'transparent'}}
        stackSize={5}
        cardIndex={0}
        stackSeparation={12}
        onSwipedLeft={()=>{
          console.log('swiped PASS')
        }}
        onSwipedRight={()=>{
          console.log('swiped LIKE')
        }}
        animateCardOpacity
        verticalSwipe={false}
        overlayLabels={{
          left:{
            title: 'NOPE',
            style:{
              label :{
                textAlign: 'right',
                color: 'red'
              }
            }
          },
          right:{
            title: 'LIKE',
            style:{
              label :{
                textAlign: 'left',
                color: 'green'
              }
            }
          }
        }}
        />
        </View>

      </SignedIn>
    </SafeAreaView>
  );
}

const styles= StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  overlayLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  overlayLabelText: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})