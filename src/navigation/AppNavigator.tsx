import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateBoxScreen from '../screens/CreateBoxScreen';
import BoxDetailScreen from '../screens/BoxDetailScreen';
import OpenBoxScreen from '../screens/OpenBoxScreen';
import EditBoxScreen from '../screens/EditBoxScreen';

export type RootStackParamList = {
  Home: undefined;
  CreateBox: undefined;
  BoxDetail: { boxId: string };
  OpenBox: { boxId: string };
  EditBox: { boxId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BoxDetail" component={BoxDetailScreen} />
        <Stack.Screen name="EditBox" component={EditBoxScreen} />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="CreateBox" component={CreateBoxScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
          <Stack.Screen name="OpenBox" component={OpenBoxScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
