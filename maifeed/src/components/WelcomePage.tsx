import { keyframesCSS } from '../styles';

interface WelcomePageProps {
  user: any;
  avatarUrl: string;
  showFallback: boolean;
  setShowFallback: (val: boolean) => void;
  onStart: () => void;
  styles: any;
}

export const WelcomePage = ({ user, avatarUrl, showFallback, setShowFallback, onStart, styles }: WelcomePageProps) => {
  const { container, card, avatar, button, colors } = styles;

  return (
    <div style={container}>
      <style>{keyframesCSS}</style>
      <div style={{ ...card, animation: 'scaleIn 0.5s ease-out' }}>
        {avatarUrl && !showFallback ? (
          <img
            src={avatarUrl}
            alt="avatar"
            style={{ ...avatar, objectFit: 'cover', background: `${colors.hintColor}30` }}
            onError={() => setShowFallback(true)}
          />
        ) : (
          <div style={{
            ...avatar,
            background: `linear-gradient(135deg, ${colors.linkColor}, ${colors.buttonColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
        <p style={{ fontSize: '14px', color: colors.hintColor, textAlign: 'center', marginBottom: '24px' }}>
          Наш продукт старается быть централизированным местом для оповещения студентов о событиях, проходящих в вузе.
        </p>
        <button style={button} onClick={onStart}>Начать</button>
      </div>
    </div>
  );
};
