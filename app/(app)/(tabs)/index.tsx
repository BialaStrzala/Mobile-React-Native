import NewestBookCarousel from "@/components/NewestBookCarousel";
import { colors, radius } from "@/lib/theme";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View>
                <Text>Welcome back!</Text>
                <View style={styles.miniStatsCard}>
                    <Text>You are reading x books</Text>
                </View>
                <Button title="Add new book" onPress={() => {router.push("/(tabs)/newbook")}} />
            </View>
            <View>
                <NewestBookCarousel />
            </View>
            <View>
                <Text>All books</Text>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColor,
        width: "100%",
        height: "100%",
    },
    miniStatsCard: {
        backgroundColor: colors.cardColor,
        borderRadius: radius.md,
    }
})