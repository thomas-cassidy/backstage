import { Text } from "react-native";
import React from "react";
import { RoundButton } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { LOGOUT_ASYNC } from "../../Redux/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "../../Util/GlobalStyles";
import { storePersistor } from "../../Redux/store";
import { refreshAccessToken } from "../../Util/RefreshAccessToken";
const { container } = GlobalStyles;

type Props = {};

const Settings = (props: Props) => {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state);
    return (
        <SafeAreaView style={container}>
            <Text>Settings</Text>
            <RoundButton
                label='Log Out'
                onPress={() => dispatch(LOGOUT_ASYNC())}
            />
            <RoundButton
                label='Check State'
                onPress={async () => console.log(state)}
            />
            <RoundButton
                label='Purge data'
                onPress={async () => await storePersistor.purge()}
            />
            <RoundButton
                label='Refresh Access'
                onPress={async () => await refreshAccessToken()}
            />
        </SafeAreaView>
    );
};

export default Settings;
