import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Alert, Dimensions, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarLink, PageHeader, RoundButton, Swipeable } from "../../Components";
import { useAppSelector } from "../../Redux/hooks";
import { GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { AppRoutes } from "../../Util/Routes";

const { width } = Dimensions.get("window");

interface Props {
  navigation: StackNavigationProp<AppRoutes, "CueSheets">;
}

const CueSheets = ({ navigation }: Props) => {
  const { plots } = useAppSelector((state) => state.plots);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader label="Cue Sheets" back onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, paddingVertical: Sizes.s, width }}>
        {plots.length === 0 ? (
          <BarLink label={"Press below to add your first plot..."} style={{ height: 100 }} />
        ) : (
          plots.map((plot, index) => (
            <Swipeable
              key={index}
              canDelete
              onDeleteMessage={{
                title: "Are you sure you wish to delete this plot?",
                message: "This cannot be undone",
              }}
              onDelete={() => Alert.alert("This feature is not implemented yet")}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  navigation.navigate("PlotPage", {
                    _id: plot._id,
                  })
                }
              >
                <Text style={GlobalStyles.text_medium}>{plot.name}</Text>
              </TouchableOpacity>
            </Swipeable>
          ))
        )}
      </ScrollView>
      <RoundButton label={"New Plot"} onPress={() => navigation.navigate("NewCueSheet")} />
    </SafeAreaView>
  );
};

export default CueSheets;
