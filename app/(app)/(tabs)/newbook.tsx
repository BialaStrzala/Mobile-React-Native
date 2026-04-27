import { addNewBook, getBookById } from '@/lib/bookmanager'
import { globalStyles } from '@/lib/globalStyle'
import { colors } from '@/lib/theme'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

const NewBook = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  //const [status, setStatus] = useState("Planning")

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
      //setStatus("Planning")
      //router.push("/(tabs)/mybooks")
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
        <View style={globalStyles.card}>
          <Text style={globalStyles.titleText}>Welcome back!</Text>
          <View style={styles.container}>
            <Text>Title</Text>
            <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
            <Text>Author</Text>
            <TextInput placeholder="Author" value={author} onChangeText={setAuthor} />
            <Button title="Add" onPress={handleAdd} color={colors.colorGreen} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default NewBook

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    marginTop: 50,
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    padding: 15,
    gap: 15,
  },
})