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
import { COLORS, FONTS } from '../styles/theme';

export default function EditPhotoScreen({ route, navigation }) {
    const { photo } = route.params;

    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [date, setDate] = useState('');

    // Request permissions on mount
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need media access to pick images.');
            }
        })();
    }, []);

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
        const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert('Permission denied', 'You need to grant media access to pick an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.IMAGE,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
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
                placeholderTextColor={COLORS.muted}
                value={title}
                onChangeText={setTitle}
            />

            <AppText style={styles.label}>Tags</AppText>
            <TextInput
                style={styles.input}
                placeholder="e.g. sunset, travel"
                placeholderTextColor={COLORS.muted}
                value={tags}
                onChangeText={setTags}
            />

            <AppText style={styles.label}>Notes</AppText>
            <TextInput
                style={styles.input}
                placeholder="Optional notes..."
                placeholderTextColor={COLORS.muted}
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
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
        gap: 12,
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        fontFamily: FONTS.bold,
        marginTop: 10,
        marginBottom: 4,
    },
    input: {
        backgroundColor: COLORS.card,
        color: COLORS.text,
        borderBottomColor: COLORS.border,
        borderBottomWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontFamily: FONTS.regular,
        fontSize: 16,
        borderRadius: 6,
    },
    dateText: {
        fontSize: 14,
        color: COLORS.muted,
        fontFamily: FONTS.regular,
        marginVertical: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: COLORS.card,
    },
});
