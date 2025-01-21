import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

interface Message {
  id: string;
  userId: string;
  displayName: string;
  photoURL: string;
  message: string;
  timeStamp: any;
}

const ReceiverMessage = ({ message }: { message: Message }) => {
    const formatTime = (timestamp: any): string => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { 
            hour: '2-digit',
            minute: '2-digit'
        });
    };

  return (
    <View className="flex flex-row items-center justify-start">
      <Image
        className="h-12 w-12 rounded-full"
        source={{
          uri: message.photoURL,
        }}
      />

      <View
        style={{
          backgroundColor: "#6B46C1", // Equivalent to bg-purple-600
          borderRadius: 10, // Rounded corners
          borderTopRightRadius: 0, // Rounded-tr-none
          paddingHorizontal: 12, // px-5
          paddingVertical: 6, // py-3
          marginHorizontal: 12, // mx-3
          marginVertical: 3, // my-2
          alignSelf: "flex-start",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          maxWidth: "80%",
           // ml-auto
        }}
      >
        <Text
        className=""
          style={{
            color: "white",
            fontWeight: "500",
            marginRight: 10,
            marginBottom: 7,
            marginTop: 2,
            fontSize: 16
          }}
        >
          {message.message}
        </Text>
        <View
          style={{
            position: "relative",
            bottom: -2,
          }}
        >
          <Text
            style={{
              color: "#9E9E9E",
              fontSize: 10,
            }}
          >
            {formatTime(message.timeStamp)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReceiverMessage;
