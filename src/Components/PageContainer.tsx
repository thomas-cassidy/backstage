import { View, SafeAreaView } from "react-native";
import React, { PropsWithChildren } from "react";
import { GlobalColors, GlobalStyles } from "../Util/GlobalStyles";

const PageContainer = ({ children, light }: PropsWithChildren<{ light?: boolean }>) => {
  return (
    <View
      style={[
        GlobalStyles.container,
        { backgroundColor: light ? "#fff" : GlobalColors.background },
      ]}
    >
      <SafeAreaView>{children}</SafeAreaView>
    </View>
  );
};

export default PageContainer;
