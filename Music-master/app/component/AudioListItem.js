import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons'
import color from '../misc/color';

const getThumbnailText = (title) => {
    return title[0];
}

const durationTranform =(duration) => {

}

const renderIcon = isPlaying => {
    if(isPlaying){
        return <Entypo name='controller-paus' size={24} color={color.ACTIVE_FONT}/>
    }
    return <Entypo name='controller-play' size={24} color={color.ACTIVE_FONT}/>
}

const AudioListItem = ({title, duration, onOptionPress, onAudioPress, isPlaying, isActive}) => {
    return (
        <>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress ={onAudioPress}>
                    <View style={styles.leftContainer}>
                        <View style={[styles.thumbnail, {backgroundColor: isActive? color.ACTIVE_BG : color.FONT_LIGHT}]}>
                            <Text style={styles.thumbnailText}>
                                {isActive ? 
                                renderIcon(isPlaying) 
                                : 
                                getThumbnailText(title)}
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text numberOfLines={1} style={styles.title}>{title}</Text>
                            <Text style={styles.timeText}>{duration}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.rightContainer}>
                    <Entypo 
                        style={{padding: 10}}
                        name='dots-three-vertical' 
                        size={20} 
                        color={color.FONT_MEDIUM}
                        onPress={onOptionPress}>
                        </Entypo>
                </View>
            </View>
            <View style={styles.separator}></View>
        </>
    );
}
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignSelf:'center',
        width: width - 80,
    },
    thumbnail:{
        height: 50,
        backgroundColor: color.FONT_LIGHT,
        flexBasis: 50,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 25,
    },
    leftContainer:{
        flexDirection:'row',
        alignSelf:'center',
        flex: 1,
    },
    rightContainer:{
        flexBasis: 50,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
    },
    thumbnailText:{
        fontSize: 22,
        fontWeight: 'bold',
        color: color.FONT,
    },
    title:{
        fontSize: 16,
        color: color.FONT,
    },
    titleContainer:{
        width: width-180,
        paddingLeft: 10, 
        justifyContent:'center'
    },
    separator: {
        width: width-80,
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf:'center',
        marginTop: 10
    },
    timeText: {
        fontSize: 14,
        color: 'grey',
    },
})

export default AudioListItem;
