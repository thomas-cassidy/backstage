import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputIOSProps,
} from "react-native";
import { GlobalStyles, Sizes } from "../Util/GlobalStyles";

interface FormLineProps extends TextInputIOSProps {
    label: string;
    editing: boolean;
    onChange: (e: string) => void;
    color: string;
    value: string;
}

const FormLine = ({
    label,
    editing,
    onChange,
    value,
    color,
    textContentType,
}: FormLineProps) => {
    const styles = makeStyles(color);
    return (
        <View style={styles.formLine}>
            <Text style={styles.text_label}>{label}</Text>
            <TextInput
                autoCapitalize='none'
                textContentType={textContentType}
                editable={editing}
                style={styles.inputField}
                onChangeText={(e) => onChange(e)}
                secureTextEntry={textContentType === "password"}
            >
                {value}
            </TextInput>
        </View>
    );
};
const makeStyles = (color: string) => {
    return StyleSheet.create({
        formLine: {
            flexDirection: "row",
            height: 50,
            borderColor: color,
            borderBottomWidth: StyleSheet.hairlineWidth,
            alignItems: "center",
        },
        text_label: {
            ...GlobalStyles.text_label,
            color,
            marginRight: Sizes.m,
        },
        inputField: {
            ...GlobalStyles.text_medium,
            color,
            flex: 1,
        },
    });
};

export default FormLine;
