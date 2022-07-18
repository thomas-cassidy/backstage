import { View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAppDispatch } from "../../Redux/hooks";
import { LOGIN_ASYNC } from "../../Redux/auth";
import { AppRoutes } from "../../Util/Routes";

const { container, text_small } = GlobalStyles;

interface Props {
    navigation: StackNavigationProp<AppRoutes, "Login">;
}

const Login = ({ navigation }: Props) => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("tomcass@me.com");
    const [password, setPassword] = useState("123");

    return (
        <SafeAreaView style={container}>
            <PageHeader label='theatreBackstage' />
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    paddingHorizontal: Sizes.l,
                    justifyContent: "center",
                }}
            >
                <FormLine
                    label='email'
                    color='white'
                    editing={true}
                    onChange={(e) => setEmail(e)}
                    value={email}
                    textContentType={"emailAddress"}
                />
                <View style={{ height: Sizes.l }} />
                <FormLine
                    label='password'
                    color='white'
                    editing={true}
                    onChange={(e) => setPassword(e)}
                    value={password}
                    textContentType={"password"}
                />
            </View>
            <RoundButton
                label='Login'
                onPress={() => {
                    dispatch(LOGIN_ASYNC({ email, password }));
                }}
            />
            <View style={{ flexDirection: "row", paddingVertical: Sizes.s }}>
                <Text style={{ ...text_small, marginRight: Sizes.s }}>
                    Don't have an account yet?
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text
                        style={{ ...text_small, color: GlobalColors.tertiary }}
                    >
                        Register here
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Login;
