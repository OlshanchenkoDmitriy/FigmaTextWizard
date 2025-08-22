import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { List, ArrowUpDown, Hash, Star, Check, Circle, Square } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ListsProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

export function Lists({ text, setText, onTextChange }: ListsProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [listPrefix, setListPrefix] = useState('•');
  const [customPrefix, setCustomPrefix] = useState('');
  const [startNumber, setStartNumber] = useState(1);

  const applyListFormatting = (newText: string, message: string) => {
    setText(newText);
    onTextChange(newText);
    toast.success(message);
  };

  const createBulletList = (bullet: string = '•') => {
    if (!text.trim()) {
      toast.error('Нет текста для форматирования');
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const formatted = lines.map(line => `${bullet} ${line.trim()}`).join('\n');
    applyListFormatting(formatted, 'Маркированный список создан');
  };

  const createNumberedList = (start: number = 1) => {
    if (!text.trim()) {
      toast.error('Нет текста для форматирования');
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const formatted = lines.map((line, index) => `${start + index}. ${line.trim()}`).join('\n');
    applyListFormatting(formatted, 'Нумерованный список создан');
  };

  const createCheckboxList = (checked: boolean = false) => {
    if (!text.trim()) {
      toast.error('Нет текста для форматирования');
      return;
    }

    const checkbox = checked ? '☑' : '☐';
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const formatted = lines.map(line => `${checkbox} ${line.trim()}`).join('\n');
    applyListFormatting(formatted, `Список с флажками создан (${checked ? 'отмеченные' : 'пустые'})`);
  };

  const createAlphabetList = (uppercase: boolean = false) => {
    if (!text.trim()) {
      toast.error('Нет текста для форматирования');
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const formatted = lines.map((line, index) => {
      const letter = String.fromCharCode((uppercase ? 65 : 97) + (index % 26));
      return `${letter}. ${line.trim()}`;
    }).join('\n');
    applyListFormatting(formatted, `Алфавитный список создан (${uppercase ? 'заглавные' : 'строчные'})`);
  };

  const createRomanList = (uppercase: boolean = false) => {
    if (!text.trim()) {
      toast.error('Нет текста для форматирования');
      return;
    }

    const toRoman = (num: number, upper: boolean): string => {
      const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      const symbols = upper 
        ? ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
        : ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
      
      let result = '';
      for (let i = 0; i < values.length; i++) {
        while (num >= values[i]) {
          result += symbols[i];
          num -= values[i];
        }
      }
      return result;
    };

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const formatted = lines.map((line, index) => {
      const roman = toRoman(index + 1, uppercase);
      return `${roman}. ${line.trim()}`;
    }).join('\n');
    applyListFormatting(formatted, `Римский список создан (${uppercase ? 'заглавные' : 'строчные'})`);
  };

  const removeBullets = () => {
    if (!text.trim()) {
      toast.error('Нет текста для обработки');
      return;
    }

    const lines = text.split('\n');
    const cleaned = lines.map(line => 
      line.replace(/^[\s]*[•◦▪▫‣⁃◾◽▪▫★☆✓✗☐☑\-\*\+]\s*/, '')
         .replace(/^[\s]*[a-zA-Z0-9]+[\.\)]\s*/, '')
         .replace(/^[\s]*[ivxlcdmIVXLCDM]+[\.\)]\s*/, '')
    );
    applyListFormatting(cleaned.join('\n'), 'Маркеры списка удалены');
  };

  const sortList = () => {
    if (!text.trim()) {
      toast.error('Нет текста для сортировки');
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Preserve list formatting while sorting
    const sortedLines = lines.map(line => {
      const match = line.match(/^(\s*[•◦▪▫‣⁃◾◽▪▫★☆✓✗☐☑\-\*\+]?\s*)/);
      const prefix = match ? match[1] : '';
      const content = line.substring(prefix.length);
      return { prefix, content, original: line };
    }).sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.content.localeCompare(b.content);
      } else {
        return b.content.localeCompare(a.content);
      }
    });

    // Re-number if it's a numbered list
    const formatted = sortedLines.map((item, index) => {
      if (item.prefix.match(/^\s*\d+[\.\)]\s*/)) {
        return `${index + 1}. ${item.content}`;
      }
      return `${item.prefix}${item.content}`;
    }).join('\n');

    applyListFormatting(formatted, `Список отсортирован (${sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию'})`);
  };

  const reverseList = () => {
    if (!text.trim()) {
      toast.error('Нет текста для обработки');
      return;
    }

    const lines = text.split('\n').reverse();
    applyListFormatting(lines.join('\n'), 'Порядок списка изменён на обратный');
  };

  const removeDuplicates = () => {
    if (!text.trim()) {
      toast.error('Нет текста для обработки');
      return;
    }

    const lines = text.split('\n');
    const seen = new Set();
    const unique = lines.filter(line => {
      const content = line.replace(/^[\s]*[•◦▪▫‣⁃◾◽▪▫★☆✓✗☐☑\-\*\+\d\w]+[\.\)]*\s*/, '').trim();
      if (content === '' || seen.has(content)) {
        return false;
      }
      seen.add(content);
      return true;
    });

    applyListFormatting(unique.join('\n'), `Удалено ${lines.length - unique.length} дубликатов`);
  };

  const shuffleList = () => {
    if (!text.trim()) {
      toast.error('Нет текста для перемешивания');
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Shuffle array
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }

    applyListFormatting(lines.join('\n'), 'Список перемешан');
  };

  const bulletOptions = [
    { value: '•', label: '• Точка' },
    { value: '◦', label: '◦ Кружок' },
    { value: '▪', label: '▪ Квадрат' },
    { value: '‣', label: '‣ Стрелка' },
    { value: '★', label: '★ Звезда' },
    { value: '→', label: '→ Стрелка вправо' },
    { value: '✓', label: '✓ Галочка' },
    { value: '-', label: '- Дефис' },
    { value: '*', label: '* Звёздочка' },
    { value: '+', label: '+ Плюс' }
  ];

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#E8EAED' }}>
            <List className="h-5 w-5" />
            Работа со списками
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Create Lists */}
          <div className="space-y-4">
            <h3 className="font-medium" style={{ color: '#E8EAED' }}>Создание списков</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm" style={{ color: '#9CA3AF' }}>Маркированный список</label>
                <div className="flex gap-2">
                  <Select value={listPrefix} onValueChange={setListPrefix}>
                    <SelectTrigger style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
                      {bulletOptions.map(option => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          style={{ color: '#E8EAED' }}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => createBulletList(listPrefix)} disabled={!text}>
                    Создать
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Свой символ"
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                    className="flex-1"
                    style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                  />
                  <Button onClick={() => createBulletList(customPrefix)} disabled={!text || !customPrefix}>
                    Применить
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm" style={{ color: '#9CA3AF' }}>Нумерованный список</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Начать с"
                    value={startNumber}
                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                    style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                  />
                  <Button onClick={() => createNumberedList(startNumber)} disabled={!text}>
                    Создать
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" onClick={() => createCheckboxList(false)} disabled={!text}>
                <Square className="h-4 w-4 mr-1" />
                Флажки пустые
              </Button>
              <Button variant="outline" onClick={() => createCheckboxList(true)} disabled={!text}>
                <Check className="h-4 w-4 mr-1" />
                Флажки отмеченные
              </Button>
              <Button variant="outline" onClick={() => createAlphabetList(false)} disabled={!text}>
                a. Алфавит
              </Button>
              <Button variant="outline" onClick={() => createAlphabetList(true)} disabled={!text}>
                A. АЛФАВИТ
              </Button>
              <Button variant="outline" onClick={() => createRomanList(false)} disabled={!text}>
                i. Римские
              </Button>
              <Button variant="outline" onClick={() => createRomanList(true)} disabled={!text}>
                I. РИМСКИЕ
              </Button>
            </div>
          </div>

          {/* List Operations */}
          <div className="space-y-4">
            <h3 className="font-medium" style={{ color: '#E8EAED' }}>Операции со списками</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button variant="outline" onClick={removeBullets} disabled={!text}>
                Удалить маркеры
              </Button>
              <Button variant="outline" onClick={removeDuplicates} disabled={!text}>
                Удалить дубликаты
              </Button>
              <Button variant="outline" onClick={reverseList} disabled={!text}>
                Обратить порядок
              </Button>
              <Button variant="outline" onClick={shuffleList} disabled={!text}>
                Перемешать
              </Button>
              
              <div className="flex gap-2">
                <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                  <SelectTrigger style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
                    <SelectItem value="asc" style={{ color: '#E8EAED' }}>По возрастанию</SelectItem>
                    <SelectItem value="desc" style={{ color: '#E8EAED' }}>По убыванию</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={sortList} disabled={!text}>
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Сортировать
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {text && (
        <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle style={{ color: '#E8EAED' }}>Предпросмотр</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text}
              readOnly
              className="font-mono min-h-32"
              style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
            />
          </CardContent>
        </Card>
      )}

      {!text && (
        <Card style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
          <CardContent className="text-center py-8">
            <List className="h-12 w-12 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p style={{ color: '#9CA3AF' }}>
              Добавьте текст в редактор для работы со списками
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}