import { Alert, Image, Text, View } from "react-native";
import React, { useEffect } from "react";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarLink, Footer, PageHeader } from "../../Components";
import { AppRoutes } from "../../Util/Routes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { ScrollView } from "react-native-gesture-handler";
import { GET_SHOW_ASYNC } from "../../Redux/show";
import { SET_HAS_NOT_SEEN_HINT, SET_PUSH_TOKEN } from "../../Redux/status";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Dimensions } from "react-native";

const { container, text_medium } = GlobalStyles;
const { width } = Dimensions.get("screen");

type Props = {
  navigation: StackNavigationProp<AppRoutes, "Home">;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const setupNotifications = async () => {
  const perm = await Notifications.getPermissionsAsync();
  if (perm.status !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("No notification permissions!");
      return;
    }
  }

  try {
    let projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    projectId;
    if (!projectId) {
      throw new Error("No ProjectId found");
    }

    let token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log("Push Token", token);
    return token;
  } catch (e) {
    console.log(e);
    Alert.alert(
      "Error",
      "No ProjectId found. You must use a physical device to receive notifications."
    );
  }
};

const Dashboard = ({ navigation }: Props) => {
  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(SET_HAS_NOT_SEEN_HINT());
  }, []);

  // const notificationListener = React.useRef<Notifications.EventSubscription>();

  useEffect(() => {
    setupNotifications().then((token) => {
      token && SET_PUSH_TOKEN(token);
    });

    // notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
    //   console.log("notification", notification);
    // });

    // return () => {
    //   notificationListener.current &&
    //     Notifications.removeNotificationSubscription(notificationListener.current);
    // };
  }, []);

  if (!user) {
    return <></>;
  }

  return (
    <SafeAreaView style={container}>
      <Image
        source={require("../../../assets/NT.png")}
        style={{
          width: width / 2,
          height: width / 2,
          resizeMode: "contain",
        }}
        // width={width}
      />
      <PageHeader label={`Welcome, ${user?.name.split(" ")[0]}`} />
      <View style={{ flex: 1, paddingTop: Sizes.m }}>
        <Text
          style={{
            ...text_medium,
            paddingLeft: Sizes.m,
            color: GlobalColors.secondary,
          }}
        >
          Shows:
        </Text>

        {user.shows.length === 0 && (
          <>
            <Text style={[GlobalStyles.text_medium, { paddingHorizontal: Sizes.m }]}>
              You don't have any shows at the moment.
            </Text>
            <Text
              style={[
                GlobalStyles.text_medium,
                { paddingHorizontal: Sizes.m, paddingVertical: Sizes.s },
              ]}
            >
              Create a new show or join an existing show using the buttons below.
            </Text>
          </>
        )}
        <ScrollView scrollEnabled={user.shows.length > 4}>
          {user.shows.map((show, i) => (
            <BarLink
              label={show.name}
              key={show._id}
              onPress={() => {
                dispatch(GET_SHOW_ASYNC({ showId: show._id })).then((x) => {
                  if (x.meta.requestStatus === "fulfilled") navigation.navigate("Home");
                  else {
                    Alert.alert("Network Error", "Check your connection");
                  }
                });
              }}
            />
          ))}
        </ScrollView>
      </View>

      <Footer />
    </SafeAreaView>
  );
};

export default Dashboard;
