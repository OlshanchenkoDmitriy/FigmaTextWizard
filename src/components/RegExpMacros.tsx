import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Hash, Plus, Play, Save, Trash2, Edit, Copy, Download, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RegExpMacrosProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

interface RegExpMacro {
  id: string;
  name: string;
  pattern: string;
  replacement: string;
  flags: string;
  description: string;
  category: string;
  createdAt: Date;
}

export function RegExpMacros({ text, setText, onTextChange }: RegExpMacrosProps) {
  const [macros, setMacros] = useState<RegExpMacro[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingMacro, setEditingMacro] = useState<RegExpMacro | null>(null);
  const [macroName, setMacroName] = useState('');
  const [macroPattern, setMacroPattern] = useState('');
  const [macroReplacement, setMacroReplacement] = useState('');
  const [macroFlags, setMacroFlags] = useState('g');
  const [macroDescription, setMacroDescription] = useState('');
  const [macroCategory, setMacroCategory] = useState('custom');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState('');

  // Load macros from localStorage
  useEffect(() => {
    const savedMacros = localStorage.getItem('textWizard_regexpMacros');
    if (savedMacros) {
      try {
        const parsed = JSON.parse(savedMacros);
        const macrosWithDates = parsed.map((macro: any) => ({
          ...macro,
          createdAt: new Date(macro.createdAt)
        }));
        setMacros([...predefinedMacros, ...macrosWithDates]);
      } catch (error) {
        setMacros(predefinedMacros);
      }
    } else {
      setMacros(predefinedMacros);
    }
  }, []);

  // Save custom macros to localStorage
  const saveCustomMacros = (allMacros: RegExpMacro[]) => {
    const customMacros = allMacros.filter(macro => macro.category === 'custom');
    localStorage.setItem('textWizard_regexpMacros', JSON.stringify(customMacros));
  };

  const predefinedMacros: RegExpMacro[] = [
    {
      id: 'email-extract',
      name: 'Извлечь Email',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      replacement: '$&',
      flags: 'g',
      description: 'Находит все email адреса в тексте',
      category: 'extraction',
      createdAt: new Date()
    },
    {
      id: 'phone-extract',
      name: 'Извлечь телефоны',
      pattern: '\\+?[1-9]\\d{1,14}',
      replacement: '$&',
      flags: 'g',
      description: 'Находит телефонные номера',
      category: 'extraction',
      createdAt: new Date()
    },
    {
      id: 'url-extract',
      name: 'Извлечь URL',
      pattern: 'https?://[^\\s]+',
      replacement: '$&',
      flags: 'g',
      description: 'Находит HTTP и HTTPS ссылки',
      category: 'extraction',
      createdAt: new Date()
    },
    {
      id: 'remove-html',
      name: 'Удалить HTML теги',
      pattern: '<[^>]*>',
      replacement: '',
      flags: 'g',
      description: 'Удаляет все HTML теги из текста',
      category: 'cleanup',
      createdAt: new Date()
    },
    {
      id: 'normalize-spaces',
      name: 'Нормализовать пробелы',
      pattern: '\\s+',
      replacement: ' ',
      flags: 'g',
      description: 'Заменяет множественные пробелы на одиночные',
      category: 'cleanup',
      createdAt: new Date()
    },
    {
      id: 'remove-numbers',
      name: 'Удалить числа',
      pattern: '\\d+',
      replacement: '',
      flags: 'g',
      description: 'Удаляет все числа из текста',
      category: 'cleanup',
      createdAt: new Date()
    },
    {
      id: 'camelcase-to-kebab',
      name: 'camelCase → kebab-case',
      pattern: '([a-z])([A-Z])',
      replacement: '$1-$2',
      flags: 'g',
      description: 'Преобразует camelCase в kebab-case',
      category: 'transform',
      createdAt: new Date()
    },
    {
      id: 'snake-to-camel',
      name: 'snake_case → camelCase',
      pattern: '_([a-z])',
      replacement: (match: string, p1: string) => p1.toUpperCase(),
      flags: 'g',
      description: 'Преобразует snake_case в camelCase',
      category: 'transform',
      createdAt: new Date()
    },
    {
      id: 'extract-dates',
      name: 'Извлечь даты',
      pattern: '\\d{1,2}[./\\-]\\d{1,2}[./\\-]\\d{2,4}',
      replacement: '$&',
      flags: 'g',
      description: 'Находит даты в формате DD/MM/YYYY',
      category: 'extraction',
      createdAt: new Date()
    },
    {
      id: 'remove-extra-lines',
      name: 'Удалить лишние строки',
      pattern: '\\n{3,}',
      replacement: '\\n\\n',
      flags: 'g',
      description: 'Заменяет множественные переводы строк на двойные',
      category: 'cleanup',
      createdAt: new Date()
    }
  ];

  const applyMacro = (macro: RegExpMacro) => {
    if (!text.trim()) {
      toast.error('Нет текста для обработки');
      return;
    }

    try {
      const regex = new RegExp(macro.pattern, macro.flags);
      let result: string;

      if (typeof macro.replacement === 'function') {
        result = text.replace(regex, macro.replacement as any);
      } else {
        result = text.replace(regex, macro.replacement);
      }

      setText(result);
      onTextChange(result);
      toast.success(`Макрос "${macro.name}" применён`);
    } catch (error) {
      toast.error('Ошибка в регулярном выражении');
    }
  };

  const testMacro = () => {
    if (!macroPattern || !testInput) {
      toast.error('Введите паттерн и тестовый текст');
      return;
    }

    try {
      const regex = new RegExp(macroPattern, macroFlags);
      const result = testInput.replace(regex, macroReplacement);
      setTestResult(result);
      toast.success('Тест выполнен');
    } catch (error) {
      toast.error('Ошибка в регулярном выражении');
      setTestResult('Ошибка в паттерне');
    }
  };

  const saveMacro = () => {
    if (!macroName || !macroPattern) {
      toast.error('Введите название и паттерн макроса');
      return;
    }

    const newMacro: RegExpMacro = {
      id: editingMacro?.id || Date.now().toString(),
      name: macroName,
      pattern: macroPattern,
      replacement: macroReplacement,
      flags: macroFlags,
      description: macroDescription,
      category: macroCategory,
      createdAt: editingMacro?.createdAt || new Date()
    };

    let updatedMacros;
    if (editingMacro) {
      updatedMacros = macros.map(macro => macro.id === editingMacro.id ? newMacro : macro);
    } else {
      updatedMacros = [...macros, newMacro];
    }

    setMacros(updatedMacros);
    saveCustomMacros(updatedMacros);

    // Reset form
    setMacroName('');
    setMacroPattern('');
    setMacroReplacement('');
    setMacroFlags('g');
    setMacroDescription('');
    setMacroCategory('custom');
    setEditingMacro(null);
    setIsCreating(false);

    toast.success(editingMacro ? 'Макрос обновлён' : 'Макрос создан');
  };

  const deleteMacro = (id: string) => {
    const macro = macros.find(m => m.id === id);
    if (macro?.category !== 'custom') {
      toast.error('Нельзя удалить встроенный макрос');
      return;
    }

    const updatedMacros = macros.filter(macro => macro.id !== id);
    setMacros(updatedMacros);
    saveCustomMacros(updatedMacros);
    toast.success('Макрос удалён');
  };

  const editMacro = (macro: RegExpMacro) => {
    if (macro.category !== 'custom') {
      toast.error('Нельзя редактировать встроенный макрос');
      return;
    }

    setEditingMacro(macro);
    setMacroName(macro.name);
    setMacroPattern(macro.pattern);
    setMacroReplacement(macro.replacement as string);
    setMacroFlags(macro.flags);
    setMacroDescription(macro.description);
    setMacroCategory(macro.category);
    setIsCreating(true);
  };

  const copyMacro = async (macro: RegExpMacro) => {
    const macroText = `Название: ${macro.name}
Паттерн: ${macro.pattern}
Замена: ${macro.replacement}
Флаги: ${macro.flags}
Описание: ${macro.description}`;

    try {
      await navigator.clipboard.writeText(macroText);
      toast.success('Макрос скопирован');
    } catch (err) {
      toast.error('Ошибка копирования');
    }
  };

  const exportMacros = () => {
    const customMacros = macros.filter(macro => macro.category === 'custom');
    const data = JSON.stringify(customMacros, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regexp-macros-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Макросы экспортированы');
  };

  const importMacros = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedMacros = JSON.parse(e.target?.result as string);
        const validMacros = importedMacros.map((macro: any) => ({
          ...macro,
          id: macro.id || Date.now().toString() + Math.random(),
          createdAt: new Date(macro.createdAt || Date.now()),
          category: 'custom'
        }));

        const updatedMacros = [...macros, ...validMacros];
        setMacros(updatedMacros);
        saveCustomMacros(updatedMacros);
        toast.success(`Импортировано ${validMacros.length} макросов`);
      } catch (error) {
        toast.error('Ошибка импорта файла');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const categories = {
    extraction: 'Извлечение',
    cleanup: 'Очистка',
    transform: 'Преобразование',
    custom: 'Пользовательские'
  };

  const groupedMacros = macros.reduce((acc, macro) => {
    if (!acc[macro.category]) {
      acc[macro.category] = [];
    }
    acc[macro.category].push(macro);
    return acc;
  }, {} as Record<string, RegExpMacro[]>);

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between" style={{ color: '#E8EAED' }}>
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              RegExp Макросы ({macros.length})
            </div>
            <div className="flex items-center gap-2">
              <label>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-1" />
                  Импорт
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importMacros}
                  className="hidden"
                />
              </label>
              <Button size="sm" variant="outline" onClick={exportMacros}>
                <Download className="h-4 w-4 mr-1" />
                Экспорт
              </Button>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Создать макрос
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl" style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: '#E8EAED' }}>
                      {editingMacro ? 'Редактировать макрос' : 'Создать макрос'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#E8EAED' }}>
                          Название
                        </label>
                        <Input
                          value={macroName}
                          onChange={(e) => setMacroName(e.target.value)}
                          placeholder="Название макроса"
                          style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#E8EAED' }}>
                          Категория
                        </label>
                        <Select value={macroCategory} onValueChange={setMacroCategory}>
                          <SelectTrigger style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
                            <SelectItem value="custom" style={{ color: '#E8EAED' }}>Пользовательские</SelectItem>
                            <SelectItem value="extraction" style={{ color: '#E8EAED' }}>Извлечение</SelectItem>
                            <SelectItem value="cleanup" style={{ color: '#E8EAED' }}>Очистка</SelectItem>
                            <SelectItem value="transform" style={{ color: '#E8EAED' }}>Преобразование</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#E8EAED' }}>
                        Регулярное выражение
                      </label>
                      <Input
                        value={macroPattern}
                        onChange={(e) => setMacroPattern(e.target.value)}
                        placeholder="Паттерн регулярного выражения"
                        className="font-mono"
                        style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2" style={{ color: '#E8EAED' }}>
                          Замена
                        </label>
                        <Input
                          value={macroReplacement}
                          onChange={(e) => setMacroReplacement(e.target.value)}
                          placeholder="Строка замены (можно использовать $1, $2...)"
                          className="font-mono"
                          style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#E8EAED' }}>
                          Флаги
                        </label>
                        <Input
                          value={macroFlags}
                          onChange={(e) => setMacroFlags(e.target.value)}
                          placeholder="g, i, m..."
                          className="font-mono"
                          style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#E8EAED' }}>
                        Описание
                      </label>
                      <Textarea
                        value={macroDescription}
                        onChange={(e) => setMacroDescription(e.target.value)}
                        placeholder="Описание макроса"
                        rows={2}
                        style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: '#E8EAED' }}>
                        Тест макроса
                      </label>
                      <Input
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder="Тестовый текст"
                        style={{ backgroundColor: '#2A3441', borderColor: '#374151', color: '#E8EAED' }}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={testMacro}>
                          <Play className="h-4 w-4 mr-1" />
                          Тест
                        </Button>
                      </div>
                      {testResult && (
                        <div className="p-3 rounded-md" style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
                          <div className="text-sm" style={{ color: '#9CA3AF' }}>Результат:</div>
                          <div className="font-mono text-sm" style={{ color: '#E8EAED' }}>{testResult}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreating(false)}>
                        Отмена
                      </Button>
                      <Button onClick={saveMacro}>
                        <Save className="h-4 w-4 mr-1" />
                        {editingMacro ? 'Обновить' : 'Сохранить'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {Object.entries(groupedMacros).map(([category, categoryMacros]) => (
        <Card key={category} style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#E8EAED' }}>
              <Badge variant="secondary">{categoryMacros.length}</Badge>
              {categories[category as keyof typeof categories] || category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {categoryMacros.map((macro) => (
                <Card key={macro.id} style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium" style={{ color: '#E8EAED' }}>{macro.name}</h4>
                          {macro.category === 'custom' && (
                            <Badge variant="outline" size="sm">Пользовательский</Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2" style={{ color: '#9CA3AF' }}>{macro.description}</p>
                        <div className="font-mono text-xs space-y-1" style={{ color: '#9CA3AF' }}>
                          <div>Паттерн: <span style={{ color: '#E8EAED' }}>/{macro.pattern}/{macro.flags}</span></div>
                          <div>Замена: <span style={{ color: '#E8EAED' }}>{macro.replacement}</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          onClick={() => applyMacro(macro)}
                          disabled={!text}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Применить
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyMacro(macro)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {macro.category === 'custom' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => editMacro(macro)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent style={{ backgroundColor: '#232B3A', borderColor: '#374151' }}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle style={{ color: '#E8EAED' }}>Удалить макрос</AlertDialogTitle>
                                  <AlertDialogDescription style={{ color: '#9CA3AF' }}>
                                    Вы уверены, что хотите удалить макрос "{macro.name}"? Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMacro(macro.id)}>
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {!text && (
        <Card style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
          <CardContent className="text-center py-8">
            <Hash className="h-12 w-12 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p style={{ color: '#9CA3AF' }}>
              Добавьте текст в редактор для применения макросов
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}