import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Routes from '@/config/Routes'

const Drawer = createDrawerNavigator()

interface IFilterProps {
  drawerMenuScreens: any,
}

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Routes.Home} />
      <Drawer.Screen name="Configuración" component={Routes.Profile} />
    </Drawer.Navigator>
  );
}

const DrawerMenu = () => {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

export default DrawerMenu;