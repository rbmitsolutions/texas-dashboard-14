
import { NextRequest, NextResponse } from "next/server";
import { IToken } from "./common/types/auth/auth.interface";

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const cookie = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY! as string)
  const token: IToken | null = cookie ? JSON.parse(cookie?.value) : null;

  //redirect to /signin if page is not found


  if(pathName === '/' || pathName === '/admin') {
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
  // const token = request.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY! as string];


  // if (pathName.includes("admin")) {
  //   if (token) {
  //     if (pathName === "/admin") {
  //       return NextResponse.redirect(new URL("/admin/roster", request.url));
  //     }

  //     const findRouter = routers.find((r) => {
  //       if (r.collapse) {
  //         return r.items.find((cr) => {
  //           if(cr.collapse) {
  //             return cr.items.find((ccr) => ccr.layout + ccr.path === pathName)
  //           }
  //           return cr.layout + cr.path === pathName
  //         });
  //       }
  //       return r.layout + r.path === pathName;
  //     });

  //     if (findRouter) {
  //       const permission = isUserAuthorized(
  //         JSON.parse(token)?.permissions,
  //         findRouter.authorization
  //       );

  //       if (!permission) {
  //         return NextResponse.redirect(new URL("/admin/roster", request.url));
  //       }
  //       return NextResponse.next();
  //     }
  //   }

  return NextResponse.next();
}