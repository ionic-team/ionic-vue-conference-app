import { format as dateFnsFormat, parseISO } from 'date-fns';

export function dateFormat(dateString: string, formatString: string): string {
  if (!dateString) {
    return '';
  }

  try {
    const date = parseISO(dateString);
    return dateFnsFormat(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}
