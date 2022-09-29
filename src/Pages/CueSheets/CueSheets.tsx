import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, SafeAreaView, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarLink, PageHeader, RoundButton } from "../../Components";
import { useAppSelector } from "../../Redux/hooks";
import { GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { AppRoutes } from "../../Util/Routes";

interface Props {
  navigation: StackNavigationProp<AppRoutes, "CueSheets">;
}

const { width } = Dimensions.get("window");

const CueSheets = ({ navigation }: Props) => {
  const { plots } = useAppSelector((state) => state.plots);

  //   console.log("CueSheets Page", plots);
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader label="Cue Sheets" />
      <ScrollView style={{ flex: 1, paddingVertical: Sizes.s }}>
        {plots.length === 0 ? (
          <BarLink
            label={"Press below to add your first plot..."}
            style={{ height: 100 }}
          />
        ) : (
          plots.map((plot, index) => (
            <BarLink
              key={index}
              label={plot.name}
              onPress={() => navigation.navigate("PlotPage", { _id: plot._id })}
            />
          ))
        )}
      </ScrollView>
      <RoundButton
        label={"New Plot"}
        onPress={() => navigation.navigate("NewCueSheet")}
      />
    </SafeAreaView>
  );
};

export default CueSheets;
