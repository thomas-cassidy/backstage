import { Alert, Text, View } from "react-native";
import React, { useEffect } from "react";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarLink, Footer, PageHeader } from "../../Components";
import { AppRoutes } from "../../Util/Routes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { ScrollView } from "react-native-gesture-handler";
import { GET_SHOW_ASYNC } from "../../Redux/show";
import { SET_HAS_NOT_SEEN_HINT } from "../../Redux/status";

const { container, text_medium } = GlobalStyles;

type Props = {
  navigation: StackNavigationProp<AppRoutes, "Home">;
};

const Dashboard = ({ navigation }: Props) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(()=>{dispatch(SET_HAS_NOT_SEEN_HINT())},[])

  if (!user) {
    return <></>;
  }

  return (
    <SafeAreaView style={container}>
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
