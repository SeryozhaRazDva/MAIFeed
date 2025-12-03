import { useState, useEffect } from 'react';
import { createEvent } from '../services/eventService';
import { maiData } from '../maiData';
import { isTelegramUser } from '../utils/auth';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  user: any;
  colors: any;
  styles: any;
}

export function CreateEventModal({ isOpen, onClose, groupId, user, colors, styles }: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedInstituteId, setSelectedInstituteId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill contact info with Telegram username
  useEffect(() => {
    if (user?.username) {
      setContactInfo(`@${user.username}`);
    }
  }, [user]);

  const selectedInstitute = maiData.find(inst => inst.id === selectedInstituteId);
  const courses = selectedInstitute?.courses || [];
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const groups = selectedCourse?.groups || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка авторизации через Telegram
    if (!isTelegramUser()) {
      alert('Ошибка: Вы не зашли через Telegram WebApp. Откройте приложение из Telegram.');
      return;
    }
    
    if (!title || !description || !date || !time || !location) {
      alert('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    try {
      const institute = selectedInstitute?.name || undefined;
      const course = selectedCourse?.name || undefined;
      const studentGroup = groups.find(g => g.id === selectedGroupId)?.name || undefined;

      await createEvent({
        title,
        description,
        date: new Date(date),
        time,
        endTime,
        location,
        institute,
        course,
        studentGroup,
        organizerId: user?.id?.toString() || 'unknown',
        organizerName: user?.first_name || 'Аноним',
        organizerUsername: user?.username ? `@${user.username}` : '@unknown',
        groupId,
        registrationLink: contactInfo,
      });

      alert('Событие отправлено на модерацию!');
      onClose();
      // Очистка формы
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setEndTime('');
      setLocation('');
      setSelectedInstituteId('');
      setSelectedCourseId('');
      setSelectedGroupId('');
      setContactInfo(user?.username ? `@${user.username}` : '');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Ошибка при создании события');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: `1px solid ${colors.hintColor}`,
    background: colors.bgColor,
    color: colors.textColor,
    fontSize: '15px',
    boxSizing: 'border-box' as const,
    marginBottom: '12px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '6px',
    color: colors.textColor,
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: colors.bgColor,
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: `1px solid ${colors.hintColor}40`,
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '20px', color: colors.textColor }}>
          Создать событие
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Название *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            placeholder="Например: Хакатон по AI"
            required
          />

          <label style={labelStyle}>Описание *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
            placeholder="Краткое или подробное описание события"
            required
          />

          <label style={labelStyle}>Дата *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
            min={new Date().toISOString().split('T')[0]}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Время начала *</label>
              <input
                type="text"
                value={time}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9:]/g, '');
                  if (val.length <= 5) setTime(val);
                }}
                onBlur={(e) => {
                  const parts = e.target.value.split(':');
                  if (parts.length === 2) {
                    const h = parts[0].padStart(2, '0');
                    const m = parts[1].padStart(2, '0');
                    setTime(`${h}:${m}`);
                  }
                }}
                style={inputStyle}
                placeholder="Например: 14:30"
                maxLength={5}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Время окончания</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9:]/g, '');
                  if (val.length <= 5) setEndTime(val);
                }}
                onBlur={(e) => {
                  const parts = e.target.value.split(':');
                  if (parts.length === 2) {
                    const h = parts[0].padStart(2, '0');
                    const m = parts[1].padStart(2, '0');
                    setEndTime(`${h}:${m}`);
                  }
                }}
                style={inputStyle}
                placeholder="Например: 16:00"
                maxLength={5}
              />
            </div>
          </div>

          <label style={labelStyle}>Место проведения *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
            placeholder="Например: 607 ГУК зона А"
            required
          />

          <div style={{ marginTop: '16px', marginBottom: '8px', paddingTop: '12px', borderTop: `1px solid ${colors.hintColor}40` }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: colors.textColor }}>Для кого? (необязательно)</h3>
            <p style={{ fontSize: '13px', color: colors.hintColor, marginBottom: '12px', lineHeight: '1.4' }}>
              Укажите целевую аудиторию. Если не выбрано — событие увидят все.
            </p>

            <label style={labelStyle}>Институт</label>
            <select
              value={selectedInstituteId}
              onChange={(e) => {
                setSelectedInstituteId(e.target.value);
                setSelectedCourseId('');
                setSelectedGroupId('');
              }}
              style={inputStyle}
            >
              <option value="">Все институты</option>
              {maiData.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>

            {selectedInstituteId && (
              <>
                <label style={labelStyle}>Курс</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedGroupId('');
                  }}
                  style={inputStyle}
                >
                  <option value="">Все курсы</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </>
            )}

            {selectedCourseId && (
              <>
                <label style={labelStyle}>Группа</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Все группы</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          <label style={labelStyle}>Где записаться?</label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            style={inputStyle}
            placeholder="@username, ссылка или телефон"
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                flex: 1,
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Отправка...' : 'Создать'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...styles.button,
                flex: 1,
                background: 'transparent',
                border: `1px solid ${colors.hintColor}`,
                color: colors.textColor,
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
