import { format, isToday, isYesterday } from 'date-fns';

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
