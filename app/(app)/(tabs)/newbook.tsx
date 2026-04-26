import { addNewBook } from '@/lib/bookmanager'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

const NewBook = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState("Planning")

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
      setStatus("Planning")
      router.push("/(tabs)/mybooks")
    } catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  return (
    <View>
      <Text>NewBook</Text>
      <View>
        <Text>Title</Text>
        <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
        <Text>Author</Text>
        <TextInput placeholder="Author" value={author} onChangeText={setAuthor} />
        <Button title="Add" onPress={handleAdd} />
        <TextInput placeholder="Status" value={status} onChangeText={setStatus} />
        {/* Choice input: Planning, Reading, Finished, Discontinued */}
      </View>
    </View>
  )
}

export default NewBook

const styles = StyleSheet.create({})