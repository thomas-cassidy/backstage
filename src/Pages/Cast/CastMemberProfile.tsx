import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { RouteProp, EventArg } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "react-native-gesture-handler";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { AppRoutes } from "../../Util/Routes";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import {
  ADD_CASTMEMBER_ASYNC,
  DELETE_CASTMEMBER_ASYNC,
  UPDATE_CASTMEMBER_ASYNC,
} from "../../Redux/cast";
import { CastMember } from "../../Types/AppTypes";
import { API_URI } from "../../Util/InitialState";
import { REFRESH_ACCESS_TOKEN } from "../../Redux/auth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faChevronRight, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { getAuth, getCast } from "../../Redux/Helpers";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

const image_size = width / 2.5;

interface OuterProps {
  route: RouteProp<AppRoutes, "CastProfile">;
  navigation: StackNavigationProp<AppRoutes, "CastProfile">;
}

const CastMemberProfileContainer = ({ route, navigation }: OuterProps) => {
  const cast = useAppSelector(getCast);
  const { ACCESS_TOKEN } = useAppSelector(getAuth);

  if (!cast || !ACCESS_TOKEN) return <Text>Oopsie</Text>;

  return <CastMemberProfile {...{ route, navigation, ACCESS_TOKEN, cast }} />;
};

interface InnerProps extends OuterProps {
  ACCESS_TOKEN: string;
  cast: CastMember[];
}

