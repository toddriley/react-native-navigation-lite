import React from "react";
import Navigator, { NavigationProp } from "./Navigator/Navigator";
import Trip from "./Screens/Trip";
import Welcome from "./Screens/Welcome";

const routeConfig: [string, React.FC<NavigationProp>][] = [
  ["Welcome", Welcome],
  ["Trip", Trip]
];

const routeMap: Map<string, React.FC<NavigationProp>> = new Map(routeConfig);

const App: () => React.ReactNode = () => {
  return <Navigator routeMap={routeMap} initialRouteName="Welcome" />;
};

export default App;
