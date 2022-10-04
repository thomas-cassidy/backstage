import { ScrollView, Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
    FORM_LINE_HEIGHT,
    GlobalColors,
    GlobalStyles,
    Sizes,
} from "../../Util/GlobalStyles";
import { FormLine, PageContainer, PageHeader, Spacer } from "../../Components";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { AXIOS_API } from "../../Util/Axios";
import Swipeable from "../../Components/Swipeable";
import { DELETE_GROUP } from "../../Redux/cast";

interface Props {
    navigation: StackNavigationProp<AppRoutes, "ShowSettings">;
}

const ShowSettings = ({ navigation }: Props) => {
    const show = useAppSelector((state) => state.show);
    const [ownerEmail, setOwnerEmail] = useState(null);

    const getOwnerEmail = async () => {
        const res = await AXIOS_API(`/users/getName/${show.owner}`);
        setOwnerEmail(res.data.user);
    };
    useEffect(() => {
        getOwnerEmail();
    }, []);

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
                <SectionLabel label='Cast Groups' />
                <CastGroups />
                {ownerEmail && (
                    <FormLine
                        color={GlobalColors.text_primary}
                        editing={true}
                        label='Owner'
                        value={ownerEmail}
                        onChange={() => null}
                    />
                )}
                <Spacer />
                <SectionLabel label='Access List' />
                {show.accessList &&
                    show.accessList.map((a, i) => (
                        <FormLine
                            key={i}
                            color={GlobalColors.text_primary}
                            editing={false}
                            label=''
                            value={a}
                            onChange={() => null}
                        />
                    ))}
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
                contentContainerStyle={{
                    maxHeight: FORM_LINE_HEIGHT * 3,
                    paddingHorizontal: Sizes.s,
                }}
            >
                {groups.map((group, i) => {
                    return (
                        <Swipeable
                            key={group}
                            onDelete={() => dispatch(DELETE_GROUP(group))}
                        >
                            <Text style={GlobalStyles.text_medium}>
                                {group}
                            </Text>
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
