import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function PhotoCard({ data, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: data.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.meta}>Tags: {data.tags.join(', ')}</Text>
        <Text style={styles.meta}>Date: {data.date}</Text>
        <Text style={styles.notes}>{data.notes}</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.actionBtn}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.actionBtn}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#555',
  },
  notes: {
    fontSize: 13,
    marginTop: 4,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    width: 140,
  },
  actionBtn: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
