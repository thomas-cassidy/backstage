import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ScrollView,
  SafeAreaView,
  Alert,
  Text,
  View,
  AppStateStatus,
  AppState,
} from "react-native";
import { BarLink, PageHeader } from "../Components";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { GlobalStyles } from "../Util/GlobalStyles";
import { AppRoutes } from "../Util/Routes";
import { IAuthState, LOGOUT_ASYNC } from "../Redux/auth";
import { EventArg, useIsFocused } from "@react-navigation/native";
import { GET_SHOW_BACKGROUND, ShowState } from "../Redux/show";
import { AppDispatch } from "../Redux/store";
import { CONNECT_WEBSOCKET } from "../Redux/websocket";

interface ContainerProps {
  navigation: StackNavigationProp<AppRoutes, "Home">;
}

const Container = ({ navigation }: ContainerProps) => {
  const auth = useAppSelector((state) => state.auth);
  const show = useAppSelector((state) => state.show);
  const dispatch = useAppDispatch();

  if (!auth || !show || !dispatch) return <View />;

  return <Home {...{ navigation, auth, show, dispatch }} />;
};

interface HomeProps extends ContainerProps {
  auth: IAuthState;
  show: ShowState;
  dispatch: AppDispatch;
}

const Home = ({ navigation }: HomeProps) => {
  const auth = useAppSelector((state) => state.auth);
  const show = useAppSelector((state) => state.show);
  const dispatch = useAppDispatch();
  const appState = useRef(AppState.currentState);

  const refresh = useCallback(() => dispatch(GET_SHOW_BACKGROUND({ showId: show._id })), []);

  const focussed = useIsFocused();

  useEffect(() => {
    focussed && refresh();
  }, [focussed]);

  //this is making sure we navigate away from here if user is logged out
  useEffect(() => {
    if (auth.loggedIn === false) {
      console.log("loggedOut");
      dispatch(LOGOUT_ASYNC());
    }
  }, [auth.loggedIn]);

  //connects to chat websocket for the show
  useEffect(() => {
    dispatch(CONNECT_WEBSOCKET());

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        dispatch(CONNECT_WEBSOCKET());
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      // dispatch(CLOSE_WS());
      subscription.remove();
    };
  }, [dispatch]);

  useEffect(() => {
    const preventEscape = (
      e: EventArg<
        "beforeRemove",
        true,
        {
          action: Readonly<{
            type: string;
            payload?: object | undefined;
            source?: string | undefined;
            target?: string | undefined;
          }>;
        }
      >
    ) => {
      if (show._id !== -1) {
        e.preventDefault();
        Alert.alert(
          "Are you sure you want to exit the show?",
          "",
          [
            { text: "Cancel", style: "cancel", onPress: () => null },
            {
              text: "Yes",
              style: "destructive",
              onPress: () => {
                navigation.dispatch(e.data.action);
              },
            },
          ],
          { cancelable: true }
        );
      }
    };
    navigation.addListener("beforeRemove", preventEscape);

    return () => {
      navigation.removeListener("beforeRemove", preventEscape);
    };
  }, [show._id]);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader back backLabel="Exit Show" onBack={() => navigation.goBack()} />
      <Text style={GlobalStyles.page_header}>{show.name}</Text>
      <ScrollView style={{ flex: 1 }}>
        <BarLink label={"Cast"} onPress={() => navigation.navigate("Cast")} />
        <BarLink label={"Cue Sheets"} onPress={() => navigation.navigate("CueSheets")} />
        <BarLink label={"To Dos"} onPress={() => navigation.navigate("Todos")} />
        <BarLink label={"Chat"} onPress={() => navigation.navigate("Chat")} />
        <BarLink label={"Settings"} onPress={() => navigation.navigate("ShowSettings")} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Container;
