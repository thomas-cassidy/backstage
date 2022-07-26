import { Text, View } from "react-native";
import React from "react";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarLink, Footer, PageHeader } from "../../Components";
import { AppRoutes } from "../../Util/Routes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "../../Redux/hooks";
import { ScrollView } from "react-native-gesture-handler";

const { container, text_medium } = GlobalStyles;

type Props = {
    navigation: StackNavigationProp<AppRoutes, "Home">;
};

const Dashboard = ({ navigation }: Props) => {
    const { user } = useAppSelector((state) => state.user);

    if (!user) {
        return navigation.goBack();
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

                <ScrollView scrollEnabled={user.shows.length > 4}>
                    {user.shows.map((show, i) => (
                        <BarLink
                            label={show.name}
                            key={show._id}
                            onPress={() => navigation.navigate("Home")}
                        />
                    ))}
                </ScrollView>
            </View>

            <Footer />
        </SafeAreaView>
    );
};

export default Dashboard;
