import NewestBookCarousel from "@/components/NewestBookCarousel";
import { globalStyles } from "@/lib/globalStyle";
import { colors, radius } from "@/lib/theme";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";

const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <ScrollView style={globalStyles.mainContainer} contentContainerStyle={globalStyles.scrollViewContent}>
            <View style={globalStyles.card}>
                <Text style={globalStyles.titleText}>Welcome back!</Text>
                <View style={styles.miniStatsCard}>
                    <Text>You are reading x books</Text>
                </View>
                <Button title="Add new book" onPress={() => { router.push("/(tabs)/newbook") }} />
            </View>

            <View>
                <NewestBookCarousel />
            </View>

            <View>
                <Text>All books</Text>
            </View>
        </ScrollView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColor,
        width: "100%",
        height: "100%",
    },
    content: {
        padding: 10,
    },
    miniStatsCard: {
        backgroundColor: colors.cardColor,
        borderRadius: radius.md,
    }
})