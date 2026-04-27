import { deleteBookFromUser, updateBookNotes, updateBookRating, updateBookStatus } from '@/lib/bookmanager';
import { colors, radius } from '@/lib/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const STATUS_OPTIONS = ['Planning', 'Reading', 'Finished', 'Discontinued'];

const EditBook = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [status, setStatus] = useState(params.status as string || 'Planning');
  const [rating, setRating] = useState(parseInt(params.rating as string) || 0);
  const [notes, setNotes] = useState(params.notes as string || '');

  const bookId = params.bookId as string;
  const title = params.title as string;
  const author = params.author as string;

  const handleSave = async () => {
    try {
      await updateBookStatus(bookId, status);
      await updateBookRating(bookId, rating);
      await updateBookNotes(bookId, notes);
      Alert.alert('Success', 'Book updated successfully', [
        { text: 'OK', onPress: () => router.back() }
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
              router.back();
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
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
              <Text
                style={[
                  styles.star,
                  { color: star <= rating ? colors.colorOrange : colors.colorLightGray },
                ]}
              >
                ★
              </Text>
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
        <Button title="Delete Book" onPress={handleDelete} color={colors.colorRed} />
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
    color: colors.primary,
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