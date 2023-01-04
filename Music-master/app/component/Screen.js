import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { color } from '../misc/color';

const Screen =({children}) => {
    return ( 
        <View style={styles.container}>{children}</View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
});
export default Screen;
