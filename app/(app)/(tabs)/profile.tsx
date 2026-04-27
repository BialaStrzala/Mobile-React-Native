import { bookNameToColor } from "@/lib/bookmanager";
import { supabase } from "@/lib/supabase";
import { colors, radius } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

interface UserAuthData {
    id: any,
    username: any,
    email: any,
    created_at?: any
}
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
    }
}

const ProfileScreen = () => {
    const [userData, setUserData] = useState<UserAuthData | null>(null);
    const [userBookData, setUserBookData] = useState<UserBookData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            //user data
            const { data: { user }, } = await supabase.auth.getUser();
            if (!user) return;

            const { data: userProfile } = await supabase
                .from("users")
                .select("id, username, email, created_at")
                .eq("uid", user.id)
                .single();
            setUserData(userProfile);

            //book stats
            const { data: books } = await supabase
                .from("user_books")
                .select("id, book_id, status, rating, notes, created_at, books(title, author)")
                .eq("user_uid", user.id)
                .order("created_at", { ascending: false });

            setUserBookData(books || []);
        } catch (err) {
            console.error("Error loading profile:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Reload data whenever the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const getInitial = () => {
        if (!userData?.username) return "?";
        return userData.username.charAt(0).toUpperCase();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

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

    const latestBook = userBookData[0];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Profile Card */}
            <View style={styles.card}>
                <View style={styles.profileRow}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitial()}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.username}>{userData?.username || "User"}</Text>
                        <Text style={styles.joinDate}>Joined {formatDate(userData?.created_at)}</Text>
                    </View>
                </View>
            </View>

            {/* Latest Book Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Latest Book</Text>
                {latestBook ? (
                    <View style={styles.latestBookRow}>
                        <View style={[styles.bookImage, { backgroundColor: bookNameToColor(latestBook.books?.title || "") }]}>
                            <Text style={styles.bookInitial}>
                                {latestBook.books?.title?.charAt(0).toUpperCase() || "?"}
                            </Text>
                        </View>
                        <View style={styles.bookInfo}>
                            <Text style={styles.bookTitle} numberOfLines={2}>
                                {latestBook.books?.title || "Unknown Title"}
                            </Text>
                            <Text style={styles.bookAuthor} numberOfLines={1}>
                                {latestBook.books?.author || "Unknown Author"}
                            </Text>
                            <View style={styles.ratingRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesome
                                        key={star}
                                        name="star"
                                        size={12}
                                        color={star <= (latestBook.rating || 0) ? colors.colorOrange : colors.colorLightGray}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.emptyText}>No books added yet</Text>
                )}
                {latestBook?.notes && (
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText} numberOfLines={3}>{latestBook.notes}</Text>
                    </View>
                )}
            </View>

            {/* Statistics Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Statistics</Text>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Books</Text>
                    <Text style={styles.statValue}>{totalBooks}</Text>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <FontAwesome name="check-circle" size={20} color={colors.colorGreen} />
                        <Text style={styles.statBoxValue}>{finishedCount}</Text>
                        <Text style={styles.statBoxLabel}>Finished</Text>
                    </View>
                    <View style={styles.statBox}>
                        <FontAwesome name="hourglass-half" size={20} color={colors.colorBlue} />
                        <Text style={styles.statBoxValue}>{readingCount}</Text>
                        <Text style={styles.statBoxLabel}>Reading</Text>
                    </View>
                    <View style={styles.statBox}>
                        <FontAwesome name="book" size={20} color={colors.colorOrange} />
                        <Text style={styles.statBoxValue}>{planningCount}</Text>
                        <Text style={styles.statBoxLabel}>Planning</Text>
                    </View>
                    <View style={styles.statBox}>
                        <FontAwesome name="times-circle" size={20} color={colors.colorRed} />
                        <Text style={styles.statBoxValue}>{discontinuedCount}</Text>
                        <Text style={styles.statBoxLabel}>Dropped</Text>
                    </View>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Average Rating</Text>
                    <View style={styles.avgRatingRow}>
                        <FontAwesome name="star" size={18} color={colors.colorOrange} />
                        <Text style={styles.avgRatingValue}>{averageRating}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.backgroundColor,
    },
    card: {
        backgroundColor: colors.cardColor,
        borderRadius: radius.lg,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: 12,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: colors.cardColor,
        fontSize: 24,
        fontWeight: "bold",
    },
    profileInfo: {
        marginLeft: 16,
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.textMuted,
    },
    joinDate: {
        fontSize: 13,
        color: colors.textLightMuted,
        marginTop: 2,
    },
    latestBookRow: {
        flexDirection: "row",
    },
    bookImage: {
        width: 50,
        height: 70,
        borderRadius: radius.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    bookInitial: {
        color: colors.cardColor,
        fontSize: 20,
        fontWeight: "bold",
    },
    bookInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textMuted,
    },
    bookAuthor: {
        fontSize: 12,
        color: colors.textLightMuted,
        marginTop: 2,
    },
    ratingRow: {
        flexDirection: "row",
        marginTop: 4,
    },
    notesContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
        marginBottom: 4,
    },
    notesText: {
        fontSize: 13,
        color: "#333",
        fontStyle: "italic",
    },
    emptyText: {
        fontSize: 13,
        color: "#999",
        fontStyle: "italic",
    },
    statItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
    },
    statValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 12,
    },
    statBox: {
        alignItems: "center",
        flex: 1,
    },
    statBoxValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 4,
    },
    statBoxLabel: {
        fontSize: 10,
        color: "#666",
        marginTop: 2,
    },
    avgRatingRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avgRatingValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 4,
    },
});
