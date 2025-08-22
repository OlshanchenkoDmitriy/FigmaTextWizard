import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Type, Hash, Zap, Layers, Eraser, Code, RotateCcw, Globe, Filter, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FormattingCatalogProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

export function FormattingCatalog({ text, setText, onTextChange }: FormattingCatalogProps) {
  const [customPattern, setCustomPattern] = useState('');
  const [customReplacement, setCustomReplacement] = useState('');

  const applyFormatting = (newText: string, message: string) => {
    setText(newText);
    onTextChange(newText);
    toast.success(message);
  };

  const confirmAction = (action: () => void, message: string) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Применить</Button>
        </AlertDialogTrigger>
        <AlertDialogContent style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#E8EAED' }}>Подтверждение</AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#9CA3AF' }}>
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={action} style={{ backgroundColor: '#3A6BF0', color: '#FFFFFF' }}>
              Применить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  // Case transformations
  const caseOperations = [
    {
      name: 'ВЕРХНИЙ РЕГИСТР',
      action: () => applyFormatting(text.toUpperCase(), 'Текст переведён в верхний регистр')
    },
    {
      name: 'нижний регистр',
      action: () => applyFormatting(text.toLowerCase(), 'Текст переведён в нижний регистр')
    },
    {
      name: 'Заглавные Буквы',
      action: () => applyFormatting(
        text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
        'Применён регистр заглавных букв'
      )
    },
    {
      name: 'Предложения.',
      action: () => applyFormatting(
        text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
        'Применён регистр предложений'
      )
    },
    {
      name: 'иНВЕРСИЯ рЕГИСТРА',
      action: () => applyFormatting(
        text.split('').map(char => char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()).join(''),
        'Применена инверсия регистра'
      )
    },
    {
      name: 'camelCase',
      action: () => applyFormatting(
        text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''),
        'Применён camelCase'
      )
    },
    {
      name: 'snake_case',
      action: () => applyFormatting(
        text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
        'Применён snake_case'
      )
    },
    {
      name: 'kebab-case',
      action: () => applyFormatting(
        text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        'Применён kebab-case'
      )
    }
  ];

  // Identifier operations
  const identifierOperations = [
    {
      name: 'Удалить пробелы',
      action: () => applyFormatting(text.replace(/\s/g, ''), 'Пробелы удалены')
    },
    {
      name: 'Заменить пробелы на _',
      action: () => applyFormatting(text.replace(/\s+/g, '_'), 'Пробелы заменены на подчёркивания')
    },
    {
      name: 'Только буквы и цифры',
      action: () => applyFormatting(text.replace(/[^a-zA-Zа-яёА-ЯЁ0-9]/g, ''), 'Оставлены только буквы и цифры')
    },
    {
      name: 'Валидный CSS класс',
      action: () => applyFormatting(
        text.toLowerCase().replace(/[^a-z0-9-_]/g, '').replace(/^[0-9]/, 'class-$&'),
        'Создан валидный CSS класс'
      )
    },
    {
      name: 'Валидная переменная JS',
      action: () => applyFormatting(
        text.replace(/[^a-zA-Z0-9_$]/g, '').replace(/^[0-9]/, '_$&'),
        'Создана валидная JS переменная'
      )
    }
  ];

  // Symbol operations
  const symbolOperations = [
    {
      name: 'Удалить спецсимволы',
      action: () => applyFormatting(text.replace(/[^\w\s]/g, ''), 'Специальные символы удалены')
    },
    {
      name: 'Только ASCII',
      action: () => applyFormatting(text.replace(/[^\x00-\x7F]/g, ''), 'Оставлены только ASCII символы')
    },
    {
      name: 'Заменить кавычки',
      action: () => applyFormatting(text.replace(/[""'']/g, '"'), 'Кавычки заменены на обычные')
    },
    {
      name: 'Удалить эмодзи',
      action: () => applyFormatting(
        text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, ''),
        'Эмодзи удалены'
      )
    },
    {
      name: 'Нормализовать пробелы',
      action: () => applyFormatting(text.replace(/\s+/g, ' '), 'Пробелы нормализованы')
    }
  ];

  // Structure operations
  const structureOperations = [
    {
      name: 'Удалить пустые строки',
      action: () => applyFormatting(
        text.split('\n').filter(line => line.trim() !== '').join('\n'),
        'Пустые строки удалены'
      )
    },
    {
      name: 'Добавить номера строк',
      action: () => applyFormatting(
        text.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n'),
        'Номера строк добавлены'
      )
    },
    {
      name: 'Отступы 2 пробела',
      action: () => applyFormatting(
        text.split('\n').map(line => line.trim() ? `  ${line}` : line).join('\n'),
        'Добавлены отступы'
      )
    },
    {
      name: 'Отступы табами',
      action: () => applyFormatting(
        text.split('\n').map(line => line.trim() ? `\t${line}` : line).join('\n'),
        'Добавлены отступы табами'
      )
    },
    {
      name: 'Перевернуть строки',
      action: () => applyFormatting(
        text.split('\n').reverse().join('\n'),
        'Порядок строк изменён'
      )
    },
    {
      name: 'Сортировать строки',
      action: () => applyFormatting(
        text.split('\n').sort().join('\n'),
        'Строки отсортированы'
      )
    }
  ];

  // Cleanup operations
  const cleanupOperations = [
    {
      name: 'Удалить дубликаты строк',
      action: () => {
        const lines = text.split('\n');
        const unique = [...new Set(lines)];
        applyFormatting(unique.join('\n'), `Удалено ${lines.length - unique.length} дубликатов`);
      }
    },
    {
      name: 'Обрезать строки',
      action: () => applyFormatting(
        text.split('\n').map(line => line.trim()).join('\n'),
        'Строки обрезаны'
      )
    },
    {
      name: 'Удалить повторы символов',
      action: () => applyFormatting(
        text.replace(/(.)\1{2,}/g, '$1'),
        'Повторяющиеся символы удалены'
      )
    },
    {
      name: 'Удалить HTML теги',
      action: () => applyFormatting(
        text.replace(/<[^>]*>/g, ''),
        'HTML теги удалены'
      )
    },
    {
      name: 'Очистить разметку',
      action: () => applyFormatting(
        text.replace(/[*_~`\[\]]/g, ''),
        'Разметка очищена'
      )
    }
  ];

  // Transform operations
  const transformOperations = [
    {
      name: 'Перевернуть текст',
      action: () => applyFormatting(text.split('').reverse().join(''), 'Текст перевёрнут')
    },
    {
      name: 'Перемешать слова',
      action: () => {
        const words = text.split(' ');
        for (let i = words.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [words[i], words[j]] = [words[j], words[i]];
        }
        applyFormatting(words.join(' '), 'Слова перемешаны');
      }
    },
    {
      name: 'Перемешать строки',
      action: () => {
        const lines = text.split('\n');
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        applyFormatting(lines.join('\n'), 'Строки перемешаны');
      }
    },
    {
      name: 'Дублировать строки',
      action: () => applyFormatting(
        text.split('\n').map(line => `${line}\n${line}`).join('\n'),
        'Строки дублированы'
      )
    }
  ];

  // Transliteration
  const transliterateRuToEn = () => {
    const ruToEn: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    let result = text.toLowerCase();
    Object.entries(ruToEn).forEach(([ru, en]) => {
      result = result.replace(new RegExp(ru, 'g'), en);
    });
    applyFormatting(result, 'Выполнена транслитерация RU → EN');
  };

  // Extract/Remove operations
  const extractNumbers = () => {
    const numbers = text.match(/\d+/g) || [];
    applyFormatting(numbers.join('\n'), 'Числа извлечены');
  };

  const extractEmails = () => {
    const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    applyFormatting(emails.join('\n'), 'Email адреса извлечены');
  };

  const extractUrls = () => {
    const urls = text.match(/https?:\/\/[^\s]+/g) || [];
    applyFormatting(urls.join('\n'), 'URL адреса извлечены');
  };

  // Insert operations
  const insertLineNumbers = () => {
    const lines = text.split('\n');
    applyFormatting(
      lines.map((line, index) => `${String(index + 1).padStart(3, '0')}: ${line}`).join('\n'),
      'Номера строк вставлены'
    );
  };

  const insertTimestamp = () => {
    const timestamp = new Date().toLocaleString();
    applyFormatting(`[${timestamp}]\n${text}`, 'Временная метка добавлена');
  };

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#E8EAED' }}>
            <Type className="h-5 w-5" />
            Каталог форматирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="case" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="case">Регистр</TabsTrigger>
              <TabsTrigger value="identifiers">ID</TabsTrigger>
              <TabsTrigger value="symbols">Символы</TabsTrigger>
              <TabsTrigger value="structure">Структура</TabsTrigger>
              <TabsTrigger value="cleanup">Очистка</TabsTrigger>
              <TabsTrigger value="transform">Трансформ</TabsTrigger>
              <TabsTrigger value="transliterate">Транслит</TabsTrigger>
              <TabsTrigger value="extract">Извлечь</TabsTrigger>
            </TabsList>

            <TabsContent value="case" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {caseOperations.map((op, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={op.action}
                    disabled={!text}
                    className="text-left justify-start"
                  >
                    {op.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="identifiers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {identifierOperations.map((op, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={op.action}
                    disabled={!text}
                    className="text-left justify-start"
                  >
                    {op.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="symbols" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {symbolOperations.map((op, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={op.action}
                    disabled={!text}
                    className="text-left justify-start"
                  >
                    {op.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {structureOperations.map((op, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={op.action}
                    disabled={!text}
                    className="text-left justify-start"
                  >
                    {op.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cleanup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {cleanupOperations.map((op, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={op.action}
                    disabled={!text}
                    className="text-left justify-start"
                  >
                    {op.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transform" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {transformOperations.map((op, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={op.action}
                    disabled={!text}
                    className="text-left justify-start"
                  >
                    {op.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transliterate" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={transliterateRuToEn}
                  disabled={!text}
                  className="text-left justify-start"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Русский → English
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="extract" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={extractNumbers}
                  disabled={!text}
                  className="text-left justify-start"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Извлечь числа
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={extractEmails}
                  disabled={!text}
                  className="text-left justify-start"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Извлечь Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={extractUrls}
                  disabled={!text}
                  className="text-left justify-start"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Извлечь URL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={insertLineNumbers}
                  disabled={!text}
                  className="text-left justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Вставить номера
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={insertTimestamp}
                  disabled={!text}
                  className="text-left justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Вставить время
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {!text && (
        <Card style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
          <CardContent className="text-center py-8">
            <Type className="h-12 w-12 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p style={{ color: '#9CA3AF' }}>
              Добавьте текст в редактор для использования функций форматирования
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}