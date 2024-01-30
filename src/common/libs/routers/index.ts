import { IRoute } from "@/routes";

export const findRouteByPathname = (pathname: string, routes: IRoute[]): IRoute | null => {
    for (const route of routes) {
      if (route.layout + route.path === pathname) {
        return route;
      } else if (route.items && route.items.length > 0) {
        const nestedRoute = findRouteByPathname(pathname, route.items);
        if (nestedRoute) {
          return nestedRoute;
        }
      }
    }
    return null;
  };
  