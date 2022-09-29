import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { ScrollView, SafeAreaView, Text, Alert } from "react-native";
import { BarLink, PageHeader } from "../Components";
import { useAppSelector } from "../Redux/hooks";
import { GlobalStyles } from "../Util/GlobalStyles";
import { AppRoutes } from "../Util/Routes";

interface Props {
  navigation: StackNavigationProp<AppRoutes, "Home">;
}

const Home = ({ navigation }: Props) => {
  const show = useAppSelector((state) => state.show);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      Alert.alert("What you've got to understand is", "", [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          style: "destructive",
          onPress: () => {
            navigation.dispatch(e.data.action);
          },
        },
      ]);
    });
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader
        back
        backLabel="Exit Show"
        onBack={() => navigation.goBack()}
      />
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
        <BarLink
          label={"Cue Sheets"}
          onPress={() => navigation.navigate("CueSheets")}
        />
        <BarLink
          label={"To Dos"}
          onPress={() => navigation.navigate("Todos")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
