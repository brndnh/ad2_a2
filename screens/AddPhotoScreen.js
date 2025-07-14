import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveData, loadData } from '../storage/storageHelpers';

import AppText from '../components/AppText';
import CustomButton from '../components/CustomButton';

export default function AddPhotoScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [date] = useState(new Date().toISOString().slice(0, 10)); // today

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        const newEntry = {
            id: Date.now().toString(),
            title,
            tags: tags.split(',').map(tag => tag.trim()),
            date,
            notes,
            imageUri: imageUri || Image.resolveAssetSource(require('../assets/placeholder.png')).uri,
        };

        const existing = await loadData();
        const updated = [...existing, newEntry];
        await saveData(updated);

        navigation.navigate('Photo Log');
    };

    return (
        <View style={styles.container}>
            <CustomButton title="Pick Image 📸" onPress={pickImage} />
            <Image
                source={
                    imageUri
                        ? { uri: imageUri }
                        : require('../assets/placeholder.png')
                }
                style={styles.image}
            />

            <AppText style={styles.label}>Title</AppText>
            <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
            />

            <AppText style={styles.label}>Tags</AppText>
            <TextInput
                style={styles.input}
                placeholder="e.g. sunset, travel"
                value={tags}
                onChangeText={setTags}
            />

            <AppText style={styles.label}>Notes</AppText>
            <TextInput
                style={styles.input}
                placeholder="Optional notes..."
                value={notes}
                onChangeText={setNotes}
                multiline
            />

            <AppText style={styles.dateText}>Date: {date}</AppText>

            <CustomButton title="Save Photo Entry" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 12,
        flex: 1,
        backgroundColor: '#fff',
    },
    label: {
        marginTop: 10,
        fontSize: 14,
        marginBottom: 4,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        marginVertical: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
});
