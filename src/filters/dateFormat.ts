import { format as dateFnsFormat } from 'date-fns';

export function dateFormat(dateString: string, formatString: string): string {
  if (!dateString) {
    return '';
  }

  const parsedTime = new Date(dateString);

  if (isNaN(parsedTime.getTime())) {
    return '';
  }

  return dateFnsFormat(parsedTime, formatString);
}
