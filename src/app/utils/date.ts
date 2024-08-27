const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function getWeekDays() {
  return daysOfWeek;
}

export function getCurrentWeek(): Date[] {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(currentDate);

  // Set the date to the last Sunday
  startOfWeek.setDate(currentDate.getDate() - currentDay);

  const week = [];
  for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
  }

  return week;
}

export function getDay(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

export function getMonth(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = { month: 'long' }
  return new Date(date).toLocaleDateString('en-US', options)
}

export function monthDayFormat(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

export function isSameDay(dateA: Date, dateB: Date): boolean {
  return dateA.getDate() === dateB.getDate() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getFullYear() === dateB.getFullYear();
}

export function isToday(date: Date): boolean {
  return isSameDay(new Date(), date);
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
