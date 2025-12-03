export const getWeekEnd = () => {
  const today = new Date();
  // Получаем день недели (0 = воскресенье, 1 = понедельник, ..., 6 = суббота)
  const dayOfWeek = today.getDay();
  // Вычисляем количество дней до воскресенья (0 если сегодня воскресенье)
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + daysUntilSunday);
  weekEnd.setHours(23, 59, 59, 999);
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
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);
  sunday.setHours(23, 59, 59, 999);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  
  return start.getTime() === monday.getTime() && 
         end.toDateString() === sunday.toDateString();
};

export const getDateRangeText = (startDate: Date, endDate: Date) => {
  if (isDefaultWeek(startDate, endDate)) return '📅 На этой неделе';
  const startStr = startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const endStr = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  return `📅 ${startStr} - ${endStr}`;
};
