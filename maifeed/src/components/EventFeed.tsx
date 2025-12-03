import { useState, useEffect } from 'react';
import { getWeekEnd, getDateHeader, getDateRangeText } from '../utils/dateUtils';
import { getEventsByGroup, deleteEvent } from '../services/eventService';
import { keyframesCSS } from '../styles';
import { CreateEventModal } from './CreateEventModal';
import { isModerator } from '../utils/auth';

interface EventFeedProps {
  selectedGroupName: string;
  selectedGroupId: string;
  onBackToSelector: () => void;
  onOpenModeration: () => void;
  user: any;
  styles: any;
}

export function EventFeed({ selectedGroupName, selectedGroupId, onBackToSelector, onOpenModeration, user, styles }: EventFeedProps) {
  const { colors } = styles;
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Обнуляем время для правильного диапазона дат
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
  
  const [startDate, setStartDate] = useState<Date>(getToday());
  const [endDate, setEndDate] = useState<Date>(getWeekEnd());
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const fetchedEvents = await getEventsByGroup(selectedGroupId, startDate, endDate);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Удалить событие "${eventTitle}"?`)) return;
    
    try {
      await deleteEvent(eventId);
      alert('Событие удалено');
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Ошибка при удалении события');
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedGroupId, startDate, endDate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
    if (scrollTop === 0) setPullStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY === 0 || isRefreshing) return;
    const scrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
    if (scrollTop > 0) {
      setPullStartY(0);
      setPullDistance(0);
      return;
    }
    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStartY;
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance / 2.5, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      loadEvents().finally(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        setPullStartY(0);
      });
    } else {
      setPullDistance(0);
      setPullStartY(0);
    }
  };

  return (
    <div style={styles.feedContainer}>
      <style>{keyframesCSS}</style>
      <div style={styles.header}>
        <button style={styles.headerButton} onClick={onBackToSelector}>
          {selectedGroupName}
        </button>
        <button style={styles.headerButton} onClick={() => setShowCalendar(!showCalendar)}>
          {getDateRangeText(startDate, endDate)}
        </button>
        {isModerator(user?.username) && (
          <button 
            style={{ ...styles.headerButton, fontSize: '18px', padding: '8px 12px' }} 
            onClick={onOpenModeration}
            title="Модерация"
          >
            👤
          </button>
        )}
      </div>

      {showCalendar && (
        <div style={{
          position: 'sticky',
          top: '65px',
          backgroundColor: colors.bgColor,
          padding: '8px 12px',
          borderBottom: `1px solid ${colors.hintColor}40`,
          zIndex: 9,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: colors.hintColor }}>От</label>
            <input type="date" value={startDate.toISOString().split('T')[0]}
              min="1930-03-20" max={`${new Date().getFullYear() + 4}-08-31`}
              onChange={(e) => {
                if (!e.target.value) return;
                const [year, month, day] = e.target.value.split('-').map(Number);
                if (year && month && day && year >= 1930) {
                  setStartDate(new Date(year, month - 1, day));
                }
              }}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: `1px solid ${colors.hintColor}`,
                background: colors.bgColor, color: colors.textColor, fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: colors.hintColor }}>До</label>
            <input type="date" value={endDate.toISOString().split('T')[0]}
              min="1930-03-20" max={`${new Date().getFullYear() + 4}-08-31`}
              onChange={(e) => {
                if (!e.target.value) return;
                const [year, month, day] = e.target.value.split('-').map(Number);
                if (year && month && day && year >= 1930) {
                  setEndDate(new Date(year, month - 1, day));
                }
              }}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: `1px solid ${colors.hintColor}`,
                background: colors.bgColor, color: colors.textColor, fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>
          <button style={{ ...styles.button, width: '100%', marginTop: '0', padding: '10px' }} onClick={() => setShowCalendar(false)}>
            Применить
          </button>
        </div>
      )}

      <div
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {(pullDistance > 0 || isRefreshing) && (
          <div style={{
            position: 'sticky', top: 0, height: pullDistance, display: 'flex',
            alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '10px',
            backgroundColor: colors.bgColor, zIndex: 5,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" style={{
              transform: isRefreshing ? 'rotate(0deg)' : `rotate(${Math.min((pullDistance / 80) * 360, 360)}deg)`,
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              transition: isRefreshing ? 'none' : 'transform 0.1s ease-out',
            }}>
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                fill={colors.buttonColor} />
            </svg>
          </div>
        )}
        <div style={{
          padding: '16px', paddingBottom: '80px',
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.2s ease-out' : 'none',
        }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '48px', opacity: 0.6 }}>⏳</div>
              <p style={{ fontSize: '15px', color: colors.hintColor, marginTop: '16px' }}>
                Загрузка событий...
              </p>
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '20px', minHeight: '60vh' }}>
              <div style={{ fontSize: '64px', opacity: 0.6 }}>😔</div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: colors.textColor, marginBottom: '8px' }}>
                Пока ничего не запланировано
              </h3>
              <p style={{ fontSize: '15px', color: colors.hintColor, lineHeight: '1.5', maxWidth: '300px' }}>
                Может быть, это знак создать что-то своё? Нажми на «+» и стань организатором!
              </p>
            </div>
          ) : (
            events.map((event, index) => {
              const showDateHeader = index === 0 ||
                new Date(events[index - 1].date).toDateString() !== new Date(event.date).toDateString();
              const isExpanded = expandedEventId === event.id;
              
              return (
                <div key={event.id}>
                  {showDateHeader && (
                    <div style={{
                      color: '#fbbf24', fontSize: '14px', fontWeight: 600,
                      marginTop: index === 0 ? '0' : '24px', marginBottom: '12px', paddingLeft: '4px',
                    }}>
                      {getDateHeader(event.date)}
                    </div>
                  )}
                  <div
                    style={{
                      background: `${colors.bgColor}cc`,
                      borderRadius: '16px',
                      padding: '16px',
                      marginBottom: '12px',
                      border: `1px solid ${colors.hintColor}40`,
                      boxShadow: `0 2px 8px ${colors.linkColor}20`,
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                  >
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                      {event.title}
                    </h3>
                    <p style={isExpanded ? { fontSize: '14px', color: colors.hintColor, marginBottom: '8px', lineHeight: '1.5' } : {
                      fontSize: '14px',
                      color: colors.hintColor,
                      marginBottom: '8px',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical' as any,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {isExpanded ? (event.fullDescription ?? event.description) : event.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: isExpanded ? '12px' : '0' }}>
                      <span style={{ color: colors.linkColor }}>🕐 {event.time}{isExpanded && event.endTime ? ` - ${event.endTime}` : ''}</span>
                      <span style={{ color: colors.hintColor }}>📍 {event.location}</span>
                    </div>
                    
                    {isExpanded && (
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.hintColor}40` }}>
                        {event.category && (
                          <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                            <span style={{ color: colors.hintColor }}>🏷️ Категория: </span>
                            <span style={{ color: colors.linkColor, fontWeight: 500 }}>{event.category}</span>
                          </div>
                        )}
                        <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                          <span style={{ color: colors.hintColor }}>👤 Организатор: </span>
                          <a href={`https://t.me/${event.organizerUsername?.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                            style={{ color: colors.linkColor, textDecoration: 'none', fontWeight: 500 }}
                            onClick={(e) => e.stopPropagation()}>
                            {event.organizerName} ({event.organizerUsername})
                          </a>
                        </div>
                        <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                          <span style={{ color: colors.hintColor }}>📅 Дата: </span>
                          <span style={{ color: colors.textColor }}>
                            {event.date.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        {event.registrationLink && (
                          <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                            <span style={{ color: colors.hintColor }}>📝 Где записаться: </span>
                            <a href={event.registrationLink.startsWith('http') ? event.registrationLink : `https://t.me/${event.registrationLink.replace('@', '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: colors.linkColor, textDecoration: 'none', fontWeight: 500 }}
                              onClick={(e) => e.stopPropagation()}>
                              {event.registrationLink}
                            </a>
                          </div>
                        )}
                        
                        {isModerator(user?.username) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.id!, event.title);
                            }}
                            style={{
                              width: '100%',
                              marginTop: '12px',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            🗑️ Удалить событие
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <button style={{
        position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px',
        borderRadius: '50%', background: colors.buttonColor, color: styles.theme?.button_text_color || '#fff',
        border: 'none', fontSize: '28px', cursor: 'pointer', boxShadow: `0 4px 16px ${colors.buttonColor}60`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      }} onClick={() => setShowCreateModal(true)}>
        +
      </button>

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          loadEvents();
        }}
        user={user}
        colors={colors}
        styles={styles}
      />
    </div>
  );
}
