import { Text, View } from "react-native";
import React from "react";
import { GlobalStyles } from "../../Util/GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarLink, PageHeader } from "../../Components";
import { AppRoutes } from "../../Util/Routes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "../../Redux/hooks";

const { container, text_medium } = GlobalStyles;

type Props = {
    navigation: StackNavigationProp<AppRoutes, "Home">;
};

const Dashboard = ({ navigation }: Props) => {
    const { user } = useAppSelector((state) => state);
    return (
        <SafeAreaView style={container}>
            <PageHeader label={`Welcome, ${user.user?.name}`} />
            <View style={{ flex: 1 }}>
                <Text style={text_medium}>Shows:</Text>
                {user.user?.shows.map((show, i) => (
                    <BarLink label={show.name} key={show._id} />
                ))}
            </View>
            <BarLink
                label={"Settings"}
                onPress={() => navigation.navigate("Settings")}
            />
        </SafeAreaView>
    );
};

export default Dashboard;
