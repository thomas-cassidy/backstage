import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Dimensions, StyleSheet, Alert, Text } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { FormLine, PageHeader, RoundButton } from "../../Components";
import { AXIOS_API } from "../../Util/Axios";
import { validatePassword } from "../../Util/FormValidation";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { SEARCH } from "../../Redux/show";
import { User } from "../../Types/AppTypes";
import { ISearchResult, SET_SEARCH_RESULT } from "../../Redux/status";

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

  // const handleSubmit = async () => {
  //   if (!showName) return Alert.alert("You must have a show name");
  //   const passwordValidation = validatePassword(password);
  //   if (passwordValidation.error) return Alert.alert(passwordValidation.error);
  //   if (password !== confirmPassword) return Alert.alert("Your passwords do not match");

  //   try {
  //     const response = await AXIOS_API.post("/shows", {
  //       name: showName,
  //       password,
  //       confirmPassword,
  //     });
  //     console.log("create show response", response.data);
  //   } catch (e) {
  //     console.log(Alert.alert("Network Error", "Check your connection"));
  //   }
  // };i

  const handleSubmit = () => {
    dispatch(SEARCH({ search: showName }));
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader label="Search" />
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
