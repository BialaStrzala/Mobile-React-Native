import { deleteBookFromUser, getBookById, updateBookNotes, updateBookRating, updateBookStatus } from '@/lib/bookmanager';
import { globalStyles } from '@/lib/globalStyle';
import { colors, radius } from '@/lib/theme';
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface BookData{
  id: any,
  title: string,
  author: string,
}

const STATUS_OPTIONS = ['Planning', 'Reading', 'Finished', 'Discontinued'];

const EditBook = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [status, setStatus] = useState('Planning');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookId = params.bookId as string;
  const title = params.title as string;
  const author = params.author as string;

  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true);
        const data = await getBookById(bookId);
        setBookData(data);
      }
      catch (err: any) {
        setError(err.message);
        console.error("Error loading book data:", err);
      }
      finally{
        setLoading(false);
      }
    };
    loadBookData();
    
  }, [bookId]);

  // Update state when params change
  useEffect(() => {
    setStatus(params.status as string || 'Planning');
    setRating(parseInt(params.rating as string) || 0);
    setNotes(params.notes as string || '');
  }, [params.status, params.rating, params.notes]);

  const handleSave = async () => {
    try {
      await updateBookStatus(bookId, status);
      await updateBookRating(bookId, rating);
      await updateBookNotes(bookId, notes);
      Alert.alert('Success', 'Book updated successfully', [
        { text: 'OK', onPress: () => router.push("/(app)/(tabs)/mybooks") }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to remove this book from your list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBookFromUser(bookId);
              router.push("/(app)/(tabs)/mybooks");
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          }
        },
      ]
    );
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{bookData?.title || "Unknown Title"}</Text>
        <Text style={styles.author}>{bookData?.author || "Unknown Author"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          {STATUS_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.statusButton,
                status === option && styles.statusButtonActive,
              ]}
              onPress={() => setStatus(option)}
            >
              <Text
                style={[
                  styles.statusText,
                  status === option && styles.statusTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)}>
              <FontAwesome
                key={star}
                name="star"
                size={24}
                color={star <= rating ? colors.colorOrange : colors.colorLightGray}
                style={{ marginRight: 6 }}
              />
            </Pressable>
          ))}
          {rating > 0 && (
            <Pressable onPress={() => setRating(0)}>
              <Text style={styles.clearRating}>Clear</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add your notes here..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={handleSave} color={colors.colorGreen} />
        <Button title="Remove Book From Profile" onPress={handleDelete} color={colors.colorRed} />
      </View>
    </ScrollView>
  );
};

export default EditBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: colors.cardColor,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: colors.colorRed,
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.cardColor,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
  },
  statusText: {
    fontSize: 12,
    color: colors.primary,
  },
  statusTextActive: {
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 32,
    marginRight: 4,
  },
  clearRating: {
    marginLeft: 16,
    color: colors.textLightMuted,
    fontSize: 14,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: radius.sm,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
});