import { TouchableWithoutFeedback, Keyboard, TouchableWithoutFeedbackProps } from "react-native";
import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren, TouchableWithoutFeedbackProps {}

const DismissKeyboard = ({ children, style }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={style}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
