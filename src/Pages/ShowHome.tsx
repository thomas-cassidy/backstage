import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect } from "react";
import { ScrollView, SafeAreaView, Alert, Text, View } from "react-native";
import { BarLink, PageHeader } from "../Components";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { GlobalStyles } from "../Util/GlobalStyles";
import { AppRoutes } from "../Util/Routes";
import { IAuthState, LOGOUT_ASYNC } from "../Redux/auth";
import { EventArg, useIsFocused } from "@react-navigation/native";
import { GET_SHOW_BACKGROUND, ShowState } from "../Redux/show";
import { AppDispatch } from "../Redux/store";

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

  const refresh = useCallback(() => dispatch(GET_SHOW_BACKGROUND({ showId: show._id })), []);

  const focussed = useIsFocused();

  useEffect(() => {
    focussed && refresh();
  }, [focussed]);

  //this is making sure we navigate away from here if use is logged out
  useEffect(() => {
    if (auth.loggedIn === false) {
      console.log("loggedOut");
      dispatch(LOGOUT_ASYNC);
    }
  }, [auth.loggedIn]);

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
    };
    navigation.addListener("beforeRemove", preventEscape);

    return () => {
      navigation.removeListener("beforeRemove", preventEscape);
    };
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader back backLabel="Exit Show" onBack={() => navigation.goBack()} />
      {/* <Image
        source={require("../../assets/NT.png")}
        style={{
          width: width - Sizes.l,
          height: width - Sizes.l,
          resizeMode: "contain",
        }}
        width={width}
      /> */}
      <Text style={GlobalStyles.page_header}>{show.name}</Text>
      <ScrollView style={{ flex: 1 }}>
        <BarLink label={"Cast"} onPress={() => navigation.navigate("Cast")} />
        <BarLink label={"Cue Sheets"} onPress={() => navigation.navigate("CueSheets")} />
        <BarLink label={"To Dos"} onPress={() => navigation.navigate("Todos")} />
        <BarLink label={"Settings"} onPress={() => navigation.navigate("ShowSettings")} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Container;
