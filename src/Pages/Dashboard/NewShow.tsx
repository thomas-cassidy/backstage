import React, { useState } from "react";
import { View, SafeAreaView, Dimensions, StyleSheet, Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { validateName, validatePassword } from "../../Util/FormValidation";
import { useAppDispatch } from "../../Redux/hooks";
import { ADD_SHOW } from "../../Redux/show";
import DismissKeyboard from "../../Components/DismissKeyboard";

const { width } = Dimensions.get("window");

interface Props {
  route: RouteProp<AppRoutes, "NewShow">;
  navigation: StackNavigationProp<AppRoutes, "NewShow">;
}

const NewShow = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { inner, form } = makeStyles();
  const [showName, setShowName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasword] = useState("");

  const handleSubmit = async () => {
    if (validateName(showName).status === "error")
      return Alert.alert("You must have a show name with at least 3 characters");
    const passwordValidation = validatePassword(password);
    if (passwordValidation.status === "error") return Alert.alert(passwordValidation.error);
    if (password !== confirmPassword) return Alert.alert("Your passwords do not match");

    dispatch(ADD_SHOW({ name: showName, password, confirmPassword })).then((e) => {
      if (e.meta.requestStatus === "fulfilled") navigation.navigate("Home");
    });
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader label="Create a Show" />
      <DismissKeyboard>
        <View style={inner}>
          <View style={form}>
            <FormLine
              label="Show Name"
              editing={true}
              color={GlobalColors.text_primary}
              onChangeText={(e) => setShowName(e)}
              value={showName}
              textContentType={"name"}
            />
            <FormLine
              label="Password"
              editing={true}
              color={GlobalColors.text_primary}
              value={password}
              onChangeText={(e) => setPassword(e)}
              textContentType={"password"}
            />
            <FormLine
              label="Confirm Password"
              editing={true}
              color={GlobalColors.text_primary}
              value={confirmPassword}
              onChangeText={(e) => setConfirmPasword(e)}
              textContentType={"password"}
            />
          </View>
          <RoundButton label="Create" onPress={handleSubmit} />
        </View>
      </DismissKeyboard>
    </SafeAreaView>
  );
};

export default NewShow;

const makeStyles = () =>
  StyleSheet.create({
    inner: {
      flex: 1,
      padding: Sizes.m,
      width,
    },
    form: {
      flex: 1,
    },
  });
