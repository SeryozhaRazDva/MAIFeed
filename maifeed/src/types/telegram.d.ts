declare global {
    interface Window {
      Telegram?: {
        WebApp?: {
          ready(): void;
          expand(): void;
          enableClosingConfirmation(): void;
          disableClosingConfirmation(): void;
          colorScheme?: 'light' | 'dark';
          themeParams?: {
            bg_color?: string;
            text_color?: string;
            hint_color?: string;
            link_color?: string;
            button_color?: string;
            button_text_color?: string;
            secondary_bg_color?: string;
          };
          initDataUnsafe?: {
            user?: {
              id: number;
              first_name: string;
              photo_url?: string;
              last_name?: string;
              username?: string;
              language_code?: string;
              is_premium?: boolean;
            };
          };
        };
      };
    }
  }
  
  export {};