import { Text } from "react-native";
import React from "react";
import { RoundButton } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { LOGOUT_ASYNC } from "../../Redux/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "../../Util/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
                label='Check Storage'
                onPress={async () =>
                    console.log(await AsyncStorage.getItem("THEATRE_APP_STATE"))
                }
            />
        </SafeAreaView>
    );
};

export default Settings;
