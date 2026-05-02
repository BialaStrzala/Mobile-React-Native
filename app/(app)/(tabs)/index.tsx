import NewestBookCarousel from "@/components/NewestBookCarousel";
import StatisticsBox from "@/components/StatisticsBox";
import { globalStyles } from "@/lib/globalStyle";
import { supabase } from "@/lib/supabase";
import { colors, radius } from "@/lib/theme";
import { useNavigation } from "@react-navigation/native";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";

interface UserBookData {
    id: any,
    book_id: any,
    status: any,
    rating: any,
    notes: any,
    created_at: any,
    books?: {
        title: any,
        author: any
    }[]
}

const HomeScreen = () => {
    const navigation = useNavigation();
    const [userBookData, setUserBookData] = useState<UserBookData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user }, } = await supabase.auth.getUser();
            if (!user) return;

            const { data: books } = await supabase
                .from("user_books")
                .select("id, book_id, status, rating, notes, created_at, books(title, author)")
                .eq("user_uid", user.id)
                .order("created_at", { ascending: false });

            setUserBookData(books || []);
        } catch (err) {
            console.error("Error loading home data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    // Calculate stats
    const totalBooks = userBookData.length;
    const finishedCount = userBookData.filter(b => b.status === "Finished").length;
    const readingCount = userBookData.filter(b => b.status === "Reading").length;
    const planningCount = userBookData.filter(b => b.status === "Planning").length;
    const discontinuedCount = userBookData.filter(b => b.status === "Discontinued").length;

    const ratings = userBookData.filter(b => b.rating !== null).map(b => b.rating);
    const averageRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
        : "N/A";

    return (
        <ScrollView style={globalStyles.mainContainer} contentContainerStyle={globalStyles.scrollViewContent}>
            <Text style={globalStyles.titleText}>Welcome back!</Text>
            <StatisticsBox
                totalBooks={totalBooks}
                finishedCount={finishedCount}
                readingCount={readingCount}
                planningCount={planningCount}
                discontinuedCount={discontinuedCount}
                averageRating={averageRating}
            />

            <Text style={styles.sectionTitle}>Newest Books</Text>
            <NewestBookCarousel />

            <Pressable onPress={() => router.push("/(app)/(tabs)/allbooks")}
                style={({ pressed }) => [
                  globalStyles.tertiaryButton, pressed && globalStyles.tertiaryButtonPressed,]}>
                <Text style={globalStyles.tertiaryButtonText}>View all books</Text>
            </Pressable>

            
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
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: 12,
    },
})