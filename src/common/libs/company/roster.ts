import { IRosterStatus } from "@/common/types/company/roster.interface";

export const ROSTER_CONFIG = {
  holiday: {
    title: "Holiday",
    background: {
      solid: 'bg-blue-500 dark:bg-blue-800',
      color: 'bg-blue-100 dark:bg-blue-100',
    }
  },
  dayoff: {
    title: "Day Off",
    background: {
      solid: 'bg-yellow-500 dark:bg-yellow-800',
      color: 'bg-yellow-100 dark:bg-yellow-100',
    }
  },
  sickday: {
    title: "Sick Day",
    background: {
      solid: 'bg-red-500 dark:bg-red-800',
      color: 'bg-red-100 dark:bg-red-100',
    }
  },
  unconfirmed: {
    title: "Unconfirmed",
    background: {
      solid: 'bg-red-500 dark:bg-red-800',
      color: 'bg-red-100 dark:bg-red-100',
    }
  },
  confirmed: {
    title: "Confirmed",
    background: {
      solid: 'bg-green-500 dark:bg-green-800',
      color: 'bg-green-100 dark:bg-green-100',
    }

  },
};



export function rosterBackground(status: IRosterStatus, solid: boolean) {
  return ROSTER_CONFIG[status].background[solid ? "solid" : "color"];
}