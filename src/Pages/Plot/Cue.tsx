import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet, Dimensions, TextInput } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { BarLink, RadioButton, RoundButton } from "../../Components";
import { useAppSelector } from "../../Redux/hooks";
import { CueType } from "../../Types/AppTypes";
import { EditColors, GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { AppRoutes } from "../../Util/Routes";

const { width } = Dimensions.get("window");

interface Props {
  index: number;
  cuePoint?: string;
  location?: string;
  notes?: string;
  castInCue?: number[];
  next?: string;
  onNext?: () => void;
  editing: boolean;
  handleChange: (index: number, field: keyof CueType, value: string | number) => void;
  handleAddCue: () => void;
  handleDelCue: () => void;
  handleScroll: () => void;
  cueCount: number;
}

// const cues = [cue1,cue2,fakeCue]
// do update, then do a side effect to scroll to the new place
// redux thunk can do this (or redux loop is another library for this)

// redux-persist - library to save your redux store

const Cue = ({
  index,
  cuePoint,
  location,
  notes,
  castInCue,
  next,
  onNext,
  editing,
  handleChange,
  handleAddCue,
  handleDelCue,
  handleScroll,
  cueCount,
}: Props) => {
  const { cast } = useAppSelector((state) => state.cast);
  const color = editing ? EditColors.text_primary : GlobalColors.text_primary;
  const navigation: StackNavigationProp<AppRoutes, any> = useNavigation();

  const styles = StyleSheet.create({
    container: {
      width,
      height: "100%",
      padding: Sizes.s,
    },
    inner: {
      flex: 1,
      borderRadius: Sizes.s,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: color,
      padding: Sizes.xs,
    },
    cuePoint: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: color,
      padding: Sizes.xs,
    },
    location: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: color,
      padding: Sizes.xs,
    },
    textInputLarge: {
      ...GlobalStyles.text_large,
      color: color,
    },
    textInputMedium: {
      ...GlobalStyles.text_medium,
      color: color,
    },
    textInputSmall: {
      ...GlobalStyles.text_small,
      color: color,
    },
    textLabel: {
      ...GlobalStyles.text_label,
      color: color,
    },
    notes: {
      flex: 1,
      padding: Sizes.xs,
    },
    castMembers: {
      flex: 1.5,
    },
    next: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      padding: Sizes.xs,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.cuePoint}>
          <TextInput
            placeholder="Cue Point"
            editable={editing}
            style={styles.textInputLarge}
            onChange={(e) => handleChange(index, "cuePoint", e.nativeEvent.text)}
            value={cuePoint}
          />
        </View>
        <View style={styles.location}>
          <TextInput
            placeholder="Location e.g. SR Wing 🥚"
            editable={editing}
            style={{
              ...GlobalStyles.text_medium,
              color: GlobalColors.secondary,
            }}
            onChange={(e) => handleChange(index, "location", e.nativeEvent.text)}
            value={location}
          />
        </View>

        <View style={styles.notes}>
          <Text style={styles.textLabel}>Notes:</Text>
          <TextInput
            placeholder="Notes..."
            editable={editing}
            multiline
            style={styles.textInputSmall}
            onChange={(e) => handleChange(index, "notes", e.nativeEvent.text)}
            value={notes}
          />
        </View>

        <View style={styles.castMembers}>
          <Text style={styles.textLabel}>Cast Members: </Text>
          <ScrollView>
            {editing ? (
              cast.map((c, i) => (
                <BarLink
                  label={c.role}
                  light={false}
                  key={i}
                  style={{ width: undefined }}
                  onPress={() => handleChange(index, "castMembers", c._id)}
                >
                  <RadioButton
                    selected={castInCue?.indexOf(c._id) != -1}
                    onPress={() => handleChange(index, "castMembers", c._id)}
                  />
                </BarLink>
              ))
            ) : castInCue?.length === 0 ? (
              <BarLink label={"None selected"} light={!editing} />
            ) : (
              cast
                ?.filter((c) => castInCue?.find((x) => x === c._id))
                .map((c, i) => {
                  return (
                    <BarLink
                      label={c.role}
                      light={!editing}
                      key={i}
                      style={{ width: undefined }}
                      onPress={() => {
                        console.log("pressed");
                        navigation.navigate("CastProfile", {
                          _id: c._id,
                        });
                      }}
                    />
                  );
                })
            )}
          </ScrollView>
        </View>

        {editing ? (
          <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <RoundButton
              label={"Add Cue"}
              onPress={handleAddCue}
              onPressOut={handleScroll}
              style={{
                width: width * 0.4,
                marginBottom: 0,
                marginTop: Sizes.xs,
              }}
            />

            {cueCount != 1 && (
              <RoundButton
                altColor
                label={"Delete"}
                onPress={handleDelCue}
                style={{
                  width: width * 0.4,
                  marginBottom: 0,
                  marginTop: Sizes.xs,
                }}
              />
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.next} onPress={onNext}>
            <Text style={{ ...styles.textLabel, marginRight: 10 }}>{next ? "Next Cue" : null}</Text>
            {next && <Text style={styles.textInputMedium}>{next}</Text>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Cue;
