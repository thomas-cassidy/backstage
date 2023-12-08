import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  ImageErrorEventData,
  NativeSyntheticEvent,
} from "react-native";
import { useAppSelector } from "../../Redux/hooks";
import { CastMember } from "../../Types/AppTypes";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { AppRoutes } from "../../Util/Routes";
import { API_URI } from "../../Util/InitialState";
import { refreshAccessToken } from "../../Util/RefreshAccessToken";

const { width } = Dimensions.get("window");

interface Props {
  castMember: CastMember;
}

const image_size = 110;

const CastMemberSmall = ({ castMember }: Props) => {
  const navigation = useNavigation<StackNavigationProp<AppRoutes, "Cast">>();
  const { ACCESS_TOKEN } = useAppSelector((state) => state.auth);
  const [imageRetry, setImageRetry] = useState(0);

  const onError = useCallback(async (err: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.log("image error", err.nativeEvent.error);
    if (imageRetry === 0) {
      await refreshAccessToken();
      setImageRetry((prev) => prev + 1);
    }
  }, []);

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("CastProfile", { _id: castMember._id })}
    >
      <View style={{ flexDirection: "row", marginBottom: Sizes.s }}>
        <Image
          key={`Image-${imageRetry}`}
          source={
            castMember.images?.length
              ? {
                  uri: `${API_URI}/images/${castMember.images[0]}`,
                  headers: {
                    "x-access-token": ACCESS_TOKEN,
                  },
                }
              : require("../../Assets/placeholder_headshot.png")
          }
          style={styles.image}
          onError={onError}
        />
        <View style={styles.text_right}>
          <Text style={GlobalStyles.text_label}>Role:</Text>
          <Text style={GlobalStyles.text_medium}>{castMember.role}</Text>
          <Text style={GlobalStyles.text_label}>Name:</Text>
          <Text style={GlobalStyles.text_medium}>{castMember.name}</Text>
        </View>
      </View>
      <View style={styles.notesSection}>
        <Text style={GlobalStyles.text_label}>Notes:</Text>
        <Text style={GlobalStyles.text_small}>{castMember.notes}</Text>
      </View>
    </Pressable>
  );
};

export default CastMemberSmall;

const styles = StyleSheet.create({
  container: {
    width,
    padding: Sizes.m,
    borderBottomColor: GlobalColors.text_primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    paddingHorizontal: Sizes.m,
  },
  image: {
    height: image_size,
    width: image_size,
    borderRadius: Sizes.s,
    borderColor: GlobalColors.text_primary,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "grey",
  },
  text_right: {
    paddingLeft: Sizes.m,
    justifyContent: "space-evenly",
  },
  notesSection: {
    height: 30,
  },
});
