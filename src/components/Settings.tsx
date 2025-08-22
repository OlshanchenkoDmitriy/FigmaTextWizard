import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Settings as SettingsIcon, Type, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  autoSaveEnabled?: boolean;
  setAutoSaveEnabled?: (enabled: boolean) => void;
}

export function Settings({ autoSaveEnabled = true, setAutoSaveEnabled }: SettingsProps) {
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('system');
  const [localAutoSave, setLocalAutoSave] = useState(autoSaveEnabled);
  const [autoSaveInterval, setAutoSaveInterval] = useState(5);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [spellCheck, setSpellCheck] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('textWizard_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setFontSize(settings.fontSize || 14);
        setFontFamily(settings.fontFamily || 'system');
        setLocalAutoSave(settings.autoSave !== false);
        setAutoSaveInterval(settings.autoSaveInterval || 5);
        setShowLineNumbers(settings.showLineNumbers || false);
        setWordWrap(settings.wordWrap !== false);
        setSpellCheck(settings.spellCheck !== false);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      fontSize,
      fontFamily,
      autoSave: localAutoSave,
      autoSaveInterval,
      showLineNumbers,
      wordWrap,
      spellCheck
    };
    
    localStorage.setItem('textWizard_settings', JSON.stringify(settings));
    
    // Apply font settings to CSS
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    
    // Update parent component's autoSave state if provided
    if (setAutoSaveEnabled) {
      setAutoSaveEnabled(localAutoSave);
    }
    
    toast.success('Настройки сохранены');
  };

  // Reset settings to default
  const resetSettings = () => {
    setFontSize(14);
    setFontFamily('system');
    setLocalAutoSave(true);
    setAutoSaveInterval(5);
    setShowLineNumbers(false);
    setWordWrap(true);
    setSpellCheck(true);
    
    localStorage.removeItem('textWizard_settings');
    document.documentElement.style.setProperty('--font-size', '14px');
    
    if (setAutoSaveEnabled) {
      setAutoSaveEnabled(true);
    }
    
    toast.success('Настройки сброшены');
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('textWizard_autoSave');
      localStorage.removeItem('textWizard_manualSave');
      localStorage.removeItem('textWizard_notes');
      localStorage.removeItem('textWizard_settings');
      localStorage.removeItem('textWizard_lastSave');
      localStorage.removeItem('textWizard_lastManualSave');
      localStorage.removeItem('textWizard_regexpMacros');
      
      toast.success('Все данные удалены');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = {
      autoSave: localStorage.getItem('textWizard_autoSave'),
      manualSave: localStorage.getItem('textWizard_manualSave'),
      notes: localStorage.getItem('textWizard_notes'),
      settings: localStorage.getItem('textWizard_settings'),
      regexpMacros: localStorage.getItem('textWizard_regexpMacros'),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `text-wizard-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Данные экспортированы');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (importedData.autoSave) localStorage.setItem('textWizard_autoSave', importedData.autoSave);
        if (importedData.manualSave) localStorage.setItem('textWizard_manualSave', importedData.manualSave);
        if (importedData.notes) localStorage.setItem('textWizard_notes', importedData.notes);
        if (importedData.settings) localStorage.setItem('textWizard_settings', importedData.settings);
        if (importedData.regexpMacros) localStorage.setItem('textWizard_regexpMacros', importedData.regexpMacros);
        
        toast.success('Данные импортированы. Перезагрузите страницу.');
      } catch (error) {
        toast.error('Ошибка импорта файла');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const fontOptions = [
    { value: 'system', label: 'Системный шрифт' },
    { value: 'serif', label: 'Serif' },
    { value: 'sans-serif', label: 'Sans-serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Courier New', label: 'Courier New' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <SettingsIcon className="h-5 w-5" />
            Основные настройки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save" className="text-card-foreground">Автосохранение</Label>
            <Switch
              id="auto-save"
              checked={localAutoSave}
              onCheckedChange={setLocalAutoSave}
            />
          </div>

          {localAutoSave && (
            <div className="space-y-2">
              <Label className="text-card-foreground">Интервал автосохранения: {autoSaveInterval} сек</Label>
              <Slider
                value={[autoSaveInterval]}
                onValueChange={([value]) => setAutoSaveInterval(value)}
                min={1}
                max={60}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Type className="h-5 w-5" />
            Настройки шрифта
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-card-foreground">Семейство шрифтов</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {fontOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-popover-foreground hover:bg-accent">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground">Размер шрифта: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => setFontSize(value)}
              min={10}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          <div className="p-4 bg-muted rounded-md border border-border" style={{
            fontFamily: fontFamily === 'system' ? 'system-ui' : fontFamily,
            fontSize: `${fontSize}px`,
            color: 'var(--muted-foreground)'
          }}>
            Пример текста с выбранными настройками шрифта. 
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Настройки редактора</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="line-numbers" className="text-card-foreground">Показывать номера строк</Label>
            <Switch
              id="line-numbers"
              checked={showLineNumbers}
              onCheckedChange={setShowLineNumbers}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="word-wrap" className="text-card-foreground">Перенос слов</Label>
            <Switch
              id="word-wrap"
              checked={wordWrap}
              onCheckedChange={setWordWrap}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="spell-check" className="text-card-foreground">Проверка орфографии</Label>
            <Switch
              id="spell-check"
              checked={spellCheck}
              onCheckedChange={setSpellCheck}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Управление данными</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveSettings} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4 mr-1" />
              Сохранить настройки
            </Button>
            <Button variant="outline" onClick={resetSettings} className="border-border text-card-foreground hover:bg-accent">
              <RotateCcw className="h-4 w-4 mr-1" />
              Сбросить настройки
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData} className="border-border text-card-foreground hover:bg-accent">
              Экспортировать данные
            </Button>
            <label>
              <Button variant="outline" className="cursor-pointer border-border text-card-foreground hover:bg-accent">
                Импортировать данные
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>

          <Button variant="destructive" onClick={clearAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Удалить все данные
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Информация о приложении</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-card-foreground">Text Wizard</strong> - продвинутый офлайн-редактор текста</p>
            <p>Версия: 1.0.0</p>
            <p>Оптимизировано для Xiaomi Redmi Note 13 Pro</p>
            <p>Все данные хранятся локально в браузере</p>
            <p>Тёмная тема с акцентом <span className="text-primary font-semibold">#3A6BF0</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}