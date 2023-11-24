import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LoadAssets } from "./src/Components";
import { Provider } from "react-redux";
import store, { storePersistor } from "./src/Redux/store";
import Navigator from "./src/Util/Navigator";
import { PersistGate } from "redux-persist/integration/react";
import { GlobalColors } from "./src/Util/GlobalStyles";

export default function App() {
  return (
    <PersistGate persistor={storePersistor}>
      <Provider store={store}>
        <LoadAssets>
          <StatusBar style={"light"} />
          <NavigationContainer
            theme={{
              colors: {
                background: GlobalColors.background,
              },
            }}
          >
            <Navigator />
          </NavigationContainer>
        </LoadAssets>
      </Provider>
    </PersistGate>
  );
}
