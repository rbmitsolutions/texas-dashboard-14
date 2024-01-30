import { Permissions } from "@/common/types/auth/auth.interface";

export function isUserAuthorized(
  permissions: Permissions[],
  authorization: Permissions[]
): boolean {
  var auth = false;

  if (authorization && permissions) {
    permissions?.map((p) => {
      const include = authorization.includes(p);
      if (permissions.includes(Permissions.ADMIN)) return (auth = true);
      if (include) {
        auth = true;
      }
    });
  }
  return auth;
}
