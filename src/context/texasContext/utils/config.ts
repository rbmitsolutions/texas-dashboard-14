import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";
import { useAuthHooks } from "@/hooks/useAuthHooks";
import { usePathname } from "next/navigation";

interface IEnableFetch {
  fetch: "tables" | "menu" | "sections" | "orderController" | "transactions";
}

export const useEnableFetch = ({ fetch }: IEnableFetch): boolean => {
  const  pathname = usePathname();
  const { user } = useAuthHooks();

  //todo check the permissions
  switch (fetch) {
    case "tables":
      return (
        isUserAuthorized(user?.permissions, [
          "admin",
          "admin-ghost",
          "booking_reader",
          "waiters",
          "tables",
          "reception",
          "my_profile",
          "pass",
        ]) &&
        (pathname?.includes("/admin/texas/bookings") ||
          pathname?.includes("/admin/texas/reception") ||
          pathname?.includes("/admin/texas/waiters") ||
          pathname?.includes("/admin/texas/pass") ||
          pathname?.includes("/admin/texas/orders"))
      );
    case "menu":
      return (
        isUserAuthorized(user?.permissions, [
          "admin",
          "admin-ghost",
          "booking_reader",
          "waiters",
          "tables",
          "reception",
          "my_profile",
          "pass",
        ]) && pathname?.includes("/admin/texas/waiters")
      );
    case "sections":
      return (
        isUserAuthorized(user?.permissions, [
          "admin",
          "admin-ghost",
          "booking_reader",
          "waiters",
          "tables",
          "reception",
          "my_profile",
          "pass",
        ]) &&
        (pathname?.includes("/admin/texas/bookings") ||
          pathname?.includes("/admin/texas/reception") ||
          pathname?.includes("/admin/texas/waiters") ||
          pathname?.includes("/admin/texas/pass") ||
          pathname?.includes("/admin/texas/orders"))
      );
    case "orderController":
      return (
        isUserAuthorized(user?.permissions, [
          "admin",
          "admin-ghost",
          "waiters",
          "tables",
          "reception",
          "pass",
        ]) &&
        (pathname?.includes("/admin/texas/reception") ||
          pathname?.includes("/admin/texas/waiters") ||
          pathname?.includes("/admin/texas/pass") ||
          pathname?.includes("/admin/texas/orders"))
      );
    case "transactions":
      return (
        isUserAuthorized(user?.permissions, [
          "admin",
          "admin-ghost",
          "reception",
        ]) && pathname?.includes("/admin/texas/reception")
      );
    default:
      return false;
  }
};
