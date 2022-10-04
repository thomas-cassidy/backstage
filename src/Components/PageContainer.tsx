import { View, SafeAreaView } from "react-native";
import React, { PropsWithChildren } from "react";
import { GlobalStyles } from "../Util/GlobalStyles";

const PageContainer = ({ children }: PropsWithChildren<any>) => {
    return (
        <View style={GlobalStyles.container}>
            <SafeAreaView>{children}</SafeAreaView>
        </View>
    );
};

export default PageContainer;
