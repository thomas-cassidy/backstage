import React, { ReactNode, useCallback, useEffect, useState } from "react";
import * as AppLoading from "expo-splash-screen";
import { View } from "react-native";

interface Props {
    children: ReactNode;
}

AppLoading.preventAutoHideAsync();

const LoadAssets = ({ children }: Props) => {
    const [ready, setReady] = useState(false);

    const readyApp = useCallback(async () => {
        await AppLoading.hideAsync();
    }, [ready]);

    useEffect(() => {
        return setReady(true);
    }, []);

    if (!ready) {
        return null;
    } else {
        return (
            <View style={{ flex: 1 }} onLayout={readyApp}>
                {children}
            </View>
        );
    }
};

export default LoadAssets;
