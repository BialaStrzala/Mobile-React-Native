import StatisticsBox from "@/components/StatisticsBox";
import { bookNameToColor } from "@/lib/bookmanager";
import { globalStyles } from "@/lib/globalStyle";
import { supabase } from "@/lib/supabase";
import { colors, radius } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
    }[]
}

interface BookData{
    id: any,
    title: string,
    author: string,
}

const ProfileScreen = () => {
    const [userData, setUserData] = useState<UserAuthData | null>(null);
    const [userBookData, setUserBookData] = useState<UserBookData[]>([]);
    const [latestBookData, setLatestBookData] = useState<BookData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

            //latest book title+author
            const { data: latestBook } = await supabase
                .from("books")
                .select("id, title, author")
                .eq("id", userBookData[0]?.book_id)
                .single();

            setUserBookData(books || []);
            setLatestBookData(latestBook);
            //console.log("Latest book data:", latestBook);
        } catch (err) {
            console.error("Error loading profile:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Reload data
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
        <ScrollView style={globalStyles.mainContainer} contentContainerStyle={globalStyles.scrollViewContent}>
            <Text style={globalStyles.titleText}>User Profile</Text>
            {/* Profile Card */}
            <View style={globalStyles.card}>
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
            <View style={globalStyles.card}>
                <Text style={styles.cardTitle}>Latest Book</Text>
                {latestBook ? (
                    <Pressable onPress={() => {router.push({pathname: "/(app)/(tabs)/bookdetails",params: {bookId: latestBook.book_id.toString(),}});}}>
                    <View style={styles.latestBookRow}>
                        <View style={[styles.bookImage, { backgroundColor: bookNameToColor(latestBook.books?.[0]?.title || "") }]}>
                            <Text style={styles.bookInitial}>
                                {latestBookData?.title?.charAt(0).toUpperCase() || "?"}
                            </Text>
                        </View>
                        <View style={styles.bookInfo}>
                            <Text style={styles.bookTitle} numberOfLines={2}>
                                {latestBookData?.title || "Unknown Title"}
                            </Text>
                            <Text style={styles.bookAuthor} numberOfLines={1}>
                                {latestBookData?.author || "Unknown Author"}
                            </Text>
                            <View style={styles.ratingRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesome
                                        key={star}
                                        name="star"
                                        size={16}
                                        style={{ marginRight: 4 }}
                                        color={star <= (latestBook.rating || 0) ? colors.colorOrange : colors.colorLightGray}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                    </Pressable>
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
            <StatisticsBox
                totalBooks={totalBooks}
                finishedCount={finishedCount}
                readingCount={readingCount}
                planningCount={planningCount}
                discontinuedCount={discontinuedCount}
                averageRating={averageRating}
            />
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
