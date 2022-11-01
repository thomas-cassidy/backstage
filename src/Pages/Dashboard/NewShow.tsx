import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { AXIOS_API } from "../../Util/Axios";

const { width } = Dimensions.get("window");

interface Props {
  route: RouteProp<AppRoutes, "NewShow">;
  navigation: StackNavigationProp<AppRoutes, "NewShow">;
}

const NewShow = ({ navigation }: Props) => {
  const { inner, form } = makeStyles();
  const [showName, setShowName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasword] = useState("");

  const handleSubmit = async () => {
    console.log(showName, password, password);

    try {
      const response = await AXIOS_API.post("/shows", {
        name: showName,
        password,
        confirmPassword,
      });
      console.log(response.data);
    } catch (e) {
      console.log(Alert.alert("Network Error", "Check your connection"));
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader label="Create a Show" />
      <View style={inner}>
        <View style={form}>
          <FormLine
            label="Show Name"
            editing={true}
            color={GlobalColors.text_primary}
            onChange={(e) => setShowName(e)}
            value={showName}
          />
          <FormLine
            label="Password"
            editing={true}
            color={GlobalColors.text_primary}
            value={password}
            onChange={(e) => setPassword(e)}
            textContentType={"password"}
          />
          <FormLine
            label="Confirm Password"
            editing={true}
            color={GlobalColors.text_primary}
            value={confirmPassword}
            onChange={(e) => setConfirmPasword(e)}
            textContentType={"password"}
          />
        </View>
        <RoundButton label="Create" onPress={handleSubmit} />
      </View>
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