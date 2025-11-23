import { useState } from 'react';

function App() {
  window.Telegram?.WebApp?.ready();

  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const theme = window.Telegram?.WebApp?.themeParams;

  const bgColor = theme?.bg_color || '#0a0a0a';
  const textColor = theme?.text_color || '#ffffff';
  const buttonColor = theme?.button_color || '#3b82f6';
  const linkColor = theme?.link_color || '#06b6d4';
  const hintColor = theme?.hint_color || '#6b7280';

  // Состояние для переключения страниц
  const [step, setStep] = useState(0);

  // Пример статических данных
  const institutes = [
    { id: '1', name: 'Институт №1' },
    { id: '2', name: 'Институт №2' },
    { id: '3', name: 'Институт №3' }
  ];
  const courses = [
    { id: '1', name: '1 курс' },
    { id: '2', name: '2 курс' },
    { id: '3', name: '3 курс' }
  ];
  const groups = [
    { id: '1', name: 'Группа 101' },
    { id: '2', name: 'Группа 102' },
    { id: '3', name: 'Группа 103' }
  ];

  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  // Фото профиля (Telegram WebApp не передает photo_url)
  const avatarUrl = user?.id ? `https://t.me/i/userpic/320/${user.id}.jpg` : '';

  // Стили для контейнера
  const containerStyle = {
    backgroundColor: bgColor,
    color: textColor,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden',
  };

  // Стили для карточки
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    background: `${bgColor}cc`,
    borderRadius: '24px',
    padding: '32px',
    boxShadow: `0 4px 32px ${linkColor}30`,
    maxWidth: '400px',
    width: '100%',
    minHeight: 'auto',
  };

  // Страница приветствия
  if (step === 0) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          {/* Фото или заглушка */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '24px',
                boxShadow: `0 2px 8px ${linkColor}30`,
                background: `${hintColor}30`,
              }}
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${linkColor}, ${buttonColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: `0 2px 8px ${linkColor}30`
              }}
            >
              <span style={{ fontSize: '48px', color: '#fff', fontWeight: 'bold' }}>
                {user?.first_name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
            {user?.first_name || 'Гость'}
          </h2>
          <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>
            Добро пожаловать в MAIFeed
          </h3>
          <p style={{ fontSize: '14px', color: hintColor, textAlign: 'center', marginBottom: '24px' }}>
            Наш продукт старается быть централизированным местом для оповещения студентов о событиях, проходящих в вузе.
          </p>
          <button
            style={{
              background: buttonColor,
              color: theme?.button_text_color || '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
            onClick={() => setStep(1)}
          >
            Начать
          </button>
        </div>
      </div>
    );
  }

  // Страница выбора группы
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '24px' }}>Выбор группы</h2>
        <div style={{ width: '100%', marginBottom: '16px' }}>
          <label style={{ fontWeight: 500, marginBottom: '8px', display: 'block' }}>Выберите институт</label>
          <select
            style={{ width: '100%', padding: '8px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', background: bgColor, color: textColor, border: `1px solid ${hintColor}` }}
            value={selectedInstitute}
            onChange={e => setSelectedInstitute(e.target.value)}
          >
            <option value="">Выберите институт</option>
            {institutes.map((inst) => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
          <label style={{ fontWeight: 500, marginBottom: '8px', display: 'block' }}>Выберите курс</label>
          <select
            style={{ width: '100%', padding: '8px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', background: bgColor, color: textColor, border: `1px solid ${hintColor}` }}
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
          >
            <option value="">Выберите курс</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          <label style={{ fontWeight: 500, marginBottom: '8px', display: 'block' }}>Выберите группу</label>
          <select
            style={{ width: '100%', padding: '8px', borderRadius: '8px', cursor: 'pointer', background: bgColor, color: textColor, border: `1px solid ${hintColor}` }}
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
          >
            <option value="">Выберите группу</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        <button
          style={{
            background: buttonColor,
            color: theme?.button_text_color || '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 32px',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '8px'
          }}
          disabled={!selectedGroup}
        >
          Подтвердить
        </button>
        {/* Показываем выбранную группу */}
        {selectedGroup && (
          <div style={{ marginTop: '16px', color: linkColor, fontWeight: 500 }}>
            Вы выбрали группу: {groups.find(g => g.id === selectedGroup)?.name}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;