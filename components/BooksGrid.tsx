import { bookNameToColor } from "@/lib/bookmanager";
import { colors, radius } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

// For user books (nested structure - books is an array from Supabase)
interface UserBookData {
  id: string;
  book_id: number;
  status: string;
  rating: number | null;
  notes: string | null;
  books: {
    id: number;
    title: string;
    author: string;
  }[];
}

// For all books (flat structure)
interface FlatBookData {
  id: number;
  title: string;
  author: string;
  rating: number | null;
}

// Type to handle both structures
type BookData = UserBookData | FlatBookData;

interface BookCardProps {
  book: BookData;
  onPress: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  // Handle both nested (array) and flat structures
  let title: string;
  let author: string;
  let rating: number;
  
  if ('books' in book && Array.isArray(book.books) && book.books.length > 0) {
    // User book with nested array
    title = book.books[0].title;
    author = book.books[0].author;
    rating = (book as UserBookData).rating || 0;
  } else if ('books' in book && book.books && typeof book.books === 'object') {
    // User book with object (legacy)
    title = (book.books as any).title;
    author = (book.books as any).author;
    rating = (book as UserBookData).rating || 0;
  } else {
    // Flat book allbooks.tsx
    title = (book as FlatBookData).title;
    author = (book as FlatBookData).author;
    rating = (book as FlatBookData).rating || 0;
  }
  
  const bookColor = bookNameToColor(title);
  const starRating = rating;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        {/* Book placeholder and stars in same row */}
        <View style={styles.bookRow}>
          <View style={[styles.bookImagePlaceholder, { backgroundColor: bookColor }]}>
            <Text style={styles.bookPlaceholderText}>
              {title.charAt(0).toUpperCase()}
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
            {title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {author}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

interface BooksGridProps {
  books: BookData[];
  onBookPress: (book: any) => void;
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
          <View key={`empty-${i}`} style={styles.hiddenCard} />
        ))}
    </View>
  );

  return (
    <FlatList
      style={styles.list}
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
  hiddenCard:{
    flex: 1,
    backgroundColor: "transparent",
    marginHorizontal: 4,
    minHeight: 140,
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
  list: {
    flex: 1,
  },
});

export default BooksGrid;