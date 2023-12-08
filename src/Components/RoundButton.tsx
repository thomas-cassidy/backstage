import React from "react";
import { Text, StyleSheet, TouchableOpacityProps, GestureResponderEvent } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors, GlobalStyles, Sizes } from "../Util/GlobalStyles";

interface Props extends TouchableOpacityProps {
  label: string;
  altColor?: boolean;
  onPress?: (e?: GestureResponderEvent) => void;
  onPressOut?: (e?: GestureResponderEvent) => void;
}

const RoundButton = ({ label, altColor, onPress, onPressOut, style }: Props) => {
  const backgroundColor = altColor ? GlobalColors.tertiary : GlobalColors.secondary;

  if (onPressOut) {
    return (
      <TouchableOpacity
        style={[styles.container, style, { backgroundColor: backgroundColor }]}
        onPressIn={onPress}
        onPressOut={onPressOut}
        activeOpacity={0.6}
      >
        <Text style={GlobalStyles.text_medium}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style, { backgroundColor: backgroundColor }]}
      activeOpacity={0.6}
      onPressIn={onPress}
    >
      <Text style={GlobalStyles.text_medium}>{label}</Text>
    </TouchableOpacity>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.xs,
    paddingHorizontal: Sizes.s,
    marginBottom: Sizes.s,
    borderRadius: Sizes.m,
    alignItems: "center",
    // minWidth: width * 0.7,
  },
});
