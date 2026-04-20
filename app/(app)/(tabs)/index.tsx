import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { Button, Text, View } from 'react-native';

const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
            <View>
                <Text>Welcome back!</Text>
                <Text>Books read:</Text>
                <Text>Books in progress:</Text>
                <Text>Books planned:</Text>
                <Button title="Add new book" onPress={() => {}} />
            </View>
            <View>
                <Text>Newly added</Text>
            </View>
            <View>
                <Text>All books</Text>
            </View>
        </View>
    )
}

export default HomeScreen

