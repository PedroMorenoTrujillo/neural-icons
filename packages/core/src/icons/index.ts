import { iconArrowLeft } from './arrow-left.js';
import { iconArrowRight } from './arrow-right.js';
import { iconArrowUp } from './arrow-up.js';
import { iconArrowDown } from './arrow-down.js';
import { iconChevronLeft } from './chevron-left.js';
import { iconChevronRight } from './chevron-right.js';
import { iconChevronUp } from './chevron-up.js';
import { iconChevronDown } from './chevron-down.js';
import { iconCheck } from './check.js';
import { iconX } from './x.js';
import { iconPlus } from './plus.js';
import { iconMinus } from './minus.js';
import { iconSearch } from './search.js';
import { iconMenu } from './menu.js';
import { iconMoreHorizontal } from './more-horizontal.js';
import { iconMoreVertical } from './more-vertical.js';
import { iconHome } from './home.js';
import { iconSettings } from './settings.js';
import { iconUser } from './user.js';
import { iconUsers } from './users.js';
import { iconHeart } from './heart.js';
import { iconStar } from './star.js';
import { iconBell } from './bell.js';
import { iconInfo } from './info.js';
import { iconWarning } from './warning.js';
import { iconHelp } from './help.js';
import { iconSuccess } from './success.js';
import { iconError } from './error.js';
import { iconEye } from './eye.js';
import { iconEyeOff } from './eye-off.js';
import { iconEdit } from './edit.js';
import { iconTrash } from './trash.js';
import { iconCopy } from './copy.js';
import { iconDownload } from './download.js';
import { iconUpload } from './upload.js';
import { iconCalendar } from './calendar.js';
import { iconClock } from './clock.js';
import { iconFilter } from './filter.js';
import { iconSortAscending } from './sort-ascending.js';
import { iconLock } from './lock.js';
import { iconUnlock } from './unlock.js';
import { iconMail } from './mail.js';
import { iconExternalLink } from './external-link.js';
import { iconFolder } from './folder.js';
import { iconFile } from './file.js';
import { iconRefresh } from './refresh.js';
import { iconLoader } from './loader.js';
import { iconLogout } from './logout.js';
import type { NeuralIconDefinition } from '../lib/icon-definition.js';

export { iconArrowLeft } from './arrow-left.js';
export { iconArrowRight } from './arrow-right.js';
export { iconArrowUp } from './arrow-up.js';
export { iconArrowDown } from './arrow-down.js';
export { iconChevronLeft } from './chevron-left.js';
export { iconChevronRight } from './chevron-right.js';
export { iconChevronUp } from './chevron-up.js';
export { iconChevronDown } from './chevron-down.js';
export { iconCheck } from './check.js';
export { iconX } from './x.js';
export { iconPlus } from './plus.js';
export { iconMinus } from './minus.js';
export { iconSearch } from './search.js';
export { iconMenu } from './menu.js';
export { iconMoreHorizontal } from './more-horizontal.js';
export { iconMoreVertical } from './more-vertical.js';
export { iconHome } from './home.js';
export { iconSettings } from './settings.js';
export { iconUser } from './user.js';
export { iconUsers } from './users.js';
export { iconHeart } from './heart.js';
export { iconStar } from './star.js';
export { iconBell } from './bell.js';
export { iconInfo } from './info.js';
export { iconWarning } from './warning.js';
export { iconHelp } from './help.js';
export { iconSuccess } from './success.js';
export { iconError } from './error.js';
export { iconEye } from './eye.js';
export { iconEyeOff } from './eye-off.js';
export { iconEdit } from './edit.js';
export { iconTrash } from './trash.js';
export { iconCopy } from './copy.js';
export { iconDownload } from './download.js';
export { iconUpload } from './upload.js';
export { iconCalendar } from './calendar.js';
export { iconClock } from './clock.js';
export { iconFilter } from './filter.js';
export { iconSortAscending } from './sort-ascending.js';
export { iconLock } from './lock.js';
export { iconUnlock } from './unlock.js';
export { iconMail } from './mail.js';
export { iconExternalLink } from './external-link.js';
export { iconFolder } from './folder.js';
export { iconFile } from './file.js';
export { iconRefresh } from './refresh.js';
export { iconLoader } from './loader.js';
export { iconLogout } from './logout.js';

export const neuralIcons = Object.freeze([
  iconArrowLeft,
  iconArrowRight,
  iconArrowUp,
  iconArrowDown,
  iconChevronLeft,
  iconChevronRight,
  iconChevronUp,
  iconChevronDown,
  iconCheck,
  iconX,
  iconPlus,
  iconMinus,
  iconSearch,
  iconMenu,
  iconMoreHorizontal,
  iconMoreVertical,
  iconHome,
  iconSettings,
  iconUser,
  iconUsers,
  iconHeart,
  iconStar,
  iconBell,
  iconInfo,
  iconWarning,
  iconHelp,
  iconSuccess,
  iconError,
  iconEye,
  iconEyeOff,
  iconEdit,
  iconTrash,
  iconCopy,
  iconDownload,
  iconUpload,
  iconCalendar,
  iconClock,
  iconFilter,
  iconSortAscending,
  iconLock,
  iconUnlock,
  iconMail,
  iconExternalLink,
  iconFolder,
  iconFile,
  iconRefresh,
  iconLoader,
  iconLogout,
]) satisfies readonly NeuralIconDefinition[];

export type NeuralIconName = (typeof neuralIcons)[number]['name'];
