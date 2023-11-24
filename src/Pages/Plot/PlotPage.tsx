import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { PageHeader } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { ADD_CUE, DELETE_CUE, EDIT_CUE, UPDATE_CUE_ASYNC } from "../../Redux/plots";
import { CueType, Plot } from "../../Types/AppTypes";
import { EditColors, GlobalColors, GlobalStyles } from "../../Util/GlobalStyles";
import { AppRoutes } from "../../Util/Routes";
import Cue from "./Cue";
import { GET_SHOW_BACKGROUND } from "../../Redux/show";

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
  const showId = useAppSelector((state) => state.show._id);
  const [editing, setEditing] = useState(false);
  const [hasEdits, setHasEdits] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!editing && hasEdits) handleSaveChanges();
  }, [editing]);

  const handleSaveChanges = async () => {
    await dispatch(UPDATE_CUE_ASYNC(_id));
    setHasEdits(false);
  };

  const handleScroll = (index: number) => {
    scrollRef.current?.scrollTo({ x: (index + 1) * width });
  };

  const handleChange = (index: number, field: keyof CueType, value: string | number) => {
    dispatch(EDIT_CUE({ _id, index, field, value }));
    setHasEdits(true);
    return {
      _id: 1,
      castMembers: [],
      cuePoint: "",
      location: "",
      notes: "",
    };
  };
  const handleAddCue = async (index: number) => {
    await dispatch(ADD_CUE({ _id, index }));
    setHasEdits(true);
    handleScroll(index);
  };
  const handleDelCue = (index: number) => {
    setHasEdits(true);
    dispatch(DELETE_CUE({ _id, index }));
  };

  const styles = StyleSheet.create({
    container: {
      ...GlobalStyles.container,
      backgroundColor: editing ? EditColors.background : GlobalColors.background,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        label={plot?.name}
        edit
        onEdit={() => {
          if (plot.cues.length === 0) dispatch(ADD_CUE({ _id, index: 0 }));
          setEditing((prev) => !prev);
          console.log(plot);
        }}
        back
        onBack={() => {
          if (hasEdits) {
            return Alert.alert(
              "Do you want to discard these edits?",
              "",
              [
                { text: "Cancel", style: "cancel", onPress: () => null },
                {
                  text: "Yes",
                  style: "destructive",
                  onPress: () => {
                    dispatch(GET_SHOW_BACKGROUND({ showId }));
                    navigation.goBack();
                  },
                },
              ],
              { cancelable: true }
            );
          }
          navigation.goBack();
        }}
        backLabel="Exit"
        light={!editing}
      />
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, width }}
        horizontal
        snapToInterval={width}
        decelerationRate={0.99}
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
                castInCue: castMembers,
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
