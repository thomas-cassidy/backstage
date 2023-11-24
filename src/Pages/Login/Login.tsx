import { View, Text, SafeAreaView, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { CLEAR_ERROR, LOGIN_ASYNC } from "../../Redux/auth";
import { AppRoutes } from "../../Util/Routes";
import { SET_LOADED } from "../../Redux/status";

const { container, text_small, text_medium } = GlobalStyles;

interface Props {
  navigation: StackNavigationProp<AppRoutes, "Login">;
}

const Login = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const opacityVal = new Animated.Value(1);
  const opacityRef = useRef(opacityVal).current;
  useEffect(() => {
    dispatch(SET_LOADED());
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

  const handleLogin = () => {
    if (status === "loading") return;
    dispatch(LOGIN_ASYNC({ email, password }));
  };

  return (
    <SafeAreaView style={container}>
      <PageHeader label="theatreBackstage" />
      <View
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
                  ...text_medium,
                  color: GlobalColors.tertiary,
                }}
              >
                {error}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <FormLine
          label="email"
          color="white"
          editing={true}
          onChangeText={(e) => setEmail(e)}
          value={email}
          textContentType={"username"}
        />
        <View style={{ height: Sizes.l }} />
        <FormLine
          label="password"
          color="white"
          editing={true}
          onChangeText={(e) => setPassword(e)}
          value={password}
          textContentType={"password"}
          onSubmitEditing={handleLogin}
        />
      </View>
      <RoundButton label="Login" onPress={handleLogin} />
      <View style={{ flexDirection: "row", paddingVertical: Sizes.s }}>
        <Text style={{ ...text_small, marginRight: Sizes.s }}>Don't have an account yet?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={{ ...text_small, color: GlobalColors.tertiary }}>Register here</Text>
        </TouchableOpacity>
      </View>
      {/* {status === "loading" && (
                <View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ActivityIndicator
                        size={"large"}
                        style={{
                            position: "absolute",
                        }}
                    />
                </View>
            )} */}
    </SafeAreaView>
  );
};

export default Login;
