import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { GlobalColors, GlobalStyles, Sizes } from "../Util/GlobalStyles";

interface FormLineProps extends TextInputProps {
  label?: string;
  editing: boolean;
  onChangeText?: (e: string) => void;
  color?: string;
  value: string;
}

const FormLine = ({
  label = undefined,
  editing,
  onChangeText = () => null,
  value,
  color = GlobalColors.text_primary,
  textContentType,
  onSubmitEditing,
  autoCapitalize,
}: FormLineProps) => {
  const styles = makeStyles(color);
  return (
    <View style={styles.formLine}>
      {label && <Text style={styles.text_label}>{label}</Text>}
      <TextInput
        selectionColor={GlobalColors.tertiary}
        autoCapitalize={autoCapitalize}
        textContentType={textContentType}
        editable={editing}
        style={styles.inputField}
        onChangeText={(e) => onChangeText(e)}
        secureTextEntry={textContentType === "password"}
        onSubmitEditing={onSubmitEditing}
        value={value}
      />
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
