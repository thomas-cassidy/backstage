import React from "react";
import { PageHeader, RoundButton } from "../../Components";
import { useAppDispatch } from "../../Redux/hooks";
import { LOGOUT_ASYNC } from "../../Redux/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import DismissKeyboard from "../../Components/DismissKeyboard";
import { Dimensions, KeyboardAvoidingView } from "react-native";
import { storePersistor } from "../../Redux/store";
const { container } = GlobalStyles;

const { width } = Dimensions.get("window");

type Props = {};

const Settings = (props: Props) => {
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={container}>
      <PageHeader label="Settings" />
      <DismissKeyboard>
        <KeyboardAvoidingView
          style={[container, { paddingHorizontal: Sizes.m, justifyContent: "space-evenly" }]}
          behavior="padding"
        >
          <RoundButton
            label="Make Change Password"
            onPress={() => null}
            style={{ width: width * 0.8 }}
          />
          <RoundButton
            label="Log Out"
            onPress={() => dispatch(LOGOUT_ASYNC())}
            style={{ width: width * 0.8 }}
          />
          <RoundButton
            label="Purge Data"
            onPress={() => storePersistor.purge()}
            style={{ width: width * 0.8 }}
          />
        </KeyboardAvoidingView>
      </DismissKeyboard>
    </SafeAreaView>
  );
};

export default Settings;
