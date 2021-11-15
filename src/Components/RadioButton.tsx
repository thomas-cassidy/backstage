import React, { useState } from 'react'
import { StyleSheet, PressableProps, Pressable, View } from 'react-native'
import { GlobalColors } from '../Util/GlobalStyles'

interface Props extends PressableProps {
    selected: boolean;
    light?: boolean;
}

const RadioButton = ({ selected, onPress, light }: Props) => {
    const styles = StyleSheet.create({
        button: {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderColor: light ? '#fff' : GlobalColors.background,
            borderWidth: 1,
            backgroundColor: selected ? GlobalColors.secondary : 'transparent',
        }
    })

    return (
        <View style={styles.button} {...onPress} />
    )
}

export default RadioButton
