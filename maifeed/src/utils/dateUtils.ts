export const getWeekEnd = () => {
  const today = new Date();
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return weekEnd;
};

export const getDateHeader = (date: Date) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('ru-RU', { month: 'long' });
  const monthGenitive = month.replace(/ь$/, 'я').replace(/т$/, 'та').replace(/й$/, 'я');
  
  if (eventDate.getTime() === now.getTime()) {
    return `Сегодня (${day} ${monthGenitive})`;
  } else if (eventDate.getTime() === tomorrow.getTime()) {
    return `Завтра (${day} ${monthGenitive})`;
  } else {
    return `${day} ${monthGenitive}`;
  }
};

export const isDefaultWeek = (startDate: Date, endDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return start.getTime() === today.getTime() && end.getTime() === weekEnd.getTime();
};

export const getDateRangeText = (startDate: Date, endDate: Date) => {
  if (isDefaultWeek(startDate, endDate)) return '📅 На этой неделе';
  const startStr = startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const endStr = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  return `📅 ${startStr} - ${endStr}`;
};
