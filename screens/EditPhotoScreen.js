// appears after selecting a photo to upload.

import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { loadData, saveData } from '../storage/storageHelpers';

import AppText from '../components/AppText';
import CustomButton from '../components/CustomButton';

export default function EditPhotoScreen({ route, navigation }) {
    const { photo } = route.params;

    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (photo) {
            setTitle(photo.title);
            setTags(photo.tags.join(', '));
            setNotes(photo.notes);
            setImageUri(photo.imageUri);
            setDate(photo.date);
        }
    }, [photo]);

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
        if (!title || !tags || !imageUri) {
            Alert.alert('Please fill all required fields.');
            return;
        }

        const updatedEntry = {
            ...photo,
            title,
            tags: tags.split(',').map(tag => tag.trim()),
            notes,
            imageUri,
        };

        const all = await loadData();
        const updatedList = all.map(p =>
            p.id === photo.id ? updatedEntry : p
        );
        await saveData(updatedList);

        navigation.navigate('Photo Log');
    };

    return (
        <View style={styles.container}>
            <CustomButton title="Change Image 📸" onPress={pickImage} />
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

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

            <CustomButton title="Save Changes" onPress={handleSave} />
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
