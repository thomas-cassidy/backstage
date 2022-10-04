import { View } from "react-native";
import React from "react";
import { Sizes } from "../Util/GlobalStyles";

const Spacer = ({ size = "m" }: { size?: keyof typeof Sizes }) => {
    return <View style={{ height: Sizes[size] }} />;
};

export default Spacer;
