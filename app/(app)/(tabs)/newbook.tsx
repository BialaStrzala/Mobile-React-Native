import { addNewBook, getBookById } from '@/lib/bookmanager'
import { globalStyles } from '@/lib/globalStyle'
import { colors, radius } from '@/lib/theme'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleAdd = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert("Error", "Please enter both title and author")
      return
    }

    try {
      const result = await addNewBook(title.trim(), author.trim())
      Alert.alert("Success", result.message)
      setTitle("")
      setAuthor("")
      const newBook = await getBookById(result.bookId)
      router.push({
        pathname: "/(app)/(tabs)/editbook",
        params: {
          bookId: result?.bookId || result?.bookId.toString(),
          title: newBook?.title,
          author: newBook?.author,
          status: "Planning",
          rating: "",
          notes: "",
        },
      });
    }
    catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  return (
    <View style={globalStyles.mainContainer}>
      <View style={styles.centerWrapper}>
        <Text style={globalStyles.titleText}>Add a new book</Text>
        <View style={styles.card}>
          <View style={styles.container}>
            <Text style={styles.cardTitle}>Title</Text>
            <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={globalStyles.inputField}/>
            <Text style={styles.cardTitle}>Author</Text>
            <TextInput placeholder="Author" value={author} onChangeText={setAuthor} style={globalStyles.inputField} />
            <Button title="Add new book" onPress={handleAdd} color={colors.colorGreen} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default NewBook

const styles = StyleSheet.create({
  centerWrapper: {
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    padding: 15,
    gap: 15,
  },
  card: {
    backgroundColor: colors.cardColor,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: "80%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMuted,
  },
})