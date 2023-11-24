import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors, GlobalStyles, Sizes } from "../Util/GlobalStyles";

const { width } = Dimensions.get("window");

interface Props {
  label?: string;
  edit?: boolean;
  onEdit?: () => void;
  back?: boolean;
  onBack?: () => void;
  backLabel?: string;
  light?: boolean;
}

const getFontSize = (length?: number) => {
  // if (length) return length > 12 ? 30 : 36
  return 36;
};

const PageHeader = ({ label, edit, onEdit, back, onBack, backLabel, light = true }: Props) => {
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);

  const color = light ? GlobalColors.text_primary : GlobalColors.background;

  const fontSize = getFontSize(label?.length);

  return (
    <View style={styles.container}>
      {back && (
        <View style={styles.back}>
          <TouchableOpacity
            onPress={
              onBack
                ? onBack
                : () => {
                    navigation.goBack();
                  }
            }
          >
            <Text style={{ ...GlobalStyles.text_medium, color }}>
              {backLabel ? backLabel : "Back"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {label && <Text style={{ ...styles.label, color, fontSize: fontSize }}>{label}</Text>}
      {edit && (
        <View style={styles.edit}>
          <TouchableOpacity
            onPress={() => {
              setEditing(!editing);
              onEdit && onEdit();
            }}
          >
            <Text style={{ ...GlobalStyles.text_medium, color }}>{!editing ? "Edit" : "Save"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 80,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: Sizes.xs,
  },
  label: {
    ...GlobalStyles.page_header,
    alignSelf: "flex-end",
  },
  back: {
    position: "absolute",
    left: Sizes.s,
    top: Sizes.s,
  },
  edit: {
    position: "absolute",
    right: Sizes.s,
    top: Sizes.s,
  },
});
