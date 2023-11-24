import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  useAnimatedValue,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { Sizes, GlobalColors, GlobalStyles } from "../../Util/GlobalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { validateEmail, validateName, validatePassword } from "../../Util/FormValidation";
import { CLEAR_ERROR, REGISTER } from "../../Redux/auth";
import { SET_LOADED } from "../../Redux/status";
import { getAuth } from "../../Redux/Helpers";

const { text_small, container } = GlobalStyles;

type Props = {
  navigation: StackNavigationProp<any, "Register">;
};

const NO_ERRORS = { name: "", email: "", password: "" };

const Register = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(getAuth);
  const [name, setName] = useState("Test User 2");
  const [email, setEmail] = useState("plop@testuser.com");
  const [password, setPassword] = useState("Plop1234");
  const [password2, setPassword2] = useState("Plop1234");
  const [errors, setErrors] = useState({ ...NO_ERRORS });
  const nameErrorHeight = useAnimatedValue(Sizes.m);
  const emailErrorHeight = useAnimatedValue(Sizes.m);
  const passwordErrorHeight = useAnimatedValue(30);

  const opacityVal = new Animated.Value(1);
  const opacityRef = useRef(opacityVal).current;
  useEffect(() => {
    dispatch(SET_LOADED());
    dispatch(CLEAR_ERROR());
  }, []);

  useEffect(() => {
    if (error) {
      let errorTimeout = setTimeout(() => {
        Animated.timing(opacityRef, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          dispatch(CLEAR_ERROR());
          opacityRef.setValue(1);
        });
      }, 10000);

      return () => {
        clearTimeout(errorTimeout);
      };
    }
  }, [error]);

  const handleSubmit = () => {
    let newErrors = { ...NO_ERRORS };

    let nameValidation = validateName(name);
    let emailValidation = validateEmail(email);
    let passwordValidation = validatePassword(password);

    if (nameValidation.status === "error") {
      newErrors.name = nameValidation.error;
      Animated.timing(nameErrorHeight, { toValue: 40, useNativeDriver: false }).start();
    }
    if (emailValidation.status === "error") {
      newErrors.email = emailValidation.error;
      Animated.timing(emailErrorHeight, { toValue: 40, useNativeDriver: false }).start();
    }
    if (passwordValidation.status === "error") {
      newErrors.password = passwordValidation.error;
      Animated.timing(passwordErrorHeight, { toValue: 40, useNativeDriver: false }).start();
    } else if (password2 != password) {
      newErrors.password = "Passwords do not match";
      Animated.timing(passwordErrorHeight, { toValue: 40, useNativeDriver: false }).start();
    }
    if (!newErrors.email && !newErrors.name && !newErrors.password)
      dispatch(REGISTER({ name, email, password, confirmPassword: password2 }));
    setErrors(newErrors);
  };

  useEffect(() => {
    setErrors({ ...NO_ERRORS });
    emailErrorHeight.setValue(Sizes.s);
    nameErrorHeight.setValue(Sizes.s);
    passwordErrorHeight.setValue(Sizes.s);
  }, [name, email, password, password2]);

  return (
    <SafeAreaView style={container}>
      <PageHeader label="theatreBackstage" />
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
          width: "100%",
          paddingHorizontal: Sizes.l,
          justifyContent: "center",
        }}
      >
        {error && (
          <Animated.View
            style={{
              zIndex: 2,
              width: "90%",
              position: "absolute",
              opacity: opacityRef,
              left: "15%",
              top: 0,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: Sizes.m,
                paddingVertical: Sizes.s,
              }}
              onPress={() => dispatch(CLEAR_ERROR())}
            >
              <Text
                style={{
                  ...GlobalStyles.text_medium,
                  color: GlobalColors.tertiary,
                }}
              >
                {error}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <FormLine
          label="name"
          color="white"
          editing={true}
          onChangeText={(e) => setName(e)}
          value={name}
          textContentType={"username"}
        />
        <Animated.View style={{ height: nameErrorHeight, overflow: "hidden" }}>
          {errors.name ? <FormError text={errors.name} /> : null}
        </Animated.View>
        <FormLine
          label="email"
          color="white"
          editing={true}
          onChangeText={(e) => setEmail(e)}
          value={email}
          textContentType={"emailAddress"}
        />
        <Animated.View style={{ height: emailErrorHeight, overflow: "hidden" }}>
          {errors.email ? <FormError text={errors.email} /> : null}
        </Animated.View>
        <FormLine
          label="password"
          color="white"
          editing={true}
          onChangeText={(e) => setPassword(e)}
          value={password}
          textContentType={"password"}
        />
        <Animated.View style={{ height: passwordErrorHeight, overflow: "hidden" }}>
          {errors.password ? <FormError text={errors.password} /> : null}
        </Animated.View>
        <FormLine
          label="re-enter password"
          color="white"
          editing={true}
          onChangeText={(e) => setPassword2(e)}
          value={password2}
          textContentType={"password"}
        />
      </KeyboardAvoidingView>
      <RoundButton label="Register" onPress={handleSubmit} />
      <View style={{ flexDirection: "row", paddingVertical: Sizes.s }}>
        <Text style={{ ...text_small, marginRight: Sizes.s }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Text style={{ ...text_small, color: GlobalColors.tertiary }}>Press here Login</Text>
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
        borderBottomLeftRadius: Sizes.m,
        borderBottomRightRadius: Sizes.m,
        paddingHorizontal: Sizes.m,
        paddingVertical: Sizes.xs,
        height: "100%",
        opacity: 0.8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={text_small}>{text}</Text>
    </View>
  );
};
