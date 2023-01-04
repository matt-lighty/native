import React from 'react';
import {AntDesign} from '@expo/vector-icons'
import color from '../misc/color'

const PlayerButton = (props) => {
    const {iconType, size=40, iconColor= color.ACTIVE_BG, onPress} =props;
    const getIconName= (type) => {
        switch(type) {
            case 'Play':
                return 'pausecircle'
            case 'Pause':
                return 'playcircleo'
            case 'Next':
                return 'forward'
            case 'Prev':
                return 'banckward'
        }
    }
    return (
        <AntDesign 
            {... props}
            onPress={onPress} 
            name={getIconName(iconType)} 
            size={size} 
            color={iconColor} />
    )
}



export default PlayerButton;
