import React, { useState } from "react";

import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as ExpoSharing from "expo-sharing";

import fav from "./assets/favicon.png";

interface ImageSelected {
  localUri: string
}

export default function App() {
    const [imageSelected, setImageSelected] = useState<ImageSelected|null>(null);

    const startImagePicker = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('infelizmente não foi autorizado selecionar imagens...');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (pickerResult.cancelled === true) return;

      const imageObj = { localUri: pickerResult.uri } as ImageSelected;

      setImageSelected(imageObj);
    }

    const openShareDialogAsync = async () => {
        if (imageSelected === null) {
            alert('por favor selecione uma imagem');
            return;
        }

        await ExpoSharing.shareAsync(
            imageSelected.localUri
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.text}>
                <Text style={styles.title}>Bem vindo ao image selector!</Text>
            </View>
            <View style={styles.imageArea}>
                {
                  imageSelected 
                    ? <Image style={styles.image} source={{ uri: imageSelected.localUri }} />
                    : <Image style={styles.image} source={fav} />
                }
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={startImagePicker}>
                    <Text style={styles.buttonText}>Selecionar Imagem</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.buttonShare]}
                    onPress={openShareDialogAsync}
                >
                    <Ionicons 
                        name="share-outline"
                        size={16}
                        style={styles.buttonText}
                    />
                    <Text style={styles.buttonText}>Compartilhar</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },
    title: {
        fontSize: 22,
        color: "#333",
    },
    imageArea: {
        flex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },
    actions: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: Dimensions.get("screen").width,
    },
    button: {
        borderWidth: 1,
        borderColor: "#333",
        padding: 10,
        ...Platform.select({
            ios: {
                borderRadius: 5,
            },
            android: {
                borderRadius: 15,
            },
        }),
    },
    buttonShare: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "#333",
    },
    image: {
      width: 100,
      height: 100,
    }
});
