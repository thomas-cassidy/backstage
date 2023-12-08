import { View, Modal, Text, TouchableWithoutFeedback } from "react-native";
import React, { useRef } from "react";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { GlobalColors, GlobalStyles, Sizes } from "../Util/GlobalStyles";
import { TouchableOpacity } from "react-native";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";

type Props = {
  visible: boolean;
  value: ItemValue;
  options: ItemValue[];
  handleSelect?: (value: ItemValue, index: number) => void;
  handleClose: () => void;
};

const CustomPicker = ({
  visible,
  value,
  options,
  handleSelect = () => null,
  handleClose,
}: Props) => {
  const pickerRef = useRef<PickerIOS>(null);

  return (
    <Modal transparent collapsable {...{ visible }} animationType="slide">
      <TouchableWithoutFeedback style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <View
            style={{
              backgroundColor: GlobalColors.background,
              alignItems: "flex-end",
              paddingHorizontal: Sizes.m,
            }}
          >
            <TouchableOpacity onPress={handleClose}>
              <Text style={GlobalStyles.text_medium}>Close</Text>
            </TouchableOpacity>
          </View>
          <PickerIOS
            onValueChange={handleSelect}
            selectedValue={value}
            ref={pickerRef}
            style={{ backgroundColor: GlobalColors.background }}
            itemStyle={{ color: "white" }}
          >
            {options.map((o) => (
              <Picker.Item
                key={o}
                value={o}
                label={typeof o === "string" ? o : o.toString()}
                color="yellow"
              />
            ))}
          </PickerIOS>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomPicker;
