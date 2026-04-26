import { addUserBook, bookNameToColor, checkUserHasBook, getBookDetails } from "@/lib/bookmanager";
import { supabase } from "@/lib/supabase";
import { colors, radius } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";

interface BookDetails {
  id: number;
  title: string;
  author: string;
  created_at: string;
  averageRating: number;
  totalRatings: number;
  readingCount: number;
  planningCount: number;
  finishedCount: number;
}

interface UserBookData {
  id: string;
  status: string;
  rating: number | null;
  notes: string | null;
}

const BookDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const bookId = parseInt(params.bookId as string);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [userBook, setUserBook] = useState<UserBookData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookDetails();
  }, [bookId]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      const details = await getBookDetails(bookId);
      setBookDetails(details);
      
      const userBookData = await checkUserHasBook(bookId);
      setUserBook(userBookData);
    } catch (err) {
      console.error("Error loading book details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async () => {
    if (userBook) {
      // Navigate to edit page
      router.push({
        pathname: "/(app)/(tabs)/editbook",
        params: {
          bookId: userBook.id,
          title: bookDetails?.title,
          author: bookDetails?.author,
          status: userBook.status,
          rating: userBook.rating?.toString() || "",
          notes: userBook.notes || "",
        },
      });
    }
    //add book to user_books
    else {
      try{
        await addUserBook(bookId, bookDetails?.title || "Unknown", bookDetails?.author || "Unknown", "Planning");
        
        // Get the newly created user_book entry
        const { data: { user } } = await supabase.auth.getUser();
        const { data: newUserBook } = await supabase
          .from("user_books")
          .select("id")
          .eq("user_uid", user?.id)
          .eq("book_id", bookId)
          .single();
        
        router.push({
          pathname: "/(app)/(tabs)/editbook",
          params: {
            bookId: newUserBook?.id || bookId.toString(),
            title: bookDetails?.title,
            author: bookDetails?.author,
            status: "Planning",
            rating: "",
            notes: "",
          },
        });
      } catch (err: any) {
        console.error("Error assigning user a book:", err);
        Alert.alert("Error", err.message);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!bookDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Book not found</Text>
      </View>
    );
  }

  const bookColor = bookNameToColor(bookDetails.title);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Main Card */}
      <View style={styles.mainCard}>
        <View style={[styles.bookImage, { backgroundColor: bookColor }]}>
          <Text style={styles.bookInitial}>
            {bookDetails.title.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.bookInfo}>
          <Text style={styles.title}>{bookDetails.title}</Text>
          <Text style={styles.author}>{bookDetails.author}</Text>
          
          {/* Average Rating */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name="star"
                size={16}
                color={star <= Math.round(bookDetails.averageRating) ? "#f39c12" : "#ddd"}
              />
            ))}
            <Text style={styles.ratingText}>
                {bookDetails.averageRating/5}
            </Text>
            <Text>
                {bookDetails.totalRatings > 0 && bookDetails.averageRating > 0 ? `${bookDetails.totalRatings} ratings` : "No ratings yet"}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Community Reading</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FontAwesome name="book" size={20} color={colors.primary} />
            <Text style={styles.statNumber}>{bookDetails.planningCount}</Text>
            <Text style={styles.statLabel}>Planning</Text>
          </View>
          
          <View style={styles.statItem}>
            <FontAwesome name="hourglass-half" size={20} color={colors.primary} />
            <Text style={styles.statNumber}>{bookDetails.readingCount}</Text>
            <Text style={styles.statLabel}>Reading</Text>
          </View>
          
          <View style={styles.statItem}>
            <FontAwesome name="check-circle" size={20} color={colors.primary} />
            <Text style={styles.statNumber}>{bookDetails.finishedCount}</Text>
            <Text style={styles.statLabel}>Finished</Text>
          </View>
        </View>
      </View>

      {/* Add to List Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={userBook ? "Edit My Book" : "Add to My List"}
          onPress={handleAddToList}
          color={colors.primary}
        />
      </View>

      {/* User's Book Info (if already added) */}
      {userBook && (
        <View style={styles.userBookCard}>
          <Text style={styles.userBookTitle}>Your Copy</Text>
          <View style={styles.userBookRow}>
            <Text style={styles.userBookLabel}>Status:</Text>
            <Text style={styles.userBookValue}>{userBook.status}</Text>
          </View>
          {userBook.rating && (
            <View style={styles.userBookRow}>
              <Text style={styles.userBookLabel}>Your Rating:</Text>
              <View style={styles.userRatingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome
                    key={star}
                    name="star"
                    size={14}
                    color={star <= userBook.rating! ? "#f39c12" : "#ddd"}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default BookDetails;

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
  mainCard: {
    backgroundColor: colors.cardColor,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: "row",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookImage: {
    width: 80,
    height: 110,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  bookInitial: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  totalRatings: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: colors.cardColor,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  userBookCard: {
    backgroundColor: colors.primaryLight + "20",
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  userBookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  userBookRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userBookLabel: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
  userBookValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  userRatingStars: {
    flexDirection: "row",
  },
});