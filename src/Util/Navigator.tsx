import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
    Dashboard,
    Home,
    Cast,
    CastMemberProfile,
    CueSheets,
    NewCueSheet,
    PlotPage,
    Todos,
    Login,
    Register,
    Settings,
} from "../Pages";

import { useAppSelector } from "../Redux/hooks";

const MainStack = createStackNavigator();

const Navigator = () => {
    const auth = useAppSelector((state) => state.auth);

    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {!auth.loggedIn ? (
                <>
                    <MainStack.Screen component={Login} name={"Login"} />
                    <MainStack.Screen component={Register} name={"Register"} />
                </>
            ) : (
                <>
                    <MainStack.Screen
                        component={Dashboard}
                        name={"Dashboard"}
                    />
                    <MainStack.Screen component={Home} name={"Home"} />
                    <MainStack.Screen component={Cast} name={"Cast"} />
                    <MainStack.Screen
                        component={CastMemberProfile}
                        name={"CastProfile"}
                        options={{ presentation: "modal" }}
                    />
                    <MainStack.Screen
                        component={CueSheets}
                        name={"CueSheets"}
                    />
                    <MainStack.Screen
                        component={NewCueSheet}
                        name={"NewCueSheet"}
                        options={{ presentation: "modal" }}
                    />
                    <MainStack.Screen
                        component={PlotPage}
                        name={"PlotPage"}
                        options={{ gestureEnabled: false }}
                    />
                    <MainStack.Screen component={Todos} name={"Todos"} />
                    <MainStack.Screen component={Settings} name={"Settings"} />
                </>
            )}
        </MainStack.Navigator>
    );
};

export default Navigator;
