import React from 'react'
import { View, Text, TextInput, StyleSheet, NativeSyntheticEvent } from 'react-native'
import { GlobalStyles, Sizes } from '../Util/GlobalStyles'

interface FormLineProps {
    editing: boolean;
    onChange: (e: NativeSyntheticEvent<any>) => void;
    color: string;
    value: string
}

const FormLine = ({ editing, onChange, value, color }: FormLineProps) => {
    const styles = makeStyles(color)
    return (
        <View style={styles.formLine}>
            <Text style={styles.text_label}>
                Role:
            </Text>
            <TextInput
                editable={editing}
                style={styles.inputField}
                onChange={(e) => onChange(e)}
            >
                {value}
            </TextInput>
        </View>
    )
}
const makeStyles = (color: string) => {
    return StyleSheet.create({
        formLine: {
            flexDirection: 'row',
            height: 50,
            borderColor: color,
            borderBottomWidth: StyleSheet.hairlineWidth,
            alignItems: 'center'
        },
        text_label: {
            ...GlobalStyles.text_label,
            color,
            marginRight: Sizes.m
        },
        inputField: {
            ...GlobalStyles.text_medium,
            color,
            flex: 1
        }
    })
}

export default FormLine
