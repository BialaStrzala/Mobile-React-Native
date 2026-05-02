import { bookNameToColor, getBookDetails } from "@/lib/bookmanager";
import { supabase } from "@/lib/supabase";
import { colors, radius } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;

interface BookInfo {
    id: number;
    title: string;
    author: string;
    created_at?: string;
}

interface NewestBookCarouselProps {
    books?: BookInfo[];
}

export default function NewestBookCarousel({ books }: NewestBookCarouselProps) {
    const router = useRouter();
    const [bookDetails, setBookDetails] = useState<any[]>([]);
    const [carouselBooks, setCarouselBooks] = useState<BookInfo[]>(books || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (!books || books.length === 0) {
            fetchNewestBooks();
        } else {
            setCarouselBooks(books);
        }
        setLoading(false);
    }, [books]);

    const fetchNewestBooks = async () => {
        const { data } = await supabase
            .from("books")
            .select("id, title, author, created_at")
            .order("id", { ascending: false })
            .limit(5);

        if (data) {
            setCarouselBooks(data);
            // Fetch average ratings for each book
            const detailsPromises = data.map(async (book) => {
                try {
                    return await getBookDetails(book.id);
                } catch {
                    return { ...book, averageRating: 0, totalRatings: 0 };
                }
            });
            const details = await Promise.all(detailsPromises);
            setBookDetails(details);
        }
    };

    const getBookDetail = (bookId: number) => {
        return bookDetails.find(b => b.id === bookId);
    };

    const handleBookPress = (book: BookInfo) => {
        router.push({
            pathname: "/(app)/(tabs)/bookdetails",
            params: { bookId: book.id.toString() },
        });
    };

    const getInitial = (title: string) => {
        return title ? title.charAt(0).toUpperCase() : "?";
    };

    if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        );
      }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {carouselBooks.map((book, index) => {
                    const detail = getBookDetail(book.id);
                    const bookColor = bookNameToColor(book.title);
                    const avgRating = detail?.averageRating || 0;
                    const totalRatings = detail?.totalRatings || 0;

                    return (
                        <Pressable
                            key={index}
                            style={styles.card}
                            onPress={() => handleBookPress(book)}
                        >
                            <View style={styles.cardContent}>
                                <View style={[styles.bookCover, { backgroundColor: bookColor }]}>
                                    <Text style={styles.bookInitial}>
                                        {getInitial(book.title)}
                                    </Text>
                                </View>
                                <View style={styles.bookInfo}>
                                    <Text style={styles.bookTitle} numberOfLines={2}>
                                        {book.title}
                                    </Text>
                                    <Text style={styles.bookAuthor} numberOfLines={1}>
                                        {book.author}
                                    </Text>
                                    <View style={styles.ratingContainer}>
                                        <View style={styles.starsRow}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FontAwesome
                                                    key={star}
                                                    name="star"
                                                    size={10}
                                                    color={star <= Math.round(avgRating) ? colors.colorOrange : colors.colorLightGray}
                                                />
                                            ))}
                                        </View>
                                        <Text style={styles.ratingText}>
                                            {avgRating > 0 ? `${avgRating}/5` : "N/A"}
                                        </Text>
                                    </View>
                                    {totalRatings > 0 && (
                                        <Text style={styles.totalRatings}>({totalRatings} ratings)</Text>
                                    )}
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    scrollContent: {
        paddingHorizontal: 0,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.cardColor,
        borderRadius: radius.lg,
        padding: 12,
        marginRight: 12,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginVertical: 8,
    },
    cardContent: {
        flexDirection: "row",
    },
    bookCover: {
        width: 60,
        height: 80,
        borderRadius: radius.sm,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    bookInitial: {
        color: colors.cardColor,
        fontSize: 24,
        fontWeight: "bold",
    },
    bookInfo: {
        flex: 1,
        justifyContent: "center",
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: 2,
    },
    bookAuthor: {
        fontSize: 12,
        color: colors.textLightMuted,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    starsRow: {
        flexDirection: "row",
    },
    ratingText: {
        fontSize: 11,
        color: colors.textLightMuted,
        marginLeft: 4,
    },
    totalRatings: {
        fontSize: 10,
        color: colors.textLightMuted,
        marginTop: 2,
    },
});