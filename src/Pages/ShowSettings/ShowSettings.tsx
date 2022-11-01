import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import React from "react";
import {
    FORM_LINE_HEIGHT,
    GlobalColors,
    GlobalStyles,
    Sizes,
} from "../../Util/GlobalStyles";
import {
    FormLine,
    PageContainer,
    PageHeader,
    RoundButton,
    Spacer,
} from "../../Components";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import Swipeable from "../../Components/Swipeable";
import { ADD_GROUP, DELETE_GROUP, UPDATE_GROUP } from "../../Redux/cast";

interface Props {
    navigation: StackNavigationProp<AppRoutes, "ShowSettings">;
}

const ShowSettings = ({ navigation }: Props) => {
    const show = useAppSelector((state) => state.show);
    const dispatch = useAppDispatch();

    return (
        <PageContainer>
            <PageHeader
                label='Settings'
                back
                onBack={() => navigation.goBack()}
            />
            <View style={{ flex: 1, padding: Sizes.m }}>
                <FormLine
                    color={GlobalColors.text_primary}
                    editing={true}
                    label='Show Name'
                    value={show.name}
                    onChange={() => null}
                />
                <Spacer />
                <SectionLabel label='Cast Groups' />
                <CastGroups />
                <View style={{ alignItems: "flex-end" }}>
                    <RoundButton
                        label='Add Group'
                        onPress={() =>
                            Alert.prompt("Enter a group name", "", (text) =>
                                dispatch(ADD_GROUP(text))
                            )
                        }
                    />
                </View>

                {show.accessList && (
                    <>
                        <SectionLabel label='Access List' />
                        {show.accessList.map((a, i) => (
                            <FormLine
                                key={i}
                                color={GlobalColors.text_primary}
                                editing={false}
                                label=''
                                value={a}
                                onChange={() => null}
                            />
                        ))}
                    </>
                )}
            </View>
        </PageContainer>
    );
};

export default ShowSettings;

const CastGroups = () => {
    const { groups } = useAppSelector((state) => state.cast);
    const dispatch = useAppDispatch();

    return (
        <View
            style={{
                height: FORM_LINE_HEIGHT * 3 + Sizes.s,
            }}
        >
            <ScrollView
                style={{
                    maxHeight: FORM_LINE_HEIGHT * 3,
                }}
            >
                {groups.map((group, index) => {
                    return (
                        <Swipeable
                            key={group}
                            onDelete={() => dispatch(DELETE_GROUP(group))}
                        >
                            <TextInput
                                style={{
                                    ...GlobalStyles.text_medium,
                                    paddingHorizontal: Sizes.s,
                                }}
                                onEndEditing={({ nativeEvent: { text } }) =>
                                    dispatch(UPDATE_GROUP({ index, text }))
                                }
                            >
                                {group}
                            </TextInput>
                        </Swipeable>
                    );
                })}
            </ScrollView>
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
