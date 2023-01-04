import React, { Component } from 'react';
import { View, StyleSheet, Modal, StatusBar, Text, TouchableWithoutFeedback } from "react-native";
import color from '../misc/color';

const OptionModal = ({visible , currentItem , onClose, onPlayPress, onAddPress}) => {
    const { filename } =currentItem;
    return (
        <>
            <StatusBar hidden={true}></StatusBar>
            <Modal animationType='slide' transparent={true} visible={visible}>
                <View style={styles.modal}>
                    <Text numberOfLines={2} style={styles.title}>{filename}</Text>
                    <View style={styles.optionContainer}>
                        <TouchableWithoutFeedback onPress={onPlayPress}>
                            <Text style={styles.option}>Play</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={onAddPress}>
                            <Text style={styles.option}>Add to playlist</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBg}/>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {},
    modal: {
        position: 'absolute',
        bottom: 0,
        right:0,
        left: 0,
        backgroundColor: color.APP_BG,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 1000,
    },
    optionContainer:{
       padding: 20,
    },
    title:{
        fontSize: 25,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 10,
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 10,
        letterSpacing: 1
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: color.MODEL_BG,
    }
})

export default OptionModal;