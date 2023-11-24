import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacityProps,
  TouchableOpacity,
} from "react-native";
import { EditColors, GlobalColors, GlobalStyles, Sizes } from "../Util/GlobalStyles";
// import { TouchableOpacity } from "react-native-gesture-handler";

interface Props extends TouchableOpacityProps {
  label?: string;
  light?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const { width } = Dimensions.get("window");

const BarLink = ({
  children,
  label,
  onPress,
  onPressIn,
  onPressOut,
  style,
  light = true,
}: Props) => {
  const styles = StyleSheet.create({
    container: {
      width: width,
      minHeight: 64,
      borderBottomColor: light ? GlobalColors.text_primary : EditColors.text_primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Sizes.m,
      elevation: 100,
    },
    textMedium: {
      ...GlobalStyles.text_medium,
      color: light ? GlobalColors.text_primary : EditColors.text_primary,
    },
  });
  return (
    <TouchableOpacity style={[styles.container, style]} {...{ onPressIn, onPressOut, onPress }}>
      {label && <Text style={styles.textMedium}>{label}</Text>}
      {children}
    </TouchableOpacity>
  );
};

export default BarLink;
