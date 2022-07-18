import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LoadAssets } from "./src/Components";
import { Provider } from "react-redux";
import store from "./src/Redux/store";
import Navigator from "./src/Util/Navigator";

export default function App() {
    return (
        <Provider store={store}>
            <LoadAssets>
                <StatusBar style={"light"} />
                <NavigationContainer>
                    <Navigator />
                </NavigationContainer>
            </LoadAssets>
        </Provider>
    );
}
