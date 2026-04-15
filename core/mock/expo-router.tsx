import React from "react";

type RouteArg =
  | string
  | {
      pathname?: string;
      params?: Record<string, string | number | boolean | undefined>;
    };

type WithChildren = {
  children?: React.ReactNode;
};

export const useRouter = () => ({
  push: (_arg: RouteArg) => {},
  back: () => {},
  replace: (_arg: RouteArg) => {},
});

export const useLocalSearchParams = () => ({});

export const Stack = ({ children }: WithChildren) => <>{children}</>;
Stack.Screen = () => null;

export const Tabs = ({ children }: WithChildren) => <>{children}</>;
Tabs.Screen = () => null;

export const Link = ({ children }: WithChildren) => <>{children}</>;
