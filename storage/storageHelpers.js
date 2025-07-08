import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'PHOTO_LOG_ENTRIES';

export const saveData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.log('Save error:', error);
  }
};

export const loadData = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.log('Load error:', error);
    return [];
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.log('Clear error:', error);
  }
};
