import { keyframesCSS } from '../styles';

interface GroupSelectorProps {
  institutes: any[];
  selectedInstitute: string;
  setSelectedInstitute: (val: string) => void;
  selectedCourse: string;
  setSelectedCourse: (val: string) => void;
  selectedGroup: string;
  setSelectedGroup: (val: string) => void;
  setSelectedGroupName: (val: string) => void;
  courses: any[];
  groups: any[];
  onConfirm: () => void;
  styles: any;
}

export const GroupSelector = ({
  institutes, selectedInstitute, setSelectedInstitute,
  selectedCourse, setSelectedCourse, selectedGroup, setSelectedGroup,
  setSelectedGroupName, courses, groups,
  onConfirm, styles
}: GroupSelectorProps) => {
  const { container, card, select, button } = styles;

  return (
    <div style={container}>
      <style>{keyframesCSS}</style>
      <div style={{ ...card, animation: 'slideInUp 0.6s ease-out' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '24px' }}>Выбор группы</h2>
        
        <div style={{ width: '100%', marginBottom: '16px' }}>
          <label style={{ fontWeight: 500, marginBottom: '8px', display: 'block' }}>Выберите институт</label>
          <select style={select} value={selectedInstitute} onChange={e => {
            const value = e.target.value;
            setSelectedInstitute(value);
            if (value !== selectedInstitute) {
              setTimeout(() => {
                setSelectedCourse('');
                setSelectedGroup('');
              }, 0);
            }
          }}>
            <option value="">Выберите институт</option>
            {institutes.map((inst) => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
          </select>

          <label style={{ fontWeight: 500, marginBottom: '8px', display: 'block' }}>Выберите курс</label>
          <select style={select} value={selectedCourse} onChange={e => {
            const value = e.target.value;
            setSelectedCourse(value);
            if (value !== selectedCourse) {
              setTimeout(() => setSelectedGroup(''), 0);
            }
          }} disabled={!selectedInstitute || courses.length === 0}>
            <option value="">Выберите курс</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
          </select>

          <label style={{ fontWeight: 500, marginBottom: '8px', display: 'block' }}>Выберите группу</label>
          <select style={select} value={selectedGroup} onChange={e => {
            setSelectedGroup(e.target.value);
            const groupName = groups.find(g => g.id === e.target.value)?.name || '';
            setSelectedGroupName(groupName);
          }} disabled={!selectedCourse || groups.length === 0}>
            <option value="">Выберите группу</option>
            {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
        </div>

        <button style={button} onClick={onConfirm} disabled={!selectedGroup}>
          Подтвердить
        </button>
      </div>
    </div>
  );
};
