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
                backgroundColor: 'black',
                borderRadius: 10,
                borderTopRightRadius: 0,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginHorizontal: 12,
                marginVertical: 2,
                alignSelf: 'flex-end',
                maxWidth: '80%',
            }}
        >
            <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'flex-end'
            }}>
                <Text style={{ 
                    color: 'white',
                    marginRight: 10,
                    marginBottom: 7,
                    fontWeight: '500',
                    fontSize: 16
                }}>
                    {message.message}
                </Text>
                <View style={{
                    position: 'relative',
                    bottom: -2,
                }}>
                    <Text style={{ 
                        color: '#9E9E9E',
                        fontSize: 10,
                    }}>
                        {formatTime(message.timeStamp)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default SenderMessage;