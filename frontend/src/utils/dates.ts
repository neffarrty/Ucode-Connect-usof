import {
	differenceInDays,
	differenceInMonths,
	differenceInYears,
	format,
	isToday,
	isYesterday,
} from 'date-fns';

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;

export const formatDate = (date: Date) => {
	const now = new Date();
	const diff = now.getTime() - date.getTime();

	if (diff < ONE_HOUR) {
		const minutes = Math.floor(diff / ONE_MINUTE);
		return `${minutes} minutes ago`;
	}

	if (isToday(date)) {
		return `today at ${format(date, 'HH:mm')}`;
	}

	if (isYesterday(date)) {
		return `yesterday at ${format(date, 'HH:mm')}`;
	}

	return format(date, "d MMM yyyy 'at' HH:mm");
};

export const getMembershipDuration = (date: Date): string => {
	const now = new Date();

	const years = differenceInYears(now, date);
	const months = differenceInMonths(now, date) % 12;
	const days = differenceInDays(now, date) - (years * 365 + months * 30);

	const parts = [];
	if (years > 0) {
		parts.push(`${years} year${years > 1 ? 's' : ''}`);
	}
	if (months > 0) {
		parts.push(`${months} month${months > 1 ? 's' : ''}`);
	}
	if (days > 0) {
		parts.push(`${days} day${days > 1 ? 's' : ''}`);
	}

	return parts.length ? `Member for ${parts.join(' ')}` : 'Recently joined';
};
