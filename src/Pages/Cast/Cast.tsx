import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OverlayInstruction, PageHeader, RoundButton } from "../../Components";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import CastMemberSmall from "./CastMemberSmall";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { CastMember } from "../../Types/AppTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { IStatusState, SET_HAS_SEEN_HINT } from "../../Redux/status";
import { getCast, getStatus } from "../../Redux/Helpers";

const { width } = Dimensions.get("window");

interface ContainerProps {
  navigation: StackNavigationProp<AppRoutes, "Cast">;
}

interface RenderList {
  [group: string]: CastMember[];
}

const Container = ({ navigation }: ContainerProps) => {
  const cast = useAppSelector(getCast);
  const status = useAppSelector(getStatus);

  if (!cast || !status) return <Text>Oopsie</Text>;
  return <Cast {...{ navigation, cast, status }} />;
};

interface InnerProps extends ContainerProps {
  cast: CastMember[];
  status: IStatusState;
}

const Cast = ({ navigation, cast, status }: InnerProps) => {
  const dispatch = useAppDispatch();

  const [castRenderList, setCastRenderList] = useState<RenderList>(() => {
    let state: RenderList = { uncategorised: [] };
    cast.map((c) => {
      if (c.category === undefined) {
        return state.uncategorised.push(c);
      } else if (state[c.category]) {
        state[c.category].push(c);
      } else state[c.category] = [c];
    });
    return state;
  });

  useEffect(() => {
    setCastRenderList(() => {
      let state: RenderList = { uncategorised: [] };
      cast.map((c) => {
        if (c.category === undefined) {
          return state.uncategorised.push(c);
        } else if (state[c.category]) {
          state[c.category].push(c);
        } else state[c.category] = [c];
      });

      return state;
    });
  }, [cast]);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader label={"Cast"} back />

      <ScrollView
        style={styles.horiz_scroll}
        horizontal
        decelerationRate={"fast"}
        snapToInterval={width}
      >
        {Object.keys(castRenderList)
          .sort()
          .map((category, index) => {
            if (castRenderList[category].length === 0) return;
            return (
              <View style={styles.page} key={index}>
                <Text style={styles.groupHeader}>{category != "uncategorised" && category}</Text>
                <ScrollView style={{ flex: 1 }}>
                  {castRenderList[category]
                    .sort((a, b) => a.role.charCodeAt(0) - b.role.charCodeAt(0))
                    .map((castMember, i) => (
                      <CastMemberSmall key={i} {...{ castMember }} />
                    ))}
                </ScrollView>
              </View>
            );
          })}
      </ScrollView>
      <RoundButton
        label={"Add Cast Member"}
        onPress={() => navigation.navigate("CastProfile", { _id: "-1" })}
      />

      {!status.hasSeenCastHint && (
        <OverlayInstruction
          message="Swipe to see other groups ->"
          callback={() => dispatch(SET_HAS_SEEN_HINT())}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  horiz_scroll: {
    flex: 1,
    width,
    backgroundColor: GlobalColors.background,
  },
  page: {
    flex: 1,
  },
  groupHeader: {
    ...GlobalStyles.text_large,
    alignSelf: "flex-start",
    marginLeft: Sizes.m,
  },
});

export default Container;
