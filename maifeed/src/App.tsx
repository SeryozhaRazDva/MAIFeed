import { useState, useEffect } from 'react';
import { maiData } from './maiData';
import { createStyles } from './styles';
import { WelcomePage } from './components/WelcomePage';
import { GroupSelector } from './components/GroupSelector';
import { EventFeed } from './components/EventFeed';
import { ModerationPanel } from './components/ModerationPanel';

function App() {
  window.Telegram?.WebApp?.ready();
  
  useEffect(() => {
    window.Telegram?.WebApp?.expand();
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
  }, []);

  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const theme = window.Telegram?.WebApp?.themeParams;
  const styles = createStyles(theme);

  const [page, setPage] = useState(0);
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [lastConfirmedInstitute, setLastConfirmedInstitute] = useState('');
  const [lastConfirmedCourse, setLastConfirmedCourse] = useState('');
  const [lastConfirmedGroup, setLastConfirmedGroup] = useState('');
  const [lastConfirmedGroupName, setLastConfirmedGroupName] = useState('');

  const institutes = maiData;
  const selectedInstituteData = institutes.find(i => i.id === selectedInstitute);
  const courses = selectedInstituteData?.courses || [];
  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const groups = selectedCourseData?.groups || [];
  
  const avatarUrl = user?.photo_url || (user?.id ? `https://t.me/i/userpic/320/${user.id}.jpg` : '');
  const [showFallback, setShowFallback] = useState(false);

  // Страница 0 - Приветствие
  if (page === 0) {
    return (
      <WelcomePage
        user={user}
        avatarUrl={avatarUrl}
        showFallback={showFallback}
        setShowFallback={setShowFallback}
        onStart={() => setPage(1)}
        styles={styles}
      />
    );
  }

  // Страница 1 - Выбор группы
  if (page === 1) {
    return (
      <GroupSelector
        institutes={institutes}
        selectedInstitute={selectedInstitute}
        setSelectedInstitute={setSelectedInstitute}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        setSelectedGroupName={setSelectedGroupName}
        courses={courses}
        groups={groups}
        lastConfirmedGroupName={lastConfirmedGroupName}
        lastConfirmedInstitute={lastConfirmedInstitute}
        lastConfirmedCourse={lastConfirmedCourse}
        lastConfirmedGroup={lastConfirmedGroup}
        onConfirm={() => {
          if (selectedGroup) {
            setLastConfirmedInstitute(selectedInstitute);
            setLastConfirmedCourse(selectedCourse);
            setLastConfirmedGroup(selectedGroup);
            setLastConfirmedGroupName(selectedGroupName);
            setPage(2);
          }
        }}
        onRestoreLastGroup={() => {
          setSelectedInstitute(lastConfirmedInstitute);
          setSelectedCourse(lastConfirmedCourse);
          setSelectedGroup(lastConfirmedGroup);
        }}
        styles={styles}
      />
    );
  }

  // Страница 3 - Админ-панель модерации
  if (page === 3) {
    return (
      <ModerationPanel
        onBack={() => setPage(2)}
        styles={styles}
      />
    );
  }

  // Страница 2 - Лента событий
  return (
    <EventFeed
      selectedGroupName={selectedGroupName}
      selectedGroupId={selectedGroup}
      onOpenModeration={() => setPage(3)}
      onBackToSelector={() => {
        setSelectedInstitute('');
        setSelectedCourse('');
        setSelectedGroup('');
        setPage(1);
      }}
      user={user}
      styles={styles}
    />
  );
}

export default App;
