import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./bottomTabs";
import { Screens } from "../screens/Screens";
import WelcomeScreen from "../screens/login/Welcome";
import InputPhoneScreen from "../screens/login/InputPhoneScreen";
import UsernameSetupScreen from "../screens/login/UsernameSetup";
import ChooseSocialLinks from "../screens/login/ChooseSocialLinks";
import SetupSocialLinks from "../screens/login/SetupSocialLinks";
import SettingsScreen from "../screens/settings/Settings";
import EditLinkScreen from "../screens/settings/EditLinks";
import EditProfileScreen from "../screens/settings/EditProfile";
import { SelectPhoto } from "../screens/settings/SelectPhoto";
import { ContactInfoScreen } from "../screens/home/ContactDetails";
import { ShakeShake } from "../screens/home/Shakeshake";

type NavigationProps = {
  initialRouteName: string;
};

export default function Navigation(props: NavigationProps) {
  return (
    <NavigationContainer>
      <RootNavigator initialRouteName={props.initialRouteName} />
    </NavigationContainer>
  );
}
const Stack = createNativeStackNavigator();

const RootNavigator = (props: NavigationProps) => {
  return (
    <Stack.Navigator
      initialRouteName={props.initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name="Loading" component={DefaultPage} /> */}
      {/* home page */}
      <Stack.Screen
        name={Screens.ROOT}
        options={{ gestureEnabled: false, animation: "fade_from_bottom" }}
        component={BottomTabs}
      />
      <Stack.Screen name={Screens.CONTACT_INFO} component={ContactInfoScreen} />
      <Stack.Screen name={Screens.SHAKESHAKE} component={ShakeShake} />

      {/* sign in ## Need to optimize */}
      <Stack.Screen name={Screens.WELCOME} component={WelcomeScreen} />
      <Stack.Screen name={Screens.INPUT_PHONE} component={InputPhoneScreen} />
      <Stack.Screen
        name={Screens.USERNAME_SETUP}
        component={UsernameSetupScreen}
      />
      <Stack.Screen
        name={Screens.CHOOSE_SOCIAL_LINKS}
        component={ChooseSocialLinks}
      />
      <Stack.Screen
        name={Screens.SETUP_SOCIAL_LINKS}
        component={SetupSocialLinks}
      />
      {/* settings */}
      <Stack.Screen name={Screens.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={Screens.EDIT_LINKS} component={EditLinkScreen} />
      <Stack.Screen name={Screens.EDIT_PROFILE} component={EditProfileScreen} />
      <Stack.Screen name={Screens.SELECT_PHOTO} component={SelectPhoto} />
      {/*  */}

      {/* Instruction_HomeScreen  ## Need to optimize*/}
      {/* <Stack.Screen
        name={Screens.INSTRUCTION_HOME1}
        component={Instruction_HomeScreen1}
      />
      <Stack.Screen
        name={Screens.INSTRUCTION_HOME2}
        component={Instruction_HomeScreen2}
      />
      <Stack.Screen
        name={Screens.INSTRUCTION_MATCH1}
        component={Instruction_MatchScreen1}
      />
      <Stack.Screen
        name={Screens.INSTRUCTION_MATCH2}
        component={Instruction_MatchScreen2}
      />
      <Stack.Screen
        name={Screens.INSTRUCTION_MATCH3}
        component={Instruction_MatchScreen3}
      />
      <Stack.Screen
        name={Screens.INSTRUCTION_MATCH4}
        component={Instruction_MatchScreen4}
      /> */}
      {/* concat */}
      {/* <Stack.Screen
        name={Screens.CONTACT_LIST}
        component={ContactsListScreen}
      />
      
      <Stack.Screen name={Screens.SETTINGS} component={SettingsScreen} />
      
      
      <Stack.Screen
        name={Screens.EDITING_PHOTO}
        component={EditingPhotoScreen}
      />
      <Stack.Screen name={Screens.CONTACT_INFO} component={ContactInfoScreen} /> */}
      {/* home */}
      {/* <Stack.Screen name={Screens.HOME} component={HomeScreen} />
      <Stack.Screen name={Screens.MATCHED_USERS} component={UserListScreen} /> */}
    </Stack.Navigator>
  );
};
