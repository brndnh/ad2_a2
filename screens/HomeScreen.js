import React, { useEffect, useState } from 'react';
import {View, FlatList, StyleSheet,} from 'react-native';

import { loadData, saveData } from '../storage/storageHelpers';
import PhotoCard from '../components/PhotoCard';
import AppText from '../components/AppText';
import CustomButton from '../components/CustomButton';

import { COLORS } from '../styles/theme';    // Optional

export default function HomeScreen({ navigation }) {
    const [photos, setPhotos] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);

    useEffect(() => {
        const load = async () => {
            const stored = await loadData();
            setPhotos(stored);
            setFilteredPhotos(stored);
        };
        const unsubscribe = navigation.addListener('focus', load);
        return unsubscribe;
    }, [navigation]);

    const sortByDate = () => {
        const sorted = [...filteredPhotos].sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredPhotos(sorted);
    };

    const filterByNature = () => {
        const filtered = photos.filter(p => p.tags.includes('nature'));
        setFilteredPhotos(filtered);
    };

    const resetFilter = () => {
        setFilteredPhotos(photos);
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <CustomButton title="+ Add New" onPress={() => navigation.navigate('Add')} />
                <CustomButton title="Sort by Date" onPress={sortByDate} />
                <CustomButton title="Filter: Nature" onPress={filterByNature} />
                <CustomButton title="Reset" onPress={resetFilter} />
            </View>

            {filteredPhotos.length === 0 ? (
                <AppText style={styles.emptyText}>No photo entries found.</AppText>
            ) : (
                <FlatList
                    data={filteredPhotos}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <PhotoCard
                            data={item}
                            onEdit={() => navigation.navigate('Edit', { photo: item })}
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
        padding: 12,
        backgroundColor: COLORS.background,
    },
    topBar: {
        marginBottom: 10,
        gap: 8,
    },
    emptyText: {
        marginTop: 50,
        textAlign: 'center',
        color: COLORS.muted,
    },
});
