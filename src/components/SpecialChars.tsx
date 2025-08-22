import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Zap, Search, Copy, Heart, Star, Crown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SpecialCharsProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

export function SpecialChars({ text, setText, onTextChange }: SpecialCharsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const insertChar = (char: string) => {
    const newText = text + char;
    setText(newText);
    onTextChange(newText);
    toast.success(`Символ добавлен`);
  };

  const copyChar = async (char: string) => {
    try {
      await navigator.clipboard.writeText(char);
      toast.success(`Символ скопирован`);
    } catch (err) {
      toast.error('Ошибка копирования');
    }
  };

  // Simplified symbol definitions to avoid syntax issues
  const punctuationChars = [
    { char: '…', name: 'Многоточие' },
    { char: '–', name: 'Среднее тире' },
    { char: '—', name: 'Длинное тире' },
    { char: '«', name: 'Левые кавычки' },
    { char: '»', name: 'Правые кавычки' },
    { char: '"', name: 'Левые кавычки' },
    { char: '"', name: 'Правые кавычки' }
  ];

  const arrowChars = [
    { char: '←', name: 'Стрелка влево' },
    { char: '→', name: 'Стрелка вправо' },
    { char: '↑', name: 'Стрелка вверх' },
    { char: '↓', name: 'Стрелка вниз' },
    { char: '↔', name: 'Стрелка влево-вправо' },
    { char: '⇐', name: 'Двойная стрелка влево' },
    { char: '⇒', name: 'Двойная стрелка вправо' }
  ];

  const mathChars = [
    { char: '±', name: 'Плюс-минус' },
    { char: '×', name: 'Умножение' },
    { char: '÷', name: 'Деление' },
    { char: '≠', name: 'Не равно' },
    { char: '≤', name: 'Меньше или равно' },
    { char: '≥', name: 'Больше или равно' },
    { char: '∞', name: 'Бесконечность' },
    { char: 'π', name: 'Пи' },
    { char: '√', name: 'Корень' }
  ];

  const currencyChars = [
    { char: '€', name: 'Евро' },
    { char: '£', name: 'Фунт' },
    { char: '¥', name: 'Йена' },
    { char: '¢', name: 'Цент' },
    { char: '₽', name: 'Рубль' },
    { char: '₴', name: 'Гривна' }
  ];

  const symbolChars = [
    { char: '©', name: 'Копирайт' },
    { char: '®', name: 'Торговая марка' },
    { char: '™', name: 'Торговая марка' },
    { char: '§', name: 'Параграф' },
    { char: '•', name: 'Буллет' },
    { char: '★', name: 'Звезда' },
    { char: '☆', name: 'Звезда пустая' },
    { char: '♠', name: 'Пики' },
    { char: '♣', name: 'Трефы' },
    { char: '♥', name: 'Червы' },
    { char: '♦', name: 'Бубны' }
  ];

  const emojiChars = [
    { char: '😀', name: 'Улыбка' },
    { char: '😂', name: 'Смех' },
    { char: '😍', name: 'Влюблённость' },
    { char: '🤔', name: 'Задумчивость' },
    { char: '😎', name: 'Крутость' },
    { char: '👍', name: 'Лайк' },
    { char: '👎', name: 'Дизлайк' },
    { char: '❤️', name: 'Сердце' },
    { char: '🔥', name: 'Огонь' },
    { char: '⚡', name: 'Молния' }
  ];

  const categories = [
    { id: 'punctuation', label: 'Пунктуация', chars: punctuationChars },
    { id: 'arrows', label: 'Стрелки', chars: arrowChars },
    { id: 'math', label: 'Математика', chars: mathChars },
    { id: 'currency', label: 'Валюты', chars: currencyChars },
    { id: 'symbols', label: 'Символы', chars: symbolChars },
    { id: 'emojis', label: 'Эмодзи', chars: emojiChars }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    chars: category.chars.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.char.includes(searchTerm)
    )
  })).filter(category => category.chars.length > 0);

  const renderCharGrid = (chars: typeof punctuationChars) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {chars.map((item, index) => (
        <Card key={index} style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{item.char}</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => insertChar(item.char)}
                  className="h-6 w-6 p-0"
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyChar(item.char)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="text-xs" style={{ color: '#9CA3AF' }}>
              <div className="font-medium">{item.name}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#E8EAED' }}>
            <Zap className="h-5 w-5" />
            Специальные символы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#9CA3AF' }} />
            <Input
              placeholder="Поиск символов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="punctuation" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#E8EAED' }}>
                  <Badge variant="secondary">{category.chars.length}</Badge>
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCharGrid(category.chars)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {filteredCategories.length === 0 && searchTerm && (
        <Card style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p style={{ color: '#9CA3AF' }}>
              Символы по запросу не найдены
            </p>
          </CardContent>
        </Card>
      )}

      {!searchTerm && (
        <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle style={{ color: '#E8EAED' }}>Быстрые наборы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                onClick={() => insertChar('♥ ♡ ❤️ 💙 💚 💛')}
              >
                <Heart className="h-4 w-4 mr-1" />
                Сердечки
              </Button>
              <Button
                variant="outline"
                onClick={() => insertChar('★ ☆ ✦ ✧ ✩ ✪')}
              >
                <Star className="h-4 w-4 mr-1" />
                Звёзды
              </Button>
              <Button
                variant="outline"
                onClick={() => insertChar('← → ↑ ↓ ↔ ⇐ ⇒')}
              >
                Стрелки
              </Button>
              <Button
                variant="outline"
                onClick={() => insertChar('$ € £ ¥ ₽ ₴')}
              >
                <Crown className="h-4 w-4 mr-1" />
                Валюты
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}