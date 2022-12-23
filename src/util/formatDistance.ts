import { formatDistance as formatDistanceFn } from "date-fns";
import tr from "date-fns/locale/tr/index";

export const formatDistance = (date: string) => {
  return formatDistanceFn(new Date(date), new Date(), {
    locale: tr,
    addSuffix: false,
  });
};
