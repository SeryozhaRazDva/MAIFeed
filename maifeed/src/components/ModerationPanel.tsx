import { useState, useEffect } from 'react';
import { getPendingEvents, approveEvent, rejectEvent } from '../services/moderationService';
import { keyframesCSS } from '../styles';
import { isModerator, getTelegramUser } from '../utils/auth';

interface ModerationPanelProps {
  onBack: () => void;
  styles: any;
}

export function ModerationPanel({ onBack, styles }: ModerationPanelProps) {
  const { colors } = styles;
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const user = getTelegramUser();
  const hasAccess = isModerator(user?.username);

  const loadPendingEvents = async () => {
    setIsLoading(true);
    try {
      const events = await getPendingEvents();
      setPendingEvents(events);
    } catch (error) {
      console.error('Error loading pending events:', error);
      alert('Ошибка загрузки событий на модерации');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingEvents();
  }, []);

  const handleApprove = async (eventId: string) => {
    if (!confirm('Одобрить это событие?')) return;
    
    try {
      await approveEvent(eventId);
      alert('Событие одобрено!');
      loadPendingEvents();
    } catch (error) {
      console.error('Error approving:', error);
      alert('Ошибка при одобрении');
    }
  };

  const handleReject = async (eventId: string) => {
    if (!confirm('Отклонить это событие?')) return;
    
    try {
      await rejectEvent(eventId);
      alert('Событие отклонено');
      loadPendingEvents();
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Ошибка при отклонении');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bgColor,
      color: colors.textColor,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{keyframesCSS}</style>
      
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: colors.secondaryBgColor,
        borderBottom: `1px solid ${colors.hintColor}40`,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.linkColor,
            fontSize: '16px',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          ← Назад
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
          Модерация событий
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px', paddingBottom: '80px' }}>
        {!hasAccess ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', opacity: 0.6 }}>🚫</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              Доступ запрещён
            </h3>
            <p style={{ fontSize: '15px', color: colors.hintColor }}>
              У вас нет прав модератора
            </p>
          </div>
        ) : isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', opacity: 0.6 }}>⏳</div>
            <p style={{ fontSize: '15px', color: colors.hintColor, marginTop: '16px' }}>
              Загрузка...
            </p>
          </div>
        ) : pendingEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', opacity: 0.6 }}>✅</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              Нет событий на модерации
            </h3>
            <p style={{ fontSize: '15px', color: colors.hintColor }}>
              Все события обработаны!
            </p>
          </div>
        ) : (
          pendingEvents.map((event) => {
            const isExpanded = expandedEventId === event.id;
            
            return (
              <div
                key={event.id}
                style={{
                  background: `${colors.secondaryBgColor}`,
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: `2px solid ${colors.linkColor}40`,
                  boxShadow: `0 2px 8px ${colors.linkColor}20`,
                }}
              >
                <div onClick={() => setExpandedEventId(isExpanded ? null : event.id)} style={{ cursor: 'pointer' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: colors.hintColor, marginBottom: '8px', lineHeight: '1.5' }}>
                    {event.description}
                  </p>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: colors.linkColor }}>🕐 {event.time}</span>
                    {' • '}
                    <span style={{ color: colors.hintColor }}>📍 {event.location}</span>
                    {' • '}
                    <span style={{ color: colors.hintColor }}>
                      📅 {event.date.toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.hintColor}40` }}>
                    <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: colors.hintColor }}>👤 Организатор: </span>
                      <span style={{ color: colors.textColor }}>
                        {event.organizerName} ({event.organizerUsername})
                      </span>
                    </div>
                    
                    {event.institute && (
                      <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: colors.hintColor }}>🏛️ Институт: </span>
                        <span style={{ color: colors.textColor }}>{event.institute}</span>
                        {event.course && `, ${event.course}`}
                        {event.studentGroup && `, ${event.studentGroup}`}
                      </div>
                    )}
                    
                    {event.registrationLink && (
                      <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: colors.hintColor }}>📝 Контакты: </span>
                        <span style={{ color: colors.linkColor }}>{event.registrationLink}</span>
                      </div>
                    )}
                    
                    <div style={{ marginBottom: '12px', fontSize: '13px', color: colors.hintColor }}>
                      Создано: {event.createdAt.toLocaleString('ru-RU')}
                    </div>

                    {/* Кнопки модерации */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button
                        onClick={() => handleApprove(event.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#22c55e',
                          color: '#fff',
                          fontSize: '15px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ✅ Одобрить
                      </button>
                      <button
                        onClick={() => handleReject(event.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#ef4444',
                          color: '#fff',
                          fontSize: '15px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ❌ Отклонить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
