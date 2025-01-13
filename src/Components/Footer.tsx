import { View, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { FontAwesomeIcon, FontAwesomeIconStyle } from "@fortawesome/react-native-fontawesome";
import { faGear, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { GlobalColors, Sizes } from "../Util/GlobalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../Util/Routes";
import { useNavigation } from "@react-navigation/native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Transform } from "@fortawesome/fontawesome-svg-core";

const { width } = Dimensions.get("window");

const defaultProps = {
  icon: null,
  mask: null,
  maskId: null,
  transform: null,
  style: {},
  color: null,
  secondaryColor: null,
  secondaryOpacity: null,
  size: 16,
};

interface FontAwesomeProps {
  icon: IconProp;
  /**
   * @deprecated
   */
  height?: number;
  /**
   * @deprecated
   */
  width?: number;
  size?: number;
  color?: string;
  secondaryColor?: string;
  secondaryOpacity?: number;
  mask?: IconProp;
  maskId?: string;
  transform?: string | Transform;
  style?: FontAwesomeIconStyle;
  testID?: string;
}
const MYFontAwesomeIcon = (props: FontAwesomeProps) => {
  return <FontAwesomeIcon {...{ defaultProps, ...props }} />;
};

const Footer = () => {
  const navigation = useNavigation<StackNavigationProp<AppRoutes, "Dashboard">>();
  return (
    <View
      style={{
        width,
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: Sizes.s,
        borderTopColor: GlobalColors.text_primary,
        borderTopWidth: StyleSheet.hairlineWidth,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("NewShow")}>
        <MYFontAwesomeIcon icon={faPlus} size={40} color={GlobalColors.secondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Search")}>
        <MYFontAwesomeIcon icon={faSearch} size={40} color={GlobalColors.secondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <MYFontAwesomeIcon icon={faGear} size={40} color={GlobalColors.secondary} />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
