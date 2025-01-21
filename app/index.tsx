import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { Text, View, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import tinderlogo from '@/assets/images/tinderlogo.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Swiper from 'react-native-deck-swiper';
import {DUMMY_DATA} from '@/dummy_data'
import { collection, doc, DocumentSnapshot, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import generatedId from '@/lib/utils/generatedId';
import { StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';


interface Profile {
  id: string;
  displayName: string;
  job: string;
  age: number;
  photoURL: string;
  timestamp: any;
}


export default function Index() {
  const { isLoaded, signOut, userId } = useAuth();
  const { user } = useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const swipeRef = useRef<Swiper<any>>(null);  
  const [noCards, setNoCards] = useState(false);

  useLayoutEffect(()=>{
    if(!user) return;
    
    const unsubscribe = onSnapshot(doc(db, "users", user.id), snapshot =>{
      // console.log(snapshot)
      if(!snapshot.exists()){
        router.push('/ModalScreen')
      }
    })
    return () => unsubscribe();
  },[user])


  useEffect(()=>{
    let unsubscribe;

    const fetchProfiles = async () => {
      if(!user) return;
      const passes = await getDocs(collection(db,'users', user.id, 'passes')).then(
        (snapshot) => snapshot.docs.map(doc => doc.id)
      );
      const likes = await getDocs(collection(db,'users', user.id, 'likes')).then(
        (snapshot) => snapshot.docs.map(doc => doc.id)
      );

      const passedUserIds = passes.length > 0? passes : ['test']
      const LikedUserIds = likes.length > 0? likes : ['test']

      unsubscribe = onSnapshot(
        query(collection(db,'users'), where('id','not-in',[...passedUserIds, ...LikedUserIds])),
        (snapshot) => {
          const filteredProfiles = snapshot.docs
          .filter(doc => doc.id !== user.id)
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Profile[];
        
        setProfiles(filteredProfiles);
        // Set noCards state based on filtered profiles length
        setNoCards(filteredProfiles.length === 0);
      }
    );
  };
  
  fetchProfiles();
  return unsubscribe;
}, [user]);


  const swipeLeft = async(cardIndex: any) => {
    if(!user) return;
    if(!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`you swiped pass on ${userSwiped.displayName}`);

    await setDoc(doc(db, 'users', user?.id, 'passes', userSwiped.id ),
    userSwiped);


  };

  const swipeRight = async(cardIndex: any) => {
    if(!user) return;
    if(!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const LoggedInProfile = await (
      await getDoc(doc(db, 'users', user.id))
    ).data();

   

    // to check if the user swiped right on you
    getDoc(doc(db, 'users', userSwiped.id, 'likes', user.id)).then(
      (documentSnapshot) => {
        if(documentSnapshot.exists()){
          //some user has matched with you before
          //create a match
          console.log(`Hooray! You matched with ${userSwiped.displayName}`);

          setDoc(
            doc(db, 'users', user?.id, 'likes', userSwiped.id),
            userSwiped
          );

          // create a match
          setDoc(
            doc(db, 'matches', generatedId(user.id, userSwiped.id)),{
              users : {
                [user.id]: LoggedInProfile,
                [userSwiped.id]: userSwiped
              },
              usersMatched: [user.id, userSwiped.id],
              timeStamp: serverTimestamp(),
            }
          );

        
          //navigate to matched screen
          router.push({
            pathname: '/MatchScreen',
            params: {
                LoggedInProfile: JSON.stringify(LoggedInProfile),
                userSwiped: JSON.stringify(userSwiped)
            }
        });
        }
        else{
          //you swiped for first time on this user or 
          //did not swipe right on you
          console.log(`you swiped like on ${userSwiped.displayName}`);
          setDoc(
            doc(db, 'users', user?.id, 'likes', userSwiped.id),
            userSwiped
          );
        }
      }
    )

    
    
  }

  

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle={'dark-content'} />
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

          <TouchableOpacity
            onPress={()=>router.push('/ModalScreen')}>
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
        {noCards ? (
          // Empty state container with same dimensions as Swiper card
          <View className='flex-1 justify-center items-center'>
            <View className='bg-white h-[63vh] w-[85vw] rounded-xl justify-center items-center' style={styles.cardShadow}>
              <Text className='font-bold pb-5 text-xl'>No more Profiles :( </Text>
              <Image
                width={100}
                height={100}
                source={{uri: 'https://links.papareact.com/6gb'}}
              />
            </View>
          </View>
        ) : (
          // Swiper with cards
          <Swiper 
            ref={swipeRef}
            cards={profiles}
            renderCard={(card) => {
              if (!card) return null;
              return (
                <View className='flex-1 items-center'>
                  <View key={card.id} className=' bg-white h-[63vh] w-[85vw] rounded-xl relative'>
                    <Image 
                      source={{uri: card.photoURL}} 
                      className='h-full w-full rounded-xl absolute top-0' 
                      resizeMode='cover' 
                    />
                    <View className='bg-white w-full h-20 absolute bottom-0 flex-row justify-between items-center px-6 py-2 rounded-b-xl' style={styles.cardShadow}>
                      <View>
                        <Text className='text-xl font-bold'> {card.displayName}</Text>
                        <Text> {card.job} </Text>
                      </View>
                      <Text className='text-xl font-bold'> {card.age} </Text>
                    </View>
                  </View>
                </View>
              );
            }}
            containerStyle={{backgroundColor: 'transparent'}}
            stackSize={5}
            cardIndex={0}
            stackSeparation={12}
            onSwipedLeft={swipeLeft}
            onSwipedRight={swipeRight}
            onSwipedAll={() => {
              console.log('All cards swiped');
              setNoCards(true);
            }}
            animateCardOpacity={true}
            verticalSwipe={false}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    textAlign: 'right',
                    color: 'red'
                  }
                }
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    textAlign: 'left',
                    color: 'green'
                  }
                }
              }
            }}
          />
        )}
      </View>
        {/* end cards */}

        <View className='z-10 flex flex-row justify-evenly mb-5'>
          <TouchableOpacity
          onPress={()=>{
            if(profiles.length === 0){
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              return;
            }
            swipeRef.current?.swipeLeft();
          }}
          className='items-center justify-center rounded-full
          w-16 h-16 bg-red-200'>
            <Entypo name='cross' size={40} color='red'/>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={()=>{
            if(profiles.length === 0){
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              return;
            }
            swipeRef.current?.swipeRight()}}
          className='items-center justify-center rounded-full
          w-16 h-16 bg-green-200'>
            <Entypo name='heart' size={40} color='green'/>
          </TouchableOpacity>
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