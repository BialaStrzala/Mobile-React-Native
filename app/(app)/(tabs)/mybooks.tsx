import BooksGrid from '@/components/BooksGrid'
import { pullUserBooks } from '@/lib/bookmanager'
import { globalStyles } from '@/lib/globalStyle'
import { colors } from '@/lib/theme'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

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
  }[];
}

const MyBooks = () => {
  const router = useRouter();
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const userBooks = await pullUserBooks();
      setBooks(userBooks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  const handleBookPress = (book: BookData) => {
    const bookTitle = book.books[0]?.title || "";
    const bookAuthor = book.books[0]?.author || "";
    router.push({
      pathname: "/(app)/(tabs)/editbook",
      params: {
        bookId: book.book_id,
        title: bookTitle,
        author: bookAuthor,
        status: book.status,
        rating: book.rating?.toString() || "",
        notes: book.notes || ""
      }
    });
  };

  if (loading) {
    return (
      <View style={globalStyles.mainContainer}>
        <View style={globalStyles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.mainContainer}>
        <View style={globalStyles.loadingCenter}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.mainContainer}>
      <Text style={globalStyles.titleText}>My Books</Text>
      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No books yet!</Text>
          <Text style={styles.emptySubtext}>Add your first book to get started.</Text>
        </View>
      ) : (
        <BooksGrid books={books} onBookPress={handleBookPress} />
      )}
    </View>
  )
}

export default MyBooks

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textLightMuted,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLightMuted,
    textAlign: "center",
  },
  errorText: {
    color: colors.colorRed,
    padding: 16,
    textAlign: "center",
  },
})