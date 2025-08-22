import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Hash, Bold, Italic, Link, Image, Code, List, Quote, Table } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MarkdownProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

export function Markdown({ text, setText, onTextChange }: MarkdownProps) {
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const applyMarkdown = (newText: string, message: string) => {
    setText(newText);
    onTextChange(newText);
    toast.success(message);
  };

  const insertMarkdown = (before: string, after: string = '', placeholder: string = 'текст') => {
    const selection = window.getSelection()?.toString() || placeholder;
    const markdown = `${before}${selection}${after}`;
    
    if (text) {
      applyMarkdown(text + '\n' + markdown, 'Markdown добавлен');
    } else {
      applyMarkdown(markdown, 'Markdown добавлен');
    }
  };

  const wrapSelection = (before: string, after: string) => {
    const lines = text.split('\n');
    const wrapped = lines.map(line => line.trim() ? `${before}${line}${after}` : line);
    applyMarkdown(wrapped.join('\n'), 'Markdown применён к тексту');
  };

  const createHeaders = () => {
    if (!text.trim()) {
      toast.error('Нет текста для форматирования');
      return;
    }

    const lines = text.split('\n');
    const headers = lines.map((line, index) => {
      if (line.trim()) {
        const level = Math.min((index % 6) + 1, 6);
        return `${'#'.repeat(level)} ${line.trim()}`;
      }
      return line;
    });
    
    applyMarkdown(headers.join('\n'), 'Заголовки созданы');
  };

  const createTable = () => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      toast.error('Нужно минимум 2 строки для создания таблицы');
      return;
    }

    const header = `| ${lines[0].split(/\s+/).join(' | ')} |`;
    const separator = `| ${lines[0].split(/\s+/).map(() => '---').join(' | ')} |`;
    const rows = lines.slice(1).map(line => `| ${line.split(/\s+/).join(' | ')} |`);
    
    const table = [header, separator, ...rows].join('\n');
    applyMarkdown(table, 'Таблица создана');
  };

  const createCodeBlock = (language: string = '') => {
    if (!text.trim()) {
      insertMarkdown(`\`\`\`${language}\n`, '\n```', 'код здесь');
      return;
    }

    const codeBlock = `\`\`\`${language}\n${text}\n\`\`\``;
    applyMarkdown(codeBlock, 'Блок кода создан');
  };

  const createList = (ordered: boolean = false) => {
    if (!text.trim()) {
      toast.error('Нет текста для создания списка');
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const listItems = lines.map((line, index) => {
      const prefix = ordered ? `${index + 1}. ` : '- ';
      return `${prefix}${line.trim()}`;
    });
    
    applyMarkdown(listItems.join('\n'), `${ordered ? 'Нумерованный' : 'Маркированный'} список создан`);
  };

  const createQuote = () => {
    if (!text.trim()) {
      insertMarkdown('> ', '', 'цитата');
      return;
    }

    const lines = text.split('\n');
    const quoted = lines.map(line => line.trim() ? `> ${line}` : '>');
    applyMarkdown(quoted.join('\n'), 'Цитата создана');
  };

  const insertLink = () => {
    if (!linkText || !linkUrl) {
      toast.error('Введите текст и URL ссылки');
      return;
    }

    const link = `[${linkText}](${linkUrl})`;
    if (text) {
      applyMarkdown(text + '\n' + link, 'Ссылка добавлена');
    } else {
      applyMarkdown(link, 'Ссылка добавлена');
    }
    
    setLinkText('');
    setLinkUrl('');
  };

  const insertImage = () => {
    if (!imageAlt || !imageUrl) {
      toast.error('Введите описание и URL изображения');
      return;
    }

    const image = `![${imageAlt}](${imageUrl})`;
    if (text) {
      applyMarkdown(text + '\n' + image, 'Изображение добавлено');
    } else {
      applyMarkdown(image, 'Изображение добавлено');
    }
    
    setImageAlt('');
    setImageUrl('');
  };

  const removeMarkdown = () => {
    if (!text.trim()) {
      toast.error('Нет текста для обработки');
      return;
    }

    let cleaned = text
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold and italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove quotes
      .replace(/^>\s*/gm, '')
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Remove horizontal rules
      .replace(/^---+$/gm, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n');

    applyMarkdown(cleaned, 'Markdown разметка удалена');
  };

  const markdownPresets = [
    {
      name: 'README шаблон',
      content: `# Название проекта

## Описание
Краткое описание проекта.

## Установка
\`\`\`bash
npm install
\`\`\`

## Использование
\`\`\`javascript
const example = require('./example');
\`\`\`

## Лицензия
MIT`
    },
    {
      name: 'Документация API',
      content: `# API Документация

## Обзор
Описание API.

### Аутентификация
\`\`\`
Authorization: Bearer <token>
\`\`\`

### Endpoints

#### GET /api/users
Получить список пользователей.

**Параметры:**
- \`limit\` (число) - количество записей
- \`offset\` (число) - смещение

**Ответ:**
\`\`\`json
{
  "users": [],
  "total": 0
}
\`\`\``
    },
    {
      name: 'Заметка',
      content: `# Заметка от ${new Date().toLocaleDateString()}

## Основные пункты
- Пункт 1
- Пункт 2
- Пункт 3

## Задачи
- [ ] Задача 1
- [ ] Задача 2
- [x] Выполненная задача

## Важно
> Важная информация или цитата

## Ресурсы
- [Ссылка 1](https://example.com)
- [Ссылка 2](https://example.com)`
    }
  ];

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#E8EAED' }}>
            <Hash className="h-5 w-5" />
            Markdown редактор
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="formatting" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="formatting">Форматирование</TabsTrigger>
              <TabsTrigger value="structure">Структура</TabsTrigger>
              <TabsTrigger value="media">Медиа</TabsTrigger>
              <TabsTrigger value="presets">Шаблоны</TabsTrigger>
            </TabsList>

            <TabsContent value="formatting" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" onClick={() => insertMarkdown('**', '**', 'жирный текст')}>
                  <Bold className="h-4 w-4 mr-1" />
                  Жирный
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('*', '*', 'курсив')}>
                  <Italic className="h-4 w-4 mr-1" />
                  Курсив
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('`', '`', 'код')}>
                  <Code className="h-4 w-4 mr-1" />
                  Код
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('~~', '~~', 'зачёркнутый')}>
                  Зачёркнутый
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                <Button variant="outline" onClick={() => insertMarkdown('# ', '', 'заголовок')}>
                  H1
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('## ', '', 'заголовок')}>
                  H2
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('### ', '', 'заголовок')}>
                  H3
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('#### ', '', 'заголовок')}>
                  H4
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('##### ', '', 'заголовок')}>
                  H5
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('###### ', '', 'заголовок')}>
                  H6
                </Button>
              </div>

              <Button variant="outline" onClick={createHeaders} disabled={!text}>
                Преобразовать строки в заголовки
              </Button>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => createList(false)} disabled={!text}>
                  <List className="h-4 w-4 mr-1" />
                  Маркированный список
                </Button>
                <Button variant="outline" onClick={() => createList(true)} disabled={!text}>
                  <Hash className="h-4 w-4 mr-1" />
                  Нумерованный список
                </Button>
                <Button variant="outline" onClick={createQuote} disabled={!text}>
                  <Quote className="h-4 w-4 mr-1" />
                  Цитата
                </Button>
                <Button variant="outline" onClick={createTable} disabled={!text}>
                  <Table className="h-4 w-4 mr-1" />
                  Таблица
                </Button>
                <Button variant="outline" onClick={() => createCodeBlock()}>
                  <Code className="h-4 w-4 mr-1" />
                  Блок кода
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('\n---\n')}>
                  Разделитель
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => insertMarkdown('- [ ] ', '', 'задача')}>
                  Чекбокс пустой
                </Button>
                <Button variant="outline" onClick={() => insertMarkdown('- [x] ', '', 'выполнено')}>
                  Чекбокс отмеченный
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#E8EAED' }}>Ссылка</label>
                    <Input
                      placeholder="Текст ссылки"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                    />
                    <Input
                      placeholder="URL"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                    />
                    <Button onClick={insertLink}>
                      <Link className="h-4 w-4 mr-1" />
                      Добавить ссылку
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#E8EAED' }}>Изображение</label>
                    <Input
                      placeholder="Описание изображения"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                    />
                    <Input
                      placeholder="URL изображения"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                    />
                    <Button onClick={insertImage}>
                      <Image className="h-4 w-4 mr-1" />
                      Добавить изображение
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {markdownPresets.map((preset, index) => (
                  <Card key={index} style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base" style={{ color: '#E8EAED' }}>
                        {preset.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyMarkdown(preset.content, `Шаблон "${preset.name}" применён`)}
                      >
                        Использовать шаблон
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: '#374151' }}>
            <Button variant="destructive" onClick={removeMarkdown} disabled={!text}>
              Удалить разметку Markdown
            </Button>
          </div>
        </CardContent>
      </Card>

      {!text && (
        <Card style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
          <CardContent className="text-center py-8">
            <Hash className="h-12 w-12 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p style={{ color: '#9CA3AF' }}>
              Создайте или загрузите текст для работы с Markdown
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}