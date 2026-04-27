import { supabase } from "@/lib/supabase";
import { colors, radius } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function BookCarousel() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      setBooks(data || []);
    };

    fetchBooks();
  }, []);

  const handleBookPress = (book: any) => {
    router.push({
      pathname: "/(app)/(tabs)/bookdetails",
      params: { bookId: book.id.toString() },
    });
  };

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {books.map((book, index) => (
        <Pressable
          key={index}
          style={styles.card}
          onPress={() => handleBookPress(book)}
        >
          <View style={styles.bookPlaceholder}>
            <Text style={styles.placeholderText}>
              {book.title.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          <View style={styles.arrowContainer}>
            <FontAwesome name="chevron-right" size={14} color={colors.primary} />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: width * 0.05,
  },
  card: {
    width: width * 0.65,
    marginHorizontal: width * 0.05,
    backgroundColor: colors.cardColor,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookPlaceholder: {
    backgroundColor: colors.primary,
    height: 100,
    width: 70,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  placeholderText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  author: {
    color: "#666",
    fontSize: 13,
  },
  arrowContainer: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
});
