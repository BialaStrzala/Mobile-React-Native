import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

const NewBook = () => {
  return (
    <View>
      <Text>NewBook</Text>
      <View>
        <Text>Title</Text>
        <TextInput placeholder="Title" onChangeText={()=>{}} />
        <Text>Author</Text>
        <TextInput placeholder="Autor" onChangeText={()=>{}} />
        <Button title="Add" onPress={()=>{}} />
      </View>
    </View>
  )
}

export default NewBook

const styles = StyleSheet.create({})