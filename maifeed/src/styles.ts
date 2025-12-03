export const createStyles = (theme: any) => {
  const bgColor = theme?.bg_color || '#0a0a0a';
  const textColor = theme?.text_color || '#ffffff';
  const buttonColor = theme?.button_color || '#3b82f6';
  const linkColor = theme?.link_color || '#06b6d4';
  const hintColor = theme?.hint_color || '#6b7280';

  return {
    container: {
      backgroundColor: bgColor,
      color: textColor,
      minHeight: '100vh',
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      overflow: 'hidden',
    },
    
    card: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      background: `${bgColor}cc`,
      borderRadius: '24px',
      padding: '32px',
      maxWidth: '400px',
      width: '100%',
    },
    
    avatar: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      marginBottom: '24px',
      boxShadow: `0 2px 8px ${linkColor}30`,
    },
    
    select: {
      width: '100%',
      padding: '8px',
      borderRadius: '8px',
      marginBottom: '8px',
      cursor: 'pointer',
      background: bgColor,
      color: textColor,
      border: `1px solid ${hintColor}`,
    },
    
    button: {
      background: buttonColor,
      color: theme?.button_text_color || '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 32px',
      fontWeight: 600,
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '8px',
    },

    feedContainer: {
      backgroundColor: bgColor,
      color: textColor,
      height: '100vh',
      display: 'flex' as const,
      flexDirection: 'column' as const,
      animation: 'fadeIn 0.4s ease-out',
      overflow: 'hidden',
    },

    header: {
      flexShrink: 0,
      backgroundColor: bgColor,
      padding: '16px',
      borderBottom: `1px solid ${hintColor}40`,
      zIndex: 10,
      display: 'flex' as const,
      gap: '8px',
    },

    headerButton: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: '8px',
      border: `1px solid ${hintColor}`,
      background: bgColor,
      color: textColor,
      fontWeight: 500,
      cursor: 'pointer',
    },

    colors: {
      bgColor,
      textColor,
      buttonColor,
      linkColor,
      hintColor,
      secondaryBgColor: `${bgColor}cc`,
    },

    theme,
  };
};

export const keyframesCSS = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
