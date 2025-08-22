import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Type, List, ArrowUpDown, Eraser, Hash, Quote } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FormattingToolsProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

export function FormattingTools({ text, setText, onTextChange }: FormattingToolsProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const applyFormatting = (newText: string) => {
    setText(newText);
    onTextChange(newText);
  };

  const formatCase = (caseType: string) => {
    let formatted = '';
    switch (caseType) {
      case 'upper':
        formatted = text.toUpperCase();
        break;
      case 'lower':
        formatted = text.toLowerCase();
        break;
      case 'title':
        formatted = text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentence':
        formatted = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => 
          c.toUpperCase()
        );
        break;
      case 'toggle':
        formatted = text.split('').map(char => 
          char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
        ).join('');
        break;
      default:
        return;
    }
    applyFormatting(formatted);
    toast.success('Регистр изменён');
  };

  const createList = (type: 'bullet' | 'numbered') => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    let formatted = '';
    
    if (type === 'bullet') {
      formatted = lines.map(line => `• ${line.trim()}`).join('\n');
    } else {
      formatted = lines.map((line, index) => `${index + 1}. ${line.trim()}`).join('\n');
    }
    
    applyFormatting(formatted);
    toast.success(`${type === 'bullet' ? 'Маркированный' : 'Нумерованный'} список создан`);
  };

  const sortLines = () => {
    const lines = text.split('\n');
    const sorted = [...lines].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    });
    
    applyFormatting(sorted.join('\n'));
    toast.success(`Строки отсортированы по ${sortOrder === 'asc' ? 'возрастанию' : 'убыванию'}`);
  };

  const removeDuplicates = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    applyFormatting(unique.join('\n'));
    toast.success(`Удалено ${lines.length - unique.length} дублирующихся строк`);
  };

  const removeEmptyLines = () => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    applyFormatting(lines.join('\n'));
    toast.success('Пустые строки удалены');
  };

  const trimWhitespace = () => {
    const formatted = text.split('\n').map(line => line.trim()).join('\n');
    applyFormatting(formatted);
    toast.success('Лишние пробелы удалены');
  };

  const addLineNumbers = () => {
    const lines = text.split('\n');
    const numbered = lines.map((line, index) => `${index + 1}: ${line}`);
    applyFormatting(numbered.join('\n'));
    toast.success('Номера строк добавлены');
  };

  const removeLineNumbers = () => {
    const lines = text.split('\n');
    const cleaned = lines.map(line => line.replace(/^\d+:\s*/, ''));
    applyFormatting(cleaned.join('\n'));
    toast.success('Номера строк удалены');
  };

  const reverseText = () => {
    applyFormatting(text.split('').reverse().join(''));
    toast.success('Текст перевёрнут');
  };

  const reverseLines = () => {
    const lines = text.split('\n');
    applyFormatting(lines.reverse().join('\n'));
    toast.success('Порядок строк изменён');
  };

  const addQuotes = () => {
    const lines = text.split('\n');
    const quoted = lines.map(line => line.trim() ? `"${line}"` : line);
    applyFormatting(quoted.join('\n'));
    toast.success('Кавычки добавлены');
  };

  const wrapWords = (length: number) => {
    const words = text.split(' ');
    let result = '';
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + word).length <= length) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) result += currentLine + '\n';
        currentLine = word;
      }
    });
    
    if (currentLine) result += currentLine;
    applyFormatting(result);
    toast.success(`Текст перенесён по ${length} символов`);
  };

  const specialChars = [
    { name: 'Bullet', char: '•' },
    { name: 'Arrow', char: '→' },
    { name: 'Check', char: '✓' },
    { name: 'Cross', char: '✗' },
    { name: 'Star', char: '★' },
    { name: 'Heart', char: '♥' },
    { name: 'Diamond', char: '♦' },
    { name: 'Spade', char: '♠' },
    { name: 'Club', char: '♣' },
    { name: 'Copyright', char: '©' },
    { name: 'Trademark', char: '™' },
    { name: 'Registered', char: '®' },
  ];

  const insertSpecialChar = (char: string) => {
    applyFormatting(text + char);
    toast.success(`Символ "${char}" добавлен`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Изменение регистра
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => formatCase('upper')}>
              ВЕРХНИЙ
            </Button>
            <Button variant="outline" onClick={() => formatCase('lower')}>
              нижний
            </Button>
            <Button variant="outline" onClick={() => formatCase('title')}>
              Заглавные
            </Button>
            <Button variant="outline" onClick={() => formatCase('sentence')}>
              Предложения
            </Button>
            <Button variant="outline" onClick={() => formatCase('toggle')}>
              иНВЕРСИЯ
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Списки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => createList('bullet')}>
              • Маркированный
            </Button>
            <Button variant="outline" onClick={() => createList('numbered')}>
              1. Нумерованный
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Сортировка и порядок
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">По возрастанию</SelectItem>
                <SelectItem value="desc">По убыванию</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={sortLines}>
              Сортировать строки
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={reverseText}>
              Перевернуть текст
            </Button>
            <Button variant="outline" onClick={reverseLines}>
              Перевернуть строки
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eraser className="h-5 w-5" />
            Очистка
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button variant="outline" onClick={removeDuplicates}>
              Удалить дубли
            </Button>
            <Button variant="outline" onClick={removeEmptyLines}>
              Удалить пустые строки
            </Button>
            <Button variant="outline" onClick={trimWhitespace}>
              Убрать пробелы
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Нумерация строк
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={addLineNumbers}>
              Добавить номера
            </Button>
            <Button variant="outline" onClick={removeLineNumbers}>
              Удалить номера
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5" />
            Форматирование
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button variant="outline" onClick={addQuotes}>
              Добавить кавычки
            </Button>
            <Button variant="outline" onClick={() => wrapWords(50)}>
              Перенос 50 символов
            </Button>
            <Button variant="outline" onClick={() => wrapWords(80)}>
              Перенос 80 символов
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Специальные символы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {specialChars.map((item) => (
              <Button
                key={item.name}
                variant="outline"
                size="sm"
                onClick={() => insertSpecialChar(item.char)}
                title={item.name}
              >
                {item.char}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}