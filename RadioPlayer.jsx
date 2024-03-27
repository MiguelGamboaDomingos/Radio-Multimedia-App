import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';


const radioStations = [
    { name: 'Radio Kairós', frequency: '98.4 FM', url: 'https://radios.vpn.sapo.pt/AO/radio9.mp3' },
    { name: 'Radio Luanda', frequency: '99.9 FM', url: 'https://radios.vpn.sapo.pt/AO/radio11.mp3' },
    { name: 'Radio Viana', frequency: '92.8 FM', url: 'https://radios.vpn.sapo.pt/AO/radio16.mp3' },
    { name: 'Radio Cinco', frequency: '94.5 FM', url: 'https://radios.vpn.sapo.pt/AO/radio5.mp3' },
    { name: 'Radio Mais', frequency: '99.1 FM', url: 'https://radios.justweb.pt/8050/stream' },
    { name: 'Radio Despertar', frequency: '91.0 FM', url: 'https://radios.vpn.sapo.pt/AO/radio15.mp3' },
    { name: 'Radio Unia', frequency: '92.3 FM', url: 'http://radios.vpn.sapo.pt/AO/radio2.mp3' },
    { name: 'Radio Escola', frequency: '94.5 FM', url: 'https://radios.vpn.sapo.pt/AO/radio1.mp3' },
  
];
class RadioPlayer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isPlaying: false,
        playbackInstance: null,
        currentRadioIndex: 0,
      };
    }
  
    async componentDidMount() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
        });
        this.loadAudio();
      } catch (e) {
        console.log(e);
      }
    }
  
    async loadAudio() {
      const { currentRadioIndex } = this.state;
      const radio = radioStations[currentRadioIndex];
      const playbackInstance = new Audio.Sound();
      const source = { uri: radio.url };
  
      const status = {
        shouldPlay: false,
      };
  
      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      await playbackInstance.loadAsync(source, status, false);
      this.setState({ playbackInstance });
    }
  
    onPlaybackStatusUpdate = (status) => {
      if (!status.isLoaded) {
        if (status.error) {
          console.log(`Encountered a fatal error during playback: ${status.error}`);
        }
      } else {
        this.setState({ isPlaying: status.isPlaying });
      }
    };
  
    handlePlayPause = async () => {
      const { isPlaying, playbackInstance } = this.state;
      if (isPlaying) {
        await playbackInstance.pauseAsync();
      } else {
        await playbackInstance.playAsync();
      }
    };
  
    handleChangeStation = async (index) => {
  const { currentRadioIndex, playbackInstance } = this.state;
  
  // Se a estação atual não for a mesma que está sendo selecionada,
  // pausa a reprodução da estação atual e carrega a nova estação.
  if (currentRadioIndex !== index) {
    if (playbackInstance) {
      await playbackInstance.pauseAsync();
    }
    this.setState({ currentRadioIndex: index }, this.loadAudio);
  }
};

  
    render() {
      const { isPlaying, currentRadioIndex } = this.state;
      const currentRadio = radioStations[currentRadioIndex];
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Rádio Multimedia Angola</Text>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{currentRadio.name}</Text>
              <Text style={styles.cardFrequency}>{currentRadio.frequency}</Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={this.handlePlayPause}>
              <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stationList}>
            {radioStations.map((station, index) => (
              <TouchableOpacity
                key={index}
                style={styles.stationItem}
                onPress={() => this.handleChangeStation(index)}
              >
                <Text
                  style={[
                    styles.stationText,
                    currentRadioIndex === index && styles.stationTextActive,
                  ]}
                >
                  {station.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    },
    cardContainer: {
      width: '90%',
      borderRadius: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    card: {
      flex: 1,
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    cardFrequency: {
      fontSize: 16,
      color: '#666',
    },
    playButton: {
      borderRadius: 50,
      backgroundColor: '#0099ff',
      padding: 10,
    },
    playButtonText: {
      fontSize: 18,
      color: '#fff',
      textAlign: 'center',
    },
    stationList: {
      width: '90%',
      marginTop: 20,
    },
    stationItem: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 3,
      marginBottom: 10,
    },
    stationText: {
      fontSize: 16,
      color: '#333',
    },
    stationTextActive: {
      color: '#0099ff',
    },
  });
  

export default RadioPlayer;
