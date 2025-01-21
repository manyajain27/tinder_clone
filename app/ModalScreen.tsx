import { View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import tinder_full from '@/assets/images/tinder-logo-full.png';
import { useUser } from '@clerk/clerk-expo';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';

// Add your Cloudinary configuration
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/du0vwm9xd/image/upload';
const UPLOAD_PRESET = 'user_profiles'; // Create an unsigned upload preset in your Cloudinary dashboard

interface UserProfile {
  id: string;
  displayName: string;
  photoURL: string;
  job: string;
  age: string;
  timestamp: any;
}

const ModalScreen = () => {
  const { user } = useUser();
  const [image, setImage] = useState<string>('');
  const [job, setJob] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const incomplete_form = !image || !job || !age;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        await uploadToCloudinary(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error selecting image. Please try again.');
    }
  };

  const uploadToCloudinary = async (uri: string) => {
    try {
      setUploading(true);
      setProgress(0.3); // Show initial progress

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      } as any);
      formData.append('upload_preset', UPLOAD_PRESET);

      // Upload to Cloudinary
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      setProgress(0.8);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImage(data.secure_url);
      setProgress(1);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const updateUserProfile = async () => {
    if (!user?.id) return;

    try {
      const userProfile: UserProfile = {
        id: user.id,
        displayName: user.fullName || '',
        photoURL: image,
        job: job,
        age: age,
        timestamp: serverTimestamp()
      };

      await setDoc(doc(db, "users", user.id), userProfile);
      router.back();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 items-center pt-1">
        <Image 
          source={tinder_full}
          className="h-20 w-full"
          resizeMode="contain"
        />
        
        <Text className="text-2xl text-gray-500 p-2 font-bold">
          Welcome {user?.firstName}! 👋
        </Text>

        {/* Profile pic section */}
        <Text className="text-center p-4 font-bold text-red-400">
          Set the Profile Pic
        </Text>
        
        {image ? (
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: image }}
              className="w-32 h-32 rounded-full"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={pickImage}
            className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center"
          >
            <Text className="text-gray-500">Tap to select</Text>
          </TouchableOpacity>
        )}

        {uploading && (
          <View className="mt-2">
            <Progress.Bar 
              progress={progress} 
              width={200} 
              color="#FF4864"
            />
          </View>
        )}

        {/* Rest of your form fields */}
        <Text className="text-center p-4 font-bold text-red-400">
          Set your occupation
        </Text>
        <TextInput
          value={job}
          onChangeText={setJob}
          className="h-12 text-xl text-center font-medium pb-2 w-64 border-b-2 border-gray-200"
          placeholder="Enter your occupation"
          placeholderTextColor="lightgray"
        />

        <Text className="text-center p-4 font-bold text-red-400">
          Set your age
        </Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          maxLength={2}
          keyboardType="numeric"
          className="h-12 text-xl font-medium text-center pb-2 w-64 border-b-2 border-gray-200"
          placeholder="Enter your age"
          placeholderTextColor="lightgray"
        />

        <TouchableOpacity
          onPress={updateUserProfile}
          disabled={incomplete_form || uploading}
          className={`w-64 p-3 rounded-xl absolute bottom-14 ${
            incomplete_form || uploading ? 'bg-gray-400' : 'bg-red-400'
          }`}
        >
          <Text className="text-center p-4 font-bold text-white">
            {uploading ? 'Uploading...' : 'Update Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ModalScreen;