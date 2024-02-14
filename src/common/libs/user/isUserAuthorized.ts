import { IToken, Permissions } from "@/common/types/auth/auth.interface";

export function isUserAuthorized(
  token: IToken,
  authorization: Permissions[],
): boolean {

  if (token?.permissions?.includes(Permissions.ADMIN)) return true

  var auth = false;

  if (authorization && token?.permissions) {
    token?.permissions?.map((p) => {
      const include = authorization.includes(p);
      if (include) {
        auth = true;
      }
    });
  }

  return auth
}
