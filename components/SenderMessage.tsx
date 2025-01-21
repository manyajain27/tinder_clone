import { View, Text } from 'react-native';
import React from 'react';

interface Message {
    id: string;
    userId: string;
    displayName: string;
    photoURL: string;
    message: string;
    timeStamp: any;
}

const SenderMessage = ({ message }: { message: Message }) => {
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
                backgroundColor: '#1F2937', // Darker shade for better contrast
                borderRadius: 12,
                borderTopRightRadius: 0,
                paddingHorizontal: 10, // Compact padding
                paddingVertical: 6,
                marginHorizontal: 8, // Reduced spacing
                marginVertical: 1,
                alignSelf: 'flex-end',
                maxWidth: '75%', // Adjusted for a slightly smaller bubble
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2, // Subtle shadow for Android
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontWeight: '500',
                    fontSize: 16, // Reduced font size for compactness
                    marginBottom: 4, // Spacing between message and timestamp
                }}
            >
                {message.message}
            </Text>
            <Text
                style={{
                    color: '#9E9E9E',
                    fontSize: 10, // Smaller timestamp font size
                    textAlign: 'right', // Align timestamp to the bottom-right
                }}
            >
                {formatTime(message.timeStamp)}
            </Text>
        </View>
    );
};

export default SenderMessage;
