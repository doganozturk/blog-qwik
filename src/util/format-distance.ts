import { formatDistance as formatDistanceFn } from "date-fns";
import tr from "date-fns/locale/tr/index";

export enum Locale {
  tr = "tr",
  en = "en",
}

export const formatDistance = (date: string, locale: Locale = Locale.en) => {
  return formatDistanceFn(new Date(date), new Date(), {
    locale : locale === Locale.tr ? tr : undefined,
    addSuffix: false,
  });
};
