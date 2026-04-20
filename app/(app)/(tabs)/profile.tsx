import { Text, View } from 'react-native'

const ProfileScreen = () => {
    return (
        <View>
            <Text>ProfileScreen</Text>
            <View>
                <Text>Statystyki</Text>
                <View>
                    <Text>Data dołączenia:</Text>
                    <Text>Liczba przeczytanych książek:</Text>
                    <Text>Książki w trakcie czytania:</Text>
                    <Text>Książki planowane:</Text>
                    <Text>Liczba wystawionych opinii:</Text>
                    <Text>Followers:</Text>
                    <Text>Following:</Text>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen
