
import { NextRequest, NextResponse } from "next/server";
import { IToken } from "./common/types/auth/auth.interface";
import routers, { IRoute } from "./routes";
import { isUserAuthorized } from "./common/libs/user/isUserAuthorized";
import { findRouteByPathname } from "./common/libs/routers";


export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const cookie = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY! as string)
  const token: IToken | null = cookie ? JSON.parse(cookie?.value) : null;

  //redirect to /signin if page is not found


  if (pathName === '/' || pathName === '/admin') {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  //todo: check if user is logged in and redirect to admin if not
  if (pathName.includes("/signin")) {
    if (token) {
      return NextResponse.redirect(new URL("/admin/roster", request.url));
    }
  }

  if (pathName.includes("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  if (pathName.includes('/admin')) {
    if (token) {
      const findRouter = findRouteByPathname(pathName, routers);

      if (findRouter) {
        const permission = isUserAuthorized(
          token?.permissions,
          findRouter?.authorization
        );
        if (!permission) {
          return NextResponse.redirect(new URL("/admin/roster", request.url));
        }

        return NextResponse.next();
      }
      //todo change it to menu-create
      if(pathName.includes('/admin/restaurant/menu/create')){
        const permission = isUserAuthorized(
          token?.permissions,
          ['admin']
        );
        if (!permission) {
          return NextResponse.redirect(new URL("/admin/roster", request.url));
        }
      } 

      if(pathName.includes('/admin/settings')){
        const permission = isUserAuthorized(
          token?.permissions,
          ['admin']
        );
        if (!permission) {
          return NextResponse.redirect(new URL("/admin/roster", request.url));
        }
      }
    }
  }


  return NextResponse.next();
}