import { ScrollView, Text, View, StyleSheet, TextInput, Alert } from "react-native";
import React from "react";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { FormLine, PageContainer, PageHeader, RoundButton, Spacer } from "../../Components";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import Swipeable from "../../Components/Swipeable";
import { DELETE_GROUP, UPDATE_GROUP } from "../../Redux/cast";
import { DELETE_SHOW } from "../../Redux/show";

interface Props {
  navigation: StackNavigationProp<AppRoutes, "ShowSettings">;
}

const ShowSettings = ({ navigation }: Props) => {
  const show = useAppSelector((state) => state.show);
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    Alert.alert("Are you sure you wish to delete this show?", "This action can not be undone", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(DELETE_SHOW());
        },
      },
    ]);
  };

  return (
    <PageContainer light={false}>
      <PageHeader label="Settings" back onBack={() => navigation.goBack()} />
      <ScrollView style={{ padding: Sizes.m }}>
        <FormLine
          color={GlobalColors.text_primary}
          editing={true}
          label="Show Name"
          value={show.name}
          onChange={() => null}
        />
        <Spacer />
        {/* <SectionLabel label="Cast Groups" />
        <CastGroups />
        <View style={{ alignItems: "flex-end" }}>
          <RoundButton
            label="Add Group"
            onPress={() =>
              Alert.prompt("Enter a group name", "", (text) => dispatch(ADD_GROUP(text)))
            }
          />
        </View> */}

        {show.accessList && (
          <>
            <SectionLabel label="Access List" />
            {show.accessList.map((a, i) => (
              <FormLine
                key={i}
                color={GlobalColors.text_primary}
                editing={false}
                value={a}
                onChange={() => null}
              />
            ))}
          </>
        )}
        <RoundButton
          label="Delete Show"
          altColor
          style={{ marginTop: Sizes.m }}
          onPress={handleDelete}
        />
      </ScrollView>
    </PageContainer>
  );
};

export default ShowSettings;

const CastGroups = () => {
  const { groups } = useAppSelector((state) => state.cast);
  const dispatch = useAppDispatch();

  return (
    <View>
      {groups.map((group, index) => {
        return (
          <Swipeable key={group} onDelete={() => dispatch(DELETE_GROUP(group))}>
            <TextInput
              style={GlobalStyles.text_medium}
              onEndEditing={({ nativeEvent: { text } }) => dispatch(UPDATE_GROUP({ index, text }))}
            >
              {group}
            </TextInput>
          </Swipeable>
        );
      })}
    </View>
  );
};

const SectionLabel = ({ label }: { label: string }) => {
  return (
    <View style={styles.formLine}>
      <Text style={styles.text_label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  formLine: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Sizes.s,
  },
  text_label: {
    ...GlobalStyles.text_label,
  },
});
