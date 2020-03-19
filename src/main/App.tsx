import React from "react";
import Navigator, { NavigationProp } from "./Navigator/Navigator";
import Welcome from "./Screens/Welcome";
import Trip from "./Screens/Trip";

const routeConfig: [string, React.FC<NavigationProp>][] = [
  ["Welcome", Welcome],
  ["Trip", Trip]
];
const routeMap: Map<string, React.FC<NavigationProp>> = new Map(routeConfig);
const App: () => React.ReactNode = () => {
  return <Navigator routeMap={routeMap} initialRouteName="Welcome" />;
};

export default App;
