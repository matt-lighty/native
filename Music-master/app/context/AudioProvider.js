import React, {Component, createContext} from 'react';
import { Text, View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import { Audio } from 'expo-av';

export const AudioContext = createContext()

export class AudioProvider extends Component {
    constructor(props){
        super(props);
        this.state ={
            audioFiles: [],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            currentAudioIndex: null,
            playbackPosition: null,
            playbackDuration: null,
        };
        this.totalAudioCount = 0;
    }

    permissionAlert = () => {
        Alert.alert("Permission Required", "This app needs to read audio files!", [{
            text: "ok",
            onPress: () => this.getPermission()
        },{
            text:'cancel',
            onPress: () => this.permissionAlert()
        }])
    }

    getFiles = async () => {
        const {dataProvider, audioFiles} = this.state
        let media = await MediaLibrary.getAssetsAsync({
            mediaType:'audio', 
        });
        media = await MediaLibrary.getAssetsAsync({
            mediaType:'audio', 
            first: media.totalCount,
        });
        this.totalAudioCount = media.totalCount;

        this.setState({...this.state,    dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]),
                                         audioFiles: [...audioFiles, ...media.assets]})

    }

    getPermission = async () => {
            // {
            //     "canAskAgain": true,
            //     "expires": "never",
            //     "granted": false,
            //     "status": "undetermined",
            //   }
        const permission = await MediaLibrary.getPermissionsAsync()
        if(permission.granted){
            // we want to get all the audio
            this.getFiles();
        } 
        if(!permission.canAskAgain && !permission.granted){
            this.setState({...this.state, permissionError: true})
        }

        if(!permission.granted && permission.canAskAgain){
            const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync()
            if(status === 'denied' && canAskAgain){
                // display alert that user have to allow permission
                this.permissionAlert();
            }
            if(status === 'granted'){
                // we want to get all the audio
                this.getFiles();
            }
            if(status === 'denied' && !canAskAgain){
                // display error
                this.setState({...this.state, permissionError: true})
            }
        }
    }

    //componentDidMount
    async componentDidMount(){
        this.getPermission();
        if(this.state.playbackObj === null){
            this.setState({...this.state, playbackObj: new Audio.Sound()})
        }
        await Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: true,
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
          });
    }

    updateState = (prevState, newState ={}) =>  {
        this.setState({...prevState, ...newState})
      }

    render(){
        const { audioFiles, 
                currentAudioIndex, 
                isPlaying, 
                dataProvider, 
                permissionError, 
                playbackObj, 
                soundObj, 
                currentAudio,
                playbackDuration,
                playbackPosition,
            } = this.state
        if(permissionError) return <View style={{
            flex: 1,
            justifyContent:'center',
            alignItems: 'center',
        }}>
            <Text style={{fontSize: 25, textAlign:'center', color: 'red'}}>It looks like there is no permission</Text>
        </View>
        return <AudioContext.Provider 
            value={{
                audioFiles, 
                dataProvider,
                playbackObj, 
                soundObj, 
                currentAudio,
                isPlaying,
                currentAudioIndex,
                playbackDuration,
                playbackPosition,
                updateState: this.updateState,
                totalAudioCount: this.totalAudioCount}}>
            {this.props.children}
        </AudioContext.Provider>
    }
}

export default AudioProvider;