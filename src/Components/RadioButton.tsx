import React from "react";
import { StyleSheet, PressableProps, TouchableOpacity } from "react-native";
import { GlobalColors } from "../Util/GlobalStyles";

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
      borderColor: light ? "#fff" : GlobalColors.background,
      borderWidth: 1,
      backgroundColor: selected ? GlobalColors.secondary : "transparent",
    },
  });

  return <TouchableOpacity style={styles.button} onPress={onPress ? onPress : () => null} />;
};

export default RadioButton;
