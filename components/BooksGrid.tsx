import { bookNameToColor } from "@/lib/bookmanager";
import { colors, radius } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface BookData {
  id: string;
  book_id: number;
  status: string;
  rating: number | null;
  notes: string | null;
  books: {
    id: number;
    title: string;
    author: string;
  };
}

interface BookCardProps {
  book: BookData;
  onPress: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  const bookColor = bookNameToColor(book.books.title);
  const starRating = book.rating || 0;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        {/* Book placeholder and stars in same row */}
        <View style={styles.bookRow}>
          <View style={[styles.bookImagePlaceholder, { backgroundColor: bookColor }]}>
            <Text style={styles.bookPlaceholderText}>
              {book.books.title.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name="star"
                size={12}
                color={star <= starRating ? colors.colorOrange : colors.colorLightGray}
              />
            ))}
          </View>
        </View>

        {/* Book title and author below */}
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {book.books.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {book.books.author}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

interface BooksGridProps {
  books: BookData[];
  onBookPress: (book: BookData) => void;
  numColumns?: number;
}

const BooksGrid: React.FC<BooksGridProps> = ({
  books,
  onBookPress,
  numColumns = 3
}) => {
  // Group books into rows of 3
  const rows: BookData[][] = [];
  for (let i = 0; i < books.length; i += numColumns) {
    rows.push(books.slice(i, i + numColumns));
  }

  const renderRow = ({ item: row, index }: { item: BookData[]; index: number }) => (
    <View style={styles.row} key={index}>
      {row.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onPress={() => onBookPress(book)}
        />
      ))}
      {/* Fill empty slots if last row has less than 3 items */}
      {row.length < numColumns &&
        Array.from({ length: numColumns - row.length }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.card} />
        ))}
    </View>
  );

  return (
    <FlatList
      data={rows}
      renderItem={renderRow}
      keyExtractor={(_, index) => `row-${index}`}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardColor,
    borderRadius: radius.md,
    marginHorizontal: 4,
    minHeight: 140,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 8,
    flex: 1,
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  bookImagePlaceholder: {
    width: "60%",
    height: "100%",
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  bookPlaceholderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  starsContainer: {
    marginLeft: 8,
    flexDirection: "column",
  },
  bookInfo: {
    marginTop: 4,
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 10,
    color: "#666",
  },
});

export default BooksGrid;