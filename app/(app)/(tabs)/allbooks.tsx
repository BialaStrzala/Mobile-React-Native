import BooksGrid from '@/components/BooksGrid'
import { pullAllBooksByFilter } from '@/lib/bookmanager'
import { globalStyles } from '@/lib/globalStyle'
import { colors, radius } from '@/lib/theme'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Button, Pressable, StyleSheet, Text, View } from 'react-native'

interface BookData {
  id: number;
  title: string;
  author: string;
  rating: number | null;
}

const FILTER_OPTIONS = ['Title', 'Author', 'Newest'];

const AllBooks = () => {
  const router = useRouter();
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('Title');

  const loadBooks = useCallback(async (filter: string = 'Title') => {
    try {
      setLoading(true);
      const userBooks = await pullAllBooksByFilter(filter);
      setBooks(userBooks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks(selectedFilter);
    }, [loadBooks])
  );

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleApplyFilter = () => {
    loadBooks(selectedFilter);
  };

  const handleBookPress = (book: any) => {
    router.push({
      pathname: "/(app)/(tabs)/bookdetails",
      params: {
        bookId: book.id.toString(),
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
      <Text style={globalStyles.titleText}>All Books</Text>
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          {FILTER_OPTIONS.map((filter) => (
            <Pressable
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>
        <Button title="Apply" onPress={handleApplyFilter} color={colors.primary} />
      </View>

      <View style={styles.marginView} >
        <Pressable onPress={() => router.push("/(app)/(tabs)/newbook")}
          style={({ pressed }) => [
            globalStyles.tertiaryButton, pressed && globalStyles.tertiaryButtonPressed,]}>
          <Text style={globalStyles.mainButtonText}>Add a new book</Text>
        </Pressable>
      </View>

      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No books found.</Text>
        </View>
      ) : (
        <View style={styles.marginTop}><BooksGrid books={books} onBookPress={handleBookPress} />
        </View>
      )}
    </View>
  )
}

export default AllBooks

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterButtons: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.cardColor,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    color: colors.colorRed,
    padding: 16,
    textAlign: 'center',
  },
  marginView: {
    marginLeft: 16,
    marginRight: 16,
  },
  marginTop:{
    marginTop: 8,
  }
})