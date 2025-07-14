import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TextInput,
} from 'react-native';

import { loadData, saveData } from '../storage/storageHelpers';
import PhotoCard from '../components/PhotoCard';
import AppText from '../components/AppText';
import CustomButton from '../components/CustomButton';
import { COLORS, FONTS } from '../styles/theme';

export default function HomeScreen({ navigation }) {
    const [photos, setPhotos] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);
    const [searchTags, setSearchTags] = useState('');

    // Load & sort (newest first) whenever screen gains focus
    useEffect(() => {
        const load = async () => {
            const stored = await loadData();
            const sorted = stored.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            setPhotos(sorted);
            setFilteredPhotos(sorted);
        };
        const unsubscribe = navigation.addListener('focus', load);
        return unsubscribe;
    }, [navigation]);

    // When search is cleared, reset to full sorted list
    useEffect(() => {
        if (searchTags.trim() === '') {
            setFilteredPhotos(photos);
        }
    }, [searchTags, photos]);

    // Filter by comma separated tags
    const applyFilter = () => {
        const terms = searchTags
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);

        if (terms.length === 0) {
            setFilteredPhotos(photos);
        } else {
            setFilteredPhotos(
                photos.filter(photo => {
                    const lowerTags = photo.tags.map(t => t.toLowerCase());
                    return terms.every(term => lowerTags.includes(term));
                })
            );
        }
    };

    // Reset search and show all
    const resetFilter = () => {
        setSearchTags('');
        setFilteredPhotos(photos);
    };

    return (
        <View style={styles.container}>
            {/* Top Bar: Add and Reset */}
            <View style={styles.topBar}>
                <CustomButton
                    title="+ Add New"
                    onPress={() => navigation.navigate('Add')}
                />
                <CustomButton title="Reset" onPress={resetFilter} />

                {/* Sample Data Button */}
                <CustomButton
                    title="Load Sample Data"
                    onPress={() => navigation.navigate('DataLoader')}
                />
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Filter by tag(s)…"
                    placeholderTextColor={COLORS.muted}
                    value={searchTags}
                    onChangeText={setSearchTags}
                    onSubmitEditing={applyFilter}
                />
                <CustomButton
                    title="Filter"
                    onPress={applyFilter}
                    style={styles.searchBtn}
                />
            </View>

            {/* Empty State or Photo List */}
            {filteredPhotos.length === 0 ? (
                <AppText style={styles.emptyText}>No photo entries found.</AppText>
            ) : (
                <FlatList
                    data={filteredPhotos}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <PhotoCard
                            data={item}
                            onEdit={() =>
                                navigation.navigate('Edit', { photo: item })
                            }
                            onDelete={async () => {
                                const updated = photos.filter(p => p.id !== item.id);
                                setPhotos(updated);
                                setFilteredPhotos(updated);
                                await saveData(updated);
                            }}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 12,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: COLORS.card,
        color: COLORS.text,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontFamily: FONTS.regular,
        marginRight: 8,
    },
    searchBtn: {
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    emptyText: {
        marginTop: 50,
        textAlign: 'center',
        color: COLORS.muted,
        fontFamily: FONTS.regular,
    },
});
