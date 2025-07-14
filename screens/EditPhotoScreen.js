import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Image,
    Alert,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Request permission on mount
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need media access to pick images.');
            }
        })();
    }, []);

    // Populate fields from route params
    useEffect(() => {
        if (photo) {
            setTitle(photo.title);
            setTags(photo.tags.join(', '));
            setNotes(photo.notes);
            setImageUri(photo.imageUri);
            setDate(photo.date);
            setSelectedDate(new Date(photo.date));
        }
    }, [photo]);

    const pickImage = async () => {
        const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert('Permission denied', 'You need to grant media access to pick an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const toggleDatePicker = () => setShowPicker(true);

    const handleDateChange = (event, newDate) => {
        setShowPicker(Platform.OS === 'ios');
        if (newDate) {
            setSelectedDate(newDate);
            setDate(newDate.toISOString().slice(0, 10));
        }
    };

    const handleSave = async () => {
        // if (!title || !tags || !imageUri) {
        //     Alert.alert('Please fill all required fields.');
        //     return;
        // }

        const updatedEntry = {
            ...photo,
            title,
            tags: tags.split(',').map(tag => tag.trim()),
            notes,
            imageUri,
            date,
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

            <AppText style={styles.label}>Date</AppText>
            <CustomButton title="Edit Date" onPress={toggleDatePicker} />
            <AppText style={styles.dateText}>{date}</AppText>

            {showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}

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
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: COLORS.card,
    },
});
