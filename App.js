import React, { useState } from 'react'
import { Text, View, StyleSheet, Image, Alert, TouchableOpacity, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing'
import uploadToAnonymousFiles from 'anonymous-files'

const App = () => {

  const [selectedImage, setSelectedImage] = useState(null)

  const openImagePickerAsinc = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert('Permision to access camera is required')
      return
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync()
    if (pickerResult.cancelled === true) {
      return
    }
    if (Platform.OS === 'web') {
      const remoteUri = await uploadToAnonymousFiles(pickerResult.uri)
      setSelectedImage({ localUri: pickerResult.uri, remoteUri })
    }else{
      setSelectedImage({ localUri: pickerResult.uri })

    }

  }

  const openShareDialog = async () => {
    if (!await Sharing.isAvailableAsync()) {
      Alert('The image is available for sharing at: ' + selectedImage.remoteUri)
      return
    }

    await Sharing.shareAsync(selectedImage.localUri)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> 千本桜 </Text>
      <TouchableOpacity
        onPress={openImagePickerAsinc}
      >
        <Image
          source={{
            uri: selectedImage !== null ? selectedImage.localUri : "https://picsum.photos/id/82/200/200"
          }}
          style={styles.img}
        />
      </TouchableOpacity>
      {
        selectedImage ?(
          <TouchableOpacity
        onPress={openShareDialog}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
        ) : (
          <View/>
        )
      }
    </View>
  )

}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#292929' },
  title: { fontSize: 30, color: "#fff" },
  img: { height: 200, width: 200, borderRadius: 100 },
  button: {
    backgroundColor: '#dc7497',
    padding: 7,
    marginTop: 10,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 20
  }
})
export default App

