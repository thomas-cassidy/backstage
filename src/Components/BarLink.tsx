import React, { ReactNode } from 'react'
import { Text, StyleSheet, Dimensions, Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native'
import { EditColors, GlobalColors, GlobalStyles, Sizes } from '../Util/GlobalStyles'

interface Props extends PressableProps {
    children?: ReactNode;
    label?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    light?: boolean
}

const { width, height } = Dimensions.get('window')

const BarLink = ({ children, label, onPress, onPressIn, onPressOut, style, light = true }: Props) => {
    const styles = StyleSheet.create({
        container: {
            width: width,
            minHeight: 64,
            borderBottomColor: light ? GlobalColors.text_primary : EditColors.text_primary,
            borderBottomWidth: StyleSheet.hairlineWidth,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: Sizes.m,
        },
        textMedium: {
            ...GlobalStyles.text_medium,
            color: light ? GlobalColors.text_primary : EditColors.text_primary,
        }
    })
    return (
        <Pressable style={[styles.container, style]}
            {...{ onPress, onPressIn, onPressOut }}
        >
            {label &&
                <Text style={styles.textMedium}>
                    {label}
                </Text>
            }
            {children}
        </Pressable>
    )
}



export default BarLink
