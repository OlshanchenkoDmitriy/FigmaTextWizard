import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Info, Heart, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { FeatureGrid } from './About/FeatureGrid';
import { ToolsList } from './About/ToolsList';
import { TechStack } from './About/TechStack';
import { APP_INFO, CONTACT_INFO } from './About/constants';

export function About() {
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} скопирован`);
    } catch (err) {
      toast.error('Ошибка копирования');
    }
  };

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#E8EAED' }}>
            <Info className="h-5 w-5" />
            О программе {APP_INFO.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#E8EAED' }}>
              {APP_INFO.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">Версия {APP_INFO.version}</Badge>
              <Badge style={{ backgroundColor: '#3A6BF0', color: '#FFFFFF' }}>
                {APP_INFO.status}
              </Badge>
            </div>
            <p className="text-lg" style={{ color: '#9CA3AF' }}>
              {APP_INFO.description}
            </p>
          </div>

          <FeatureGrid />
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle style={{ color: '#E8EAED' }}>Возможности</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolsList />
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle style={{ color: '#E8EAED' }}>Технологии</CardTitle>
        </CardHeader>
        <CardContent>
          <TechStack />
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle style={{ color: '#E8EAED' }}>Системные требования</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm" style={{ color: '#9CA3AF' }}>
            <p><strong style={{ color: '#E8EAED' }}>Платформа:</strong> {CONTACT_INFO.platform}</p>
            <p><strong style={{ color: '#E8EAED' }}>Браузер:</strong> Современный браузер с поддержкой ES2020+</p>
            <p><strong style={{ color: '#E8EAED' }}>Память:</strong> Минимум 512 МБ ОЗУ</p>
            <p><strong style={{ color: '#E8EAED' }}>Хранилище:</strong> 50 МБ свободного места</p>
            <p><strong style={{ color: '#E8EAED' }}>Интернет:</strong> Не требуется (офлайн режим)</p>
          </div>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#E8EAED' }}>
            <Heart className="h-5 w-5" />
            Благодарности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm" style={{ color: '#9CA3AF' }}>
            <p>
              Спасибо всем разработчикам открытого исходного кода, чьи библиотеки сделали этот проект возможным.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('https://react.dev', 'Ссылка на React')}
              >
                React Team
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('https://tailwindcss.com', 'Ссылка на Tailwind')}
              >
                Tailwind CSS
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('https://ui.shadcn.com', 'Ссылка на Shadcn/UI')}
              >
                Shadcn/UI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle style={{ color: '#E8EAED' }}>Лицензия и авторские права</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm" style={{ color: '#9CA3AF' }}>
            <p><strong style={{ color: '#E8EAED' }}>Версия:</strong> {CONTACT_INFO.version}</p>
            <p><strong style={{ color: '#E8EAED' }}>Сборка:</strong> {CONTACT_INFO.buildDate}</p>
            <p><strong style={{ color: '#E8EAED' }}>Акцентный цвет:</strong> 
              <span className="ml-2 px-2 py-1 rounded text-white" style={{ backgroundColor: CONTACT_INFO.accent }}>
                {CONTACT_INFO.accent}
              </span>
            </p>
            <p className="mt-4">
              <strong style={{ color: '#E8EAED' }}>Text Wizard</strong> - это инструмент для работы с текстом, 
              разработанный с упором на конфиденциальность и производительность.
            </p>
            <p>
              Все ваши данные остаются на вашем устройстве и никогда не передаются на внешние серверы.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}