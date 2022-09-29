import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "react-native-gesture-handler";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { AppRoutes } from "../../Util/Routes";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { ADD_CASTMEMBER, REMOVE_CASTMEMBER } from "../../Redux/cast";
import { RootState } from "../../Redux/store";
import { CastMember } from "../../Types/AppTypes";
import { API_URI } from "../../Util/InitialState";
import { REFRESH_ACCESS_TOKEN } from "../../Redux/auth";

const { width } = Dimensions.get("window");

const image_size = width / 2.5;

interface Props {
  route: RouteProp<AppRoutes, "CastProfile">;
  navigation: StackNavigationProp<AppRoutes, "CastProfile">;
}

const getCast = (state: RootState) => state.cast.cast;

const CastMemberProfile = ({ route, navigation }: Props) => {
  const { _id } = route.params;
  const cast = useAppSelector(getCast);
  const { ACCESS_TOKEN } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const castMember = cast.find((c) => c._id === _id);
  const [newCastMember] = useState(_id === "-1");
  const [editing, setEditing] = useState(_id === "-1");
  const [hasChanges, setHasChanges] = useState(false);
  const [tempCastMember, setTempCastMember] = useState<CastMember>(
    castMember
      ? { ...castMember }
      : {
          name: "",
          role: "",
          notes: "",
          category: "",
          _id: "",
          images: [],
        }
  );

  const handleFormChange = (
    field: "name" | "role" | "notes" | "category",
    value: string
  ) => {
    setHasChanges(true);
    setTempCastMember((prev) => {
      let newState = { ...prev };
      newState[field] = value;
      return newState;
    });
  };

  useEffect(() => {
    if (!editing && hasChanges) {
      console.log("commit");
      //comit changes. dispatch(UPDATE_CASTMEMBER_ASYNC(tempCastMember))??
      setHasChanges(false);
    }
  }, [editing]);

  const color = editing ? GlobalColors.background : GlobalColors.text_primary;
  const background = editing
    ? GlobalColors.text_primary
    : GlobalColors.background;
  const styles = makeStyles(color, background);

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        label={editing ? "Edit Mode" : tempCastMember.name}
        light={!editing}
        edit
        onEdit={() => setEditing((prev) => !prev)}
      />
      <Image
        source={
          tempCastMember.images?.length
            ? {
                uri: `${API_URI}/images/${tempCastMember.images[0]}`,
                headers: {
                  "x-access-token": ACCESS_TOKEN,
                },
              }
            : {
                uri: "https://images-na.ssl-images-amazon.com/images/I/51+E4VHsZ6L.jpg",
              }
        }
        onError={(err) => {
          dispatch(REFRESH_ACCESS_TOKEN());
        }}
        height={120}
        width={120}
        style={styles.image}
      />

      <View style={styles.form}>
        <FormLine
          label="Role"
          {...{ color, editing }}
          onChange={(e) => handleFormChange("role", e)}
          value={tempCastMember.role}
        />
        <FormLine
          label="Name"
          {...{ color, editing }}
          onChange={(e) => handleFormChange("name", e)}
          value={tempCastMember.name}
        />
        <FormLine
          label="Group"
          {...{ color, editing }}
          onChange={(e) => handleFormChange("category", e)}
          value={tempCastMember.category ? tempCastMember.category : ""}
        />
        <View style={styles.notesSection}>
          <Text style={styles.text_label}>Notes:</Text>
          <TextInput
            editable={editing}
            multiline
            style={{ ...GlobalStyles.text_medium, color, flex: 1 }}
            onChange={(e) => handleFormChange("notes", e.nativeEvent.text)}
          >
            {tempCastMember.notes}
          </TextInput>
        </View>
      </View>
      {editing && newCastMember && (
        <RoundButton
          label="Save"
          onPress={async () => {
            await dispatch(ADD_CASTMEMBER(tempCastMember));
            navigation.goBack();
          }}
        />
      )}
      {editing && (
        <RoundButton
          label="Delete Cast Member"
          altColor
          onPress={async () => {
            !newCastMember
              ? await dispatch(REMOVE_CASTMEMBER(tempCastMember))
              : null;
            navigation.goBack();
          }}
        />
      )}
    </SafeAreaView>
  );
};

const makeStyles = (color: string, background: string) =>
  StyleSheet.create({
    container: {
      ...GlobalStyles.container,
      backgroundColor: background,
    },
    image: {
      height: image_size,
      width: image_size,
      borderRadius: Sizes.s,
      borderColor: color,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: "grey",
    },
    form: {
      width,
      flex: 1,
      padding: Sizes.m,
    },
    formLine: {
      flexDirection: "row",
      height: 50,
      borderColor: color,
      borderBottomWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
    },
    notesSection: {
      borderColor: color,
      paddingTop: Sizes.s,
      flex: 1,
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

export default CastMemberProfile;
