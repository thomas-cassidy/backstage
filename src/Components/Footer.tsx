import { View, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { GlobalColors, Sizes } from "../Util/GlobalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../Util/Routes";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

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
        <FontAwesomeIcon icon={faPlus} size={40} color={GlobalColors.secondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Search")}>
        <FontAwesomeIcon icon={faSearch} size={40} color={GlobalColors.secondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <FontAwesomeIcon icon={faGear} size={40} color={GlobalColors.secondary} />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
