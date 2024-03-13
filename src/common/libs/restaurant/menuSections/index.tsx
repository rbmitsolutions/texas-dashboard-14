import { IMenuSection } from "@/common/types/restaurant/menu.interface";

export default function sortMenuSections(sections: IMenuSection[]) {
  const orderO = ['Starters', 'Main Course', 'Sides', 'Bar', 'Desserts'];
  return sections?.sort((a, b) => {
    let indexA = orderO.indexOf(a?.title);
    let indexB = orderO.indexOf(b?.title);

    return indexA - indexB;
  });
}