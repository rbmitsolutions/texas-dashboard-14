import { IPermissions } from "@/routes";

export function isUserAuthorized(
  permissions: IPermissions[],
  authorization: IPermissions[]
): boolean {
  var auth = false;

  if (authorization && permissions) {
    permissions?.map((p) => {
      const include = authorization.includes(p);
      if (include) {
        auth = true;
      }
    });
  }
  return auth;
}
