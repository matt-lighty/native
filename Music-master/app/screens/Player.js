import React , {useContext, useState} from 'react';
import {View, StyleSheet, Text, Dimensions, ColorPropType} from 'react-native';
import Screen from '../component/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider';
import PlayerButton from '../component/playerButton';
import { AudioContext } from '../context/AudioProvider';
import { pause, play, playAnother, resume } from '../misc/audioController';


const {width} = Dimensions.get('window');

const Player = () => {
    const [currentPosition, setCurrentPosition] =useState(0);
    const context = useContext(AudioContext);
    const {playbackPosition, playbackDuration} = context;

    const handlePlayPause = async () => {
        
        // //play 1st time
        // if(context.soundObj ===null) {
        //    
        // }

        //pause
        if( context.soundObj && context.soundObj.isPlaying){
            const status = await pause(context.playbackObj);
            return context.updateState(context, {
                soundObj: status,
                isPlaying: false,
            })
        }

        //resume
        if( context.soundObj && !context.soundObj.isPlaying){
            const status = await resume(context.playbackObj);
            return context.updateState(context, {
                soundObj: status,
                isPlaying: true,
            })
        }

    }

    const handlePrev = async () => {
        const {isLoaded} = await context.playbackObj.getStatusAsync();
        const isFirstAudio = context.currentAudioIndex <= 0;
        let audio = context.audioFiles[context.currentAudioIndex -1];
        let index;
        let status;
         
        // if(!isLoaded && !isLastAudio){
        //     index = context.currentAudioIndex +1;
        //     status = await play(context.playbackObj, audio.uri)
        // }

        if(isLoaded && !isFirstAudio){
            index = context.currentAudioIndex -1;
            status = await playAnother(context.playbackObj, audio.uri)
        }

        if(isFirstAudio){
            index = context.totalAudioCount -1;
            audio = context.audioFiles[index];
            status = await playAnother(context.playbackObj, audio.uri)
        }


        context.updateState(context, {
            playbackObj: context.playbackObj, 
            soundObj: status,
            currentAudio: audio,
            isPlaying:true,
            currentAudioIndex: index,
          });
          //storeAudioForNExtOpening(audio, index)
    }

    const handleNext = async () => {
        const {isLoaded} = await context.playbackObj.getStatusAsync();
        const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
        let audio = context.audioFiles[context.currentAudioIndex +1];
        let index;
        let status;
         
        // if(!isLoaded && !isLastAudio){
        //     index = context.currentAudioIndex +1;
        //     status = await play(context.playbackObj, audio.uri)
        // }

        if(isLoaded && !isLastAudio){
            index = context.currentAudioIndex +1;
            status = await playAnother(context.playbackObj, audio.uri)
        }

        if(isLastAudio){
            index = 0;
            audio = context.audioFiles[index];
            status = await playAnother(context.playbackObj, audio.uri)
        }


        context.updateState(context, {
            playbackObj: context.playbackObj, 
            soundObj: status,
            currentAudio: audio,
            isPlaying:true,
            currentAudioIndex: index,
          });
          //storeAudioForNExtOpening(audio, index)
    }

    const calculateSeekbar = () => {
        if(playbackPosition !== null && playbackDuration !== null){
            return playbackPosition / playbackDuration;
        } 
        return 0;
    }
    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.audioCount}>{(context.currentAudioIndex+1) + ' / ' + context.totalAudioCount}</Text>
                <View style={styles.midBannerContainer}>
                    <MaterialCommunityIcons 
                        name="music-circle" 
                        size={250} 
                        color={context.isPlaying ? color.ACTIVE_BG: color.FONT_MEDIUM} />
                </View>
                <View style={styles.audioPlayerContainer}>
                    <Text numberOfLines={1} style={styles.audioTitle}>{context.currentAudio.filename}</Text>
                    <Slider
                        thumbTintColor={color.ACTIVE_BG}
                        style={{width: width - 50, height: 40, }}
                        minimumValue={0}
                        maximumValue={1}
                        onValueChange={(value) => {
                            setCurrentPosition(value * context.currentAudio.duration);
                        }}
                        value={calculateSeekbar()}
                        minimumTrackTintColor={color.ACTIVE_BG}
                        maximumTrackTintColor={color.FONT_MEDIUM}
                        onSlidingStart={
                            async () => {
                                if(!context.isPlaying) return ;
                                try{
                                    await pause(context.playbackObj)
                                } catch(error){
                                    console.log('error slider start')
                                }
                            }
                        }
                        onSlidingComplete={ async(value) => {
                            if(context.soundObj === null || !context.isPlaying) return;
                            try{
                                const status = await context.playbackObj.setPositionAsync(Math.floor(context.soundObj.durationMillis * value))
                                context.updateState(context, {soundObj: status, playbackPosition: status.positionMillis})

                                await resume(context.playbackObj);
                            } catch(error){
                                console.log('error slider complete')
                            }
                            
                        }}
                    />
                    <View style={styles.audioControllers}>
                        <PlayerButton  onPress={handlePrev} iconType='Prev'/>
                        <PlayerButton  onPress={handlePlayPause} style={{ marginHorizontal: 25}} iconType={context.isPlaying? 'Play':'Pause'}/>
                        <PlayerButton  onPress={handleNext} iconType='Next'/>
                    </View>
                </View>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    audioCount:{
        textAlign: 'right',
        padding: 15,
        color: color.FONT_LIGHT,
        fontSize: 14,
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',

    },
    audioPlayerContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
    audioTitle:{
        fontSize: 16,
        color: color.FONT,
        padding: 15,
    },
    audioControllers: {
        width,
        flexDirection:'row',
        justifyContent:'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
})

export default Player;