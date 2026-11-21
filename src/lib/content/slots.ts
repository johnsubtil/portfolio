import { showPlaceholderSlots } from '../../config/content';

export function placeholderSlots(limit: number, shown: number) {
  return showPlaceholderSlots && shown > 0 ? limit - shown : 0;
}
