import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Dimensions, StyleSheet, Text } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { SEARCH } from "../../Redux/show";
import { User } from "../../Types/AppTypes";
import { ISearchResult, SET_SEARCH_RESULT } from "../../Redux/status";
import { ACCESS_SHOW } from "../../Redux/auth";
import DismissKeyboard from "../../Components/DismissKeyboard";

const { width } = Dimensions.get("window");

interface OuterProps {
  route: RouteProp<AppRoutes, "Search">;
  navigation: StackNavigationProp<AppRoutes, "Search">;
}

const SearchContainer = ({ navigation }: OuterProps) => {
  const { user } = useAppSelector((state) => state.user);
  const { searchResult } = useAppSelector((state) => state.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(SET_SEARCH_RESULT(null));
  }, []);

  if (!user) return;

  return <Search {...{ navigation, user, searchResult }} />;
};

interface InnerProps {
  navigation: StackNavigationProp<AppRoutes, "Search">;
  user: User;
  searchResult: ISearchResult;
}

const Search = ({ navigation, user, searchResult }: InnerProps) => {
  const dispatch = useAppDispatch();
  const { inner, form, showNotFound } = makeStyles();
  const [showName, setShowName] = useState("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = () => {
    dispatch(SEARCH({ search: showName }));
  };

  const handleAccess = (_id: string | number, name: string) => {
    dispatch(ACCESS_SHOW({ _id, password, name })).then((e) => {
      if (e.meta.requestStatus === "fulfilled") navigation.goBack();
    });
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader label="Search" />
      <DismissKeyboard>
        <View style={inner}>
          <View style={form}>
            <FormLine
              label="Show Name"
              editing={true}
              color={GlobalColors.text_primary}
              onChangeText={(e) => setShowName(e)}
              value={showName}
              textContentType={"name"}
              onSubmitEditing={handleSubmit}
            />
            {searchResult !== null ? (
              searchResult === "Show not found" ? (
                <Text style={showNotFound}>Show not found</Text>
              ) : user.shows.findIndex((s) => s._id === searchResult._id) === -1 ? (
                <>
                  <FormLine editing={false} value={searchResult.owner} label="Owner" />
                  <FormLine
                    editing={true}
                    textContentType="password"
                    onChangeText={(t) => setPassword(t)}
                    value={password}
                    label="Show Password"
                  />
                  <RoundButton
                    label="Access Show"
                    style={{ marginTop: Sizes.l }}
                    onPress={() => handleAccess(searchResult._id, searchResult.name)}
                  />
                </>
              ) : (
                <>
                  <FormLine editing={false} value={searchResult.owner} label="Owner" />
                  <Text style={GlobalStyles.text_medium}>You already have access to this show</Text>
                </>
              )
            ) : null}
          </View>

          <RoundButton label="Search" onPress={handleSubmit} />
        </View>
      </DismissKeyboard>
    </SafeAreaView>
  );
};

export default SearchContainer;

const makeStyles = () =>
  StyleSheet.create({
    inner: {
      flex: 1,
      padding: Sizes.m,
      width,
    },
    form: {
      flex: 1,
    },
    showNotFound: {
      ...GlobalStyles.text_medium,
      marginVertical: Sizes.m,
    },
  });
