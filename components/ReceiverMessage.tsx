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
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 1, // Reduced vertical spacing
        marginHorizontal: 8, // Reduced horizontal spacing
      }}
    >
      {/* User Profile Image */}
      <Image
        style={{
          height: 36,
          width: 36,
          borderRadius: 18, // Makes it circular
          marginRight: 8, // Reduced spacing
        }}
        source={{
          uri: message.photoURL,
        }}
      />

      {/* Message Bubble */}
      <View
        style={{
          backgroundColor: "#6B46C1", // Purple bubble color
          borderRadius: 12,
          borderTopLeftRadius: 0, // Matches WhatsApp-style bubble
          paddingHorizontal: 10, // Reduced padding
          paddingVertical: 6, // Reduced padding
          maxWidth: "75%", // Slightly smaller bubble width
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1, // Subtle shadow for Android
        }}
      >
        {/* Message Text */}
        <Text
          style={{
            color: "white",
            fontWeight: "500",
            fontSize: 16, // Reduced font size
            marginBottom: 3, // Reduced spacing
          }}
        >
          {message.message}
        </Text>

        {/* Timestamp */}
        <Text
          style={{
            color: "#D1D1D1",
            fontSize: 10, // Smaller timestamp font
            textAlign: "right",
          }}
        >
          {formatTime(message.timeStamp)}
        </Text>
      </View>
    </View>
  );
};

export default ReceiverMessage;
