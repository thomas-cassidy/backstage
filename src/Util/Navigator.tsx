import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Dashboard,
  Home,
  Cast,
  CastMemberProfile,
  CueSheets,
  NewCueSheet,
  PlotPage,
  Todos,
  Login,
  Register,
  Settings,
  NewShow,
} from "../Pages";
import { useAppSelector } from "../Redux/hooks";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useInterceptors } from "./Axios";
// import { ImagePicker } from "../Components";
import { ShowSettings } from "../Pages/ShowSettings";
import { AppRoutes } from "./Routes";
import { Search } from "../Pages/Dashboard";

const MainStack = createStackNavigator<AppRoutes>();

const Navigator = () => {
  const auth = useAppSelector((state) => state.auth);
  const status = useAppSelector((state) => state.status);
  useInterceptors();

  return (
    <>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!auth.loggedIn ? (
          <>
            <MainStack.Screen component={Login} name={"Login"} />
            <MainStack.Screen component={Register} name={"Register"} />
          </>
        ) : (
          <>
            <MainStack.Screen component={Dashboard} name={"Dashboard"} />
            <MainStack.Screen
              component={Search}
              name={"Search"}
              options={{ presentation: "modal" }}
            />
            <MainStack.Screen
              component={NewShow}
              name={"NewShow"}
              options={{ presentation: "modal" }}
            />
            <MainStack.Screen component={Settings} name={"Settings"} />
            <MainStack.Screen component={Home} name={"Home"} />
            <MainStack.Screen component={Cast} name={"Cast"} />
            <MainStack.Screen
              component={CastMemberProfile}
              name={"CastProfile"}
              options={{ presentation: "modal" }}
            />
            <MainStack.Screen component={CueSheets} name={"CueSheets"} />
            <MainStack.Screen
              component={NewCueSheet}
              name={"NewCueSheet"}
              options={{ presentation: "modal" }}
            />
            <MainStack.Screen
              component={PlotPage}
              name={"PlotPage"}
              options={{ gestureEnabled: false }}
            />
            <MainStack.Screen component={Todos} name={"Todos"} />
            <MainStack.Screen component={ShowSettings} name={"ShowSettings"} />
          </>
        )}
      </MainStack.Navigator>
      {status.loading === "loading" && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator
            size={"large"}
            style={{
              position: "absolute",
            }}
          />
        </View>
      )}
    </>
  );
};

export default Navigator;
