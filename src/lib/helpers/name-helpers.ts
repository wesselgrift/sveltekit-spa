/**
 * Splits a display name into first and last name parts.
 * For names with multiple words, the first word becomes the first name
 * and all remaining words become the last name.
 */
export function splitDisplayName(displayName: string): {
	firstName: string;
	lastName: string;
} {
	if (!displayName || displayName.trim() === '') {
		return { firstName: '', lastName: '' };
	}

	const nameParts = displayName.trim().split(/\s+/);

	if (nameParts.length === 1) {
		return { firstName: nameParts[0], lastName: '' };
	}

	const firstName = nameParts[0];
	const lastName = nameParts.slice(1).join(' ');

	return { firstName, lastName };
}
