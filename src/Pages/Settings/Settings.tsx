import React, { useState } from "react";
import { FormLine, PageHeader, Picker, RoundButton } from "../../Components";
import { useAppDispatch } from "../../Redux/hooks";
import { LOGOUT_ASYNC } from "../../Redux/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import DismissKeyboard from "../../Components/DismissKeyboard";
import { KeyboardAvoidingView, Text, TouchableOpacity } from "react-native";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";
const { container } = GlobalStyles;

type Props = {};

const options: ItemValue[] = ["plop1", "plop2", "plop3", "plop4"];

const Settings = (props: Props) => {
  const dispatch = useAppDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <SafeAreaView style={container}>
      <PageHeader label="Settings" />
      <DismissKeyboard>
        <KeyboardAvoidingView
          style={[container, { paddingHorizontal: Sizes.m, justifyContent: "space-evenly" }]}
          behavior="padding"
        >
          {/* <FormLine editing={true} value="This doesn't work yet" label="Change Password" />

          <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
            <Text style={GlobalStyles.text_medium}>{selected}</Text>
            <Picker
              visible={showPicker}
              value={selected}
              options={options}
              handleSelect={(v, i) => setSelected(v)}
              handleClose={() => setShowPicker(false)}
            />
          </TouchableOpacity> */}
          <RoundButton label="Log Out" onPress={() => dispatch(LOGOUT_ASYNC())} />
        </KeyboardAvoidingView>
      </DismissKeyboard>
    </SafeAreaView>
  );
};

export default Settings;
