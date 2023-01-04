import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableHighlightBase } from 'react-native';
import { AudioContext } from '../context/AudioProvider'
import {LayoutProvider, RecyclerListView} from 'recyclerlistview'
import AudioListItem from '../component/AudioListItem';
import Screen from '../component/Screen';
import OptionModal from '../component/OptionModal';
import { Audio } from 'expo-av';
import { play, pause, resume, playAnother } from '../misc/audioController'


class AudioList extends Component {
  static contextType = AudioContext;

  layoutProvider = new LayoutProvider(i => 'audio', (type, dim) => {
    switch(type){
      case 'audio':
        dim.width = Dimensions.get('window').width;
        dim.height = 70;
        break;
      default:
        dim.width=0;
        dim.height=0;
    }
    
  })

  onPlaybackStatusUpdate = async playbackStatus => {
    if(playbackStatus.isLoaded && playbackStatus.isPlaying){
      this.context.updateState(this.context, {
        playbackDuration: playbackStatus.durationMillis,
        playbackPosition: playbackStatus.positionMillis,
      });
    }

    if(playbackStatus.didJustFinish) {
      const nextAudioIndex = this.context.currentAudioIndex + 1;
      //no audio to play
      if(nextAudioIndex >= this.context.totalAudioCount){
        this.context.playbackObj.unloadAsync();
        return this.context.updateState(this.context,{
          soundObj:null,
          currentAudio: this.context.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: [0],
          playbackPosition: null,
          playbackDuration: null,
        })
      }
      const audio = this.context.audioFiles[nextAudioIndex];

      const status = await playAnother(this.context.playbackObj, audio.uri);
      this.context.updateState(this.context,{
        soundObj:status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      })
    }
  }

  handleAudioPress = async audio => {
    const {soundObj, playbackObj, currentAudio, updateState, audioFiles} = this.context;

    //play
    if(soundObj === null){
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);

      updateState(this.context, {
        playbackObj: playbackObj, 
        soundObj: status,
        currentAudio: audio,
        isPlaying:true,
        currentAudioIndex: index,
      });
      return playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
    }

    //pause
    if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id){
      const status = await pause(playbackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: false,
      })
    }

    //resume
    if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id){
      const status = await resume(playbackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying:true,
      })
    }

    //playAnother
    if (soundObj.isLoaded && currentAudio.id !== audio.id ){
      const status = await  playAnother(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);

      return updateState(this.context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }
  }

  rowRenderer = (type, item, index, extendedState) => {
    return <AudioListItem 
      onAudioPress={ () => this.handleAudioPress(item)}
      title={item.filename} 
      isPlaying={extendedState.isPlaying}
      duration={item.duration}
      isActive={this.context.currentAudioIndex === index} 
      onOptionPress={() => {
          this.currentItem = item;
          this.setState({...this.state, optionModalVisibility: true});
        }}
        />
  }

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisibility: false,
    };
    
    this.currentItem = {};
  }

  render() {
    return (
        <AudioContext.Consumer>
          {({dataProvider, isPlaying}) => {
              return (
              <Screen>
                <RecyclerListView   dataProvider={dataProvider} 
                                    layoutProvider={this.layoutProvider}
                                    rowRenderer={this.rowRenderer}
                                    extendedState={{isPlaying}}>
                </RecyclerListView>
                <OptionModal 
                    onPlayPress={() => console.log('Playing')}
                    onAddPress={() => console.log('Added')}
                    currentItem ={this.currentItem}
                    visible={this.state.optionModalVisibility}
                    onClose={() => this.setState({...this.state, optionModalVisibility:false})}
                  />
              </Screen>
              )
          }}
        </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
container:{
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
}
})

export default AudioList;