const CastMemberProfile = ({ route, navigation, cast, ACCESS_TOKEN }: InnerProps) => {
  const { _id } = route.params;
  const dispatch = useAppDispatch();

  const castMember = cast.find((c) => c._id === _id);
  const [newCastMember] = useState(_id === "-1" || _id === -1);
  const [editing, setEditing] = useState(_id === "-1" || _id === -1);
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
  const [currentImage, setCurrentImage] = useState(0);
  const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset>();

  const color = editing ? GlobalColors.background : GlobalColors.text_primary;
  const background = editing ? GlobalColors.text_primary : GlobalColors.background;
  const styles = makeStyles(color, background);

  const incImage = () => {
    setCurrentImage((prev) => {
      if (!tempCastMember.images || tempCastMember.images.length === 0) {
        return prev;
      } else {
        return prev === tempCastMember.images.length - 1 ? 0 : prev + 1;
      }
    });
  };
  const decImage = () => {
    setCurrentImage((prev) => {
      if (!tempCastMember.images || tempCastMember.images.length === 0) {
        return prev;
      } else {
        return prev === 0 ? tempCastMember.images.length - 1 : prev - 1;
      }
    });
  };

  const handleFormChange = (field: "name" | "role" | "notes" | "category", value: string) => {
    setHasChanges(true);
    setTempCastMember((prev) => {
      let newState = { ...prev };
      newState[field] = value;
      return newState;
    });
  };

  useEffect(() => {
    if (!editing && hasChanges) {
      dispatch(UPDATE_CASTMEMBER_ASYNC({ castMember: tempCastMember, image: newImage }));
      setHasChanges(false);
    }
  }, [editing]);

  useEffect(() => {
    const unsavedSafety = (
      e: EventArg<
        "beforeRemove",
        true,
        {
          action: Readonly<{
            type: string;
            payload?: object | undefined;
            source?: string | undefined;
            target?: string | undefined;
          }>;
        }
      >
    ) => {
      console.log(newCastMember);
      if (!newCastMember && hasChanges) {
        e.preventDefault();
        Alert.alert("You have unsaved changes", "", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              navigation.dispatch(e.data.action);
            },
          },
        ]);
      }
    };

    navigation.addListener("beforeRemove", unsavedSafety);
    return () => navigation.removeListener("beforeRemove", unsavedSafety);
  }, [hasChanges]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted)
      return Alert.alert(
        "You will need to give permission for this app to access the camera in the settings app."
      );
    // const result = await ImagePicker.launchCameraAsync({
    //   allowsMultipleSelection: false,
    //   allowsEditing: true,
    // });
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      allowsEditing: true,
    });
    if (result.assets) {
      setHasChanges(true);
      setNewImage(result.assets[0]);
    }
  };

  const imageSource = newImage
    ? { uri: newImage.uri }
    : tempCastMember.images?.length
    ? {
        uri: `${API_URI}/images/${tempCastMember.images[currentImage]}`,
        headers: {
          "x-access-token": ACCESS_TOKEN,
        },
      }
    : {
        uri: "https://images-na.ssl-images-amazon.com/images/I/51+E4VHsZ6L.jpg",
      };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
        <PageHeader
          label={editing ? "Edit Mode" : tempCastMember.name}
          light={!editing}
          edit
          onEdit={() => setEditing((prev) => !prev)}
          back
          onBack={() => navigation.goBack()}
        />
        <View style={styles.imageSection}>
          <TouchableOpacity disabled={!editing} activeOpacity={0.8} onPress={() => pickImage()}>
            <TouchableOpacity
              style={{
                height: 50,
                position: "absolute",
                top: image_size / 2 - 25,
                left: -60,
                zIndex: 10,
                elevation: 10,
              }}
              onPress={decImage}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={40}
                color={editing ? GlobalColors.background : GlobalColors.text_primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 50,
                position: "absolute",
                top: image_size / 2 - 25,
                right: -60,
                zIndex: 10,
                elevation: 10,
              }}
              onPress={incImage}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                size={40}
                color={editing ? GlobalColors.background : GlobalColors.text_primary}
              />
            </TouchableOpacity>
            {editing && (
              <TouchableOpacity
                //add some delete function in here
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 10,
                  elevation: 10,
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} color={"darkred"} size={25} />
              </TouchableOpacity>
            )}
            <Image
              source={imageSource}
              onError={(err) => {
                dispatch(REFRESH_ACCESS_TOKEN());
              }}
              style={styles.image}
            />
          </TouchableOpacity>
          {editing && <RoundButton label="Set as Default" style={{ margin: 10 }} />}
        </View>
        <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 63 }}>
          <FormLine
            autoCapitalize="sentences"
            label="Role"
            {...{ color, editing }}
            onChangeText={(e) => handleFormChange("role", e)}
            value={tempCastMember.role}
          />
          <FormLine
            autoCapitalize="sentences"
            label="Name"
            {...{ color, editing }}
            onChangeText={(e) => handleFormChange("name", e)}
            value={tempCastMember.name}
          />
          <FormLine
            autoCapitalize="sentences"
            label="Group"
            {...{ color, editing }}
            onChangeText={(e) => handleFormChange("category", e)}
            value={tempCastMember.category ? tempCastMember.category : ""}
          />
          <View style={styles.notesSection}>
            <Text style={styles.text_label}>Notes:</Text>
            <TextInput
              editable={editing}
              multiline
              style={{
                ...GlobalStyles.text_medium,
                color,
                flex: 1,
              }}
              onChangeText={(e) => handleFormChange("notes", e)}
              value={tempCastMember.notes}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {editing && newCastMember && (
        <RoundButton
          label="Save"
          onPress={async () => {
            if (!tempCastMember.role) return Alert.alert("Cast member must have a role");
            await dispatch(
              ADD_CASTMEMBER_ASYNC({ castMember: tempCastMember, image: newImage })
            ).then((e) => {
              if (e.meta.requestStatus === "fulfilled") {
                console.log("plop");
                setHasChanges(false);
                return navigation.goBack();
              }
              Alert.alert("Could not add Cast Member", "Network error occurred");
            });
          }}
        />
      )}
      {editing && (
        <RoundButton
          label="Delete Cast Member"
          altColor
          onPress={async () => {
            !newCastMember &&
              Alert.alert("Are you sure you want to delete this cast member?", "", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () =>
                    await dispatch(DELETE_CASTMEMBER_ASYNC({ castMember: tempCastMember })).then(
                      () => navigation.goBack()
                    ),
                },
              ]);
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
    imageSection: {
      width,
      justifyContent: "center",
      alignItems: "center",
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

export default CastMemberProfileContainer;
