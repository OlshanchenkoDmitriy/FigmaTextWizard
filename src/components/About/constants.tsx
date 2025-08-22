import { Heart, Github, Globe, Mail, Zap, Shield, Smartphone, Info } from 'lucide-react';

export const APP_INFO = {
  name: 'Text Wizard',
  version: '1.0.0',
  description: 'Продвинутый офлайн-редактор текста для мобильных устройств',
  status: 'Стабильная'
};

export const FEATURES = [
  {
    icon: Zap,
    title: 'Быстрая работа',
    description: 'Мгновенная обработка текста без задержек'
  },
  {
    icon: Shield,
    title: 'Конфиденциальность',
    description: 'Все данные хранятся локально на вашем устройстве'
  },
  {
    icon: Smartphone,
    title: 'Мобильная оптимизация',
    description: 'Идеально работает на Xiaomi Redmi Note 13 Pro'
  },
  {
    icon: Globe,
    title: 'Офлайн режим',
    description: 'Полная функциональность без интернета'
  }
];

export const TOOLS = [
  'Редактор текста с Undo/Redo',
  'Поиск и замена с RegExp',
  'Каталог форматирования (50+ операций)',
  'Работа со списками',
  'Markdown редактор',
  'Специальные символы (200+ символов)',
  'RegExp макросы',
  'Статистика текста',
  'Менеджер заметок',
  'Suno Editor для песен',
  'История изменений',
  'Настройки и персонализация'
];

export const TECHNOLOGIES = [
  { name: 'React 18', description: 'Современный UI фреймворк' },
  { name: 'TypeScript', description: 'Типизированный JavaScript' },
  { name: 'Tailwind CSS v4', description: 'Утилитарные CSS стили' },
  { name: 'Shadcn/UI', description: 'Компоненты интерфейса' },
  { name: 'Lucide Icons', description: 'Красивые SVG иконки' },
  { name: 'Local Storage', description: 'Локальное хранение данных' },
  { name: 'PWA Ready', description: 'Готов к установке как приложение' }
];

export const CONTACT_INFO = {
  version: '1.0.0',
  buildDate: '2024',
  platform: 'Xiaomi Redmi Note 13 Pro',
  accent: '#3A6BF0'
};