import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { PageHeader } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { ADD_CUE, DELETE_CUE, EDIT_CUE } from "../../Redux/plots";
import { CueType, Plot } from "../../Types/AppTypes";
import {
  EditColors,
  GlobalColors,
  GlobalStyles,
} from "../../Util/GlobalStyles";
import { AppRoutes } from "../../Util/Routes";
import Cue from "./Cue";

const { width } = Dimensions.get("window");

interface Props {
  route: RouteProp<AppRoutes, "PlotPage">;
  navigation: StackNavigationProp<AppRoutes, "PlotPage">;
}

const PlotPageContainer = ({ route, navigation }: Props) => {
  const { _id } = route.params;
  const plots = useAppSelector(({ plots }) => plots.plots);

  const plot = plots.find((p) => p._id === _id);

  if (!plot) {
    return <Text>OH NO IT'S FUCKED</Text>;
  }
  return <PlotPage route={route} navigation={navigation} plot={plot} />;
};

type PlotPageProps = Props & {
  plot: Plot;
};

const PlotPage = ({ route, navigation, plot }: PlotPageProps) => {
  const { _id } = route.params;
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const handleScroll = (index: number) => {
    scrollRef.current?.scrollTo({ x: (index + 1) * width });
  };

  const handleChange = (index: number, field: keyof CueType, value: string) => {
    dispatch(EDIT_CUE({ ...{ _id, index, field, value } }));
  };
  const handleAddCue = async (index: number) => {
    await dispatch(ADD_CUE({ _id, index }));
    handleScroll(index);
  };
  const handleDelCue = async (index: number) => {
    dispatch(DELETE_CUE({ _id, index }));
  };

  const styles = StyleSheet.create({
    container: {
      ...GlobalStyles.container,
      backgroundColor: editing
        ? EditColors.background
        : GlobalColors.background,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        label={plot?.name}
        edit
        onEdit={() => setEditing((prev) => !prev)}
        back
        backLabel="Exit"
        light={!editing}
      />
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, width }}
        horizontal
        snapToInterval={width}
        decelerationRate={"fast"}
      >
        {plot.cues.map(({ cuePoint, notes, location, castMembers }, index) => {
          let next;

          if (index !== plot.cues.length - 1) {
            next = plot.cues[index + 1].cuePoint;
          }

          return (
            <Cue
              editing={editing}
              key={index}
              {...{
                index,
                cuePoint,
                location,
                notes,
                castMembers,
                next,
                handleChange,
              }}
              onNext={() => handleScroll(index)}
              handleAddCue={() => handleAddCue(index)}
              handleDelCue={() => handleDelCue(index)}
              handleScroll={() => handleScroll(index)}
              cueCount={plot.cues.length}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlotPageContainer;
