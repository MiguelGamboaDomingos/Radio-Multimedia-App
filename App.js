// App.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import RadioPlayer from './RadioPlayer';

export default function App() {
  return (
    <View style={styles.container}>
      <RadioPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
