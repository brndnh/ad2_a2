import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import sampleData from '../data/sampleData';
import { saveData, clearData } from '../storage/storageHelpers';
import CustomButton from '../components/CustomButton';
import AppText from '../components/AppText';
import { COLORS, FONTS } from '../styles/theme';

export default function DataLoaderScreen() {
    const handleLoad = async () => {
        try {
            await saveData(sampleData);
            Alert.alert('Success', 'Sample data loaded into storage.');
        } catch (e) {
            Alert.alert('Error', 'Could not load sample data.');
            console.error(e);
        }
    };

    const handleClear = async () => {
        try {
            await clearData();
            Alert.alert('Success', 'All data cleared from storage.');
        } catch (e) {
            Alert.alert('Error', 'Could not clear data.');
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <AppText style={styles.title}>Data Loader</AppText>
            <CustomButton title="Load Sample Data" onPress={handleLoad} />
            <CustomButton title="Clear All Data" onPress={handleClear} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 24,
        justifyContent: 'center',
        gap: 16,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: 20,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 20,
    },
});
