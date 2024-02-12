import { Permissions } from "@/common/types/auth/auth.interface";

export function isUserAuthorized(
  permissions: Permissions[],
  authorization: Permissions[],
  authDevice?: boolean
): boolean {

  if (permissions?.includes(Permissions.ADMIN)) return true

  var auth = false;

  if (authorization && permissions) {
    permissions?.map((p) => {
      const include = authorization.includes(p);
      if (include) {
        auth = true;
      }
    });
  }

  if (authDevice === false) {
    return false
  }

  return auth;
}
