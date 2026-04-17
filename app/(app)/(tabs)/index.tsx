import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { Button, Text, View } from 'react-native';

const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
            <View>
                <Text>Witaj z powrotem!</Text>
                <Text>Liczba przeczytanych książek:</Text>
                <Text>Liczba książek w trakcie:</Text>
                <Text>Liczba książek do przeczytania:</Text>
                <Button title="Dodaj nową książkę" onPress={() => {}} />
            </View>
            <View>
                <Text>Nowo dodane</Text>
            </View>
            <View>
                <Text>Wszystkie książki</Text>
            </View>
        </View>
    )
}

export default HomeScreen

