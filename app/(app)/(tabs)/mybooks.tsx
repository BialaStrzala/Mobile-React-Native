import BooksGrid from '@/components/BooksGrid'
import { pullUserBooks } from '@/lib/bookmanager'
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
  };
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

  // Reload data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );


  const handleBookPress = (book: BookData) => {
    router.push({
      pathname: "/(app)/(tabs)/editbook",
      params: { 
        bookId: book.id,
        title: book.books.title,
        author: book.books.author,
        status: book.status,
        rating: book.rating?.toString() || "",
        notes: book.notes || ""
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Books</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  errorText: {
    color: "#e74c3c",
    padding: 16,
    textAlign: "center",
  },
})