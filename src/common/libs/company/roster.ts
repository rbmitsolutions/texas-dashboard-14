import { IRosterStatus } from "@/common/types/company/roster.interface";

export const ROSTER_CONFIG = {
  holiday: {
    title: "Holiday",
    background: {
      solid: 'bg-blue-500/30 dark:bg-blue-900/50',
      color: 'bg-blue-100 dark:bg-blue-100',
    }
  },
  dayoff: {
    title: "Day Off",
    background: {
      solid: 'bg-yellow-300/50 dark:bg-orange-900/70',
      color: 'bg-orange-100 dark:bg-orange-100',
    }
  },
  sickday: {
    title: "Sick Day",
    background: {
      solid: 'bg-purple-500/30 dark:bg-purple-900/50',
      color: 'bg-purple-100 dark:bg-purple-100',
    }
  },
  unconfirmed: {
    title: "Unconfirmed",
    background: {
      solid: 'bg-red-500/30 dark:bg-red-900/50',
      color: 'bg-red-100 dark:bg-red-100',
    }
  },
  confirmed: {
    title: "Confirmed",
    background: {
      solid: 'bg-green-500/30 dark:bg-green-900/50',
      color: 'bg-green-100 dark:bg-green-100',
    }

  },
};



export function rosterBackground(status: IRosterStatus, solid: boolean) {
  return ROSTER_CONFIG[status].background[solid ? "solid" : "color"];
}