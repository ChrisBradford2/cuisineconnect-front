export default function formatDate(input: Date | string): string {
  let date: Date;

  if (typeof input === 'string') {
    date = new Date(input);
  } else if (input instanceof Date) {
    date = input;
  } else {
    throw new TypeError('Invalid date provided');
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };

  const formattedDate = date
    .toLocaleDateString('fr-FR', dateOptions)
    .split(' ')
    .map((word, index) =>
      index === 0 || index === 2 ? capitalizeFirstLetter(word) : word,
    )
    .join(' ');

  const formattedTime = date.toLocaleTimeString('fr-FR', timeOptions);

  return `${formattedDate} à ${formattedTime}`;
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
