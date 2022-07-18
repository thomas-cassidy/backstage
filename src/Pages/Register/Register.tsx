import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { SET_LOGGED_IN } from "../../Redux/auth";
import { useAppDispatch } from "../../Redux/hooks";
import { Sizes, GlobalColors, GlobalStyles } from "../../Util/GlobalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { validateEmail } from "../../Util/FormValidation";

const { text_small, container } = GlobalStyles;

type Props = {
    navigation: StackNavigationProp<any, "Register">;
};

const NO_ERRORS = { name: "", email: "", password: "" };

const Register = ({ navigation }: Props) => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [errors, setErrors] = useState({ ...NO_ERRORS });

    const handleSubmit = () => {
        let newErrors = { ...NO_ERRORS };
        if (!validateEmail(email)) newErrors.email = "Invalid Email";
        if (!validateEmail(email)) newErrors.email = "Invalid Email";

        setErrors(newErrors);
    };

    useEffect(() => {
        setErrors({ ...NO_ERRORS });
    }, [name, email, password]);

    return (
        <SafeAreaView style={container}>
            <PageHeader label='theatreBackstage' />
            <KeyboardAvoidingView
                behavior='padding'
                style={{
                    flex: 1,
                    width: "100%",
                    paddingHorizontal: Sizes.l,
                    justifyContent: "center",
                }}
            >
                <FormLine
                    label='name'
                    color='white'
                    editing={true}
                    onChange={(e) => setName(e.nativeEvent.text)}
                    value={name}
                    textContentType={"username"}
                />
                <View style={{ height: Sizes.l }}>
                    {errors.name ? <FormError text={errors.name} /> : null}
                </View>
                <FormLine
                    label='email'
                    color='white'
                    editing={true}
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                    value={email}
                    textContentType={"emailAddress"}
                />
                <View style={{ height: Sizes.l }}>
                    {errors.email ? <FormError text={errors.email} /> : null}
                </View>
                <FormLine
                    label='password'
                    color='white'
                    editing={true}
                    onChange={(e) => setPassword(e.nativeEvent.text)}
                    value={password}
                    textContentType={"password"}
                />
                <View style={{ height: Sizes.l }}>
                    {errors.password ? (
                        <FormError text={errors.password} />
                    ) : null}
                </View>
                <FormLine
                    label='re-enter password'
                    color='white'
                    editing={true}
                    onChange={(e) => setPassword2(e.nativeEvent.text)}
                    value={password2}
                    textContentType={"password"}
                />
            </KeyboardAvoidingView>
            <RoundButton label='Register' onPress={handleSubmit} />
            <View style={{ flexDirection: "row", paddingVertical: Sizes.s }}>
                <Text style={{ ...text_small, marginRight: Sizes.s }}>
                    Already have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Text
                        style={{ ...text_small, color: GlobalColors.tertiary }}
                    >
                        Press here Login
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Register;

const FormError = ({ text }: { text: string }) => {
    return (
        <View
            style={{
                backgroundColor: "red",
                borderRadius: Sizes.s,
                paddingHorizontal: Sizes.m,
                paddingVertical: Sizes.xs,
            }}
        >
            <Text style={text_small}>{text}</Text>
        </View>
    );
};
