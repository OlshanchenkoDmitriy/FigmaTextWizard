import React from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Undo, Redo, Copy, Clipboard, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  splitView: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onTextChange: (text: string) => void;
  onTransferToNotes?: () => void;
  onTransferToSuno?: () => void;
}

export function TextEditor({ 
  text, 
  setText, 
  splitView, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  onTextChange,
  onTransferToNotes,
  onTransferToSuno
}: TextEditorProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Текст скопирован в буфер обмена');
    } catch (err) {
      toast.error('Ошибка копирования');
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const newText = text + clipboardText;
      setText(newText);
      onTextChange(newText);
      toast.success('Текст вставлен из буфера обмена');
    } catch (err) {
      toast.error('Ошибка вставки');
    }
  };

  const handleSave = () => {
    localStorage.setItem('textWizard_manualSave', text);
    localStorage.setItem('textWizard_lastManualSave', new Date().toISOString());
    toast.success('Текст сохранён');
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    // Debounce history updates
    const timeoutId = setTimeout(() => {
      onTextChange(newText);
    }, 1000);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo className="h-4 w-4 mr-1" />
          Отменить
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo className="h-4 w-4 mr-1" />
          Повторить
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4 mr-1" />
          Копировать
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePaste}
        >
          <Clipboard className="h-4 w-4 mr-1" />
          Вставить
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-1" />
          Сохранить
        </Button>
        
        {onTransferToNotes && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTransferToNotes}
            disabled={!text.trim()}
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            В заметки
          </Button>
        )}
        
        {onTransferToSuno && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTransferToSuno}
            disabled={!text.trim()}
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            В Suno
          </Button>
        )}
      </div>

      <div className={`flex-1 ${splitView ? 'grid grid-cols-2 gap-4' : ''}`}>
        <Card className="p-4 h-full">
          <div className="flex flex-col h-full">
            <div className="mb-2">
              <span className="text-sm font-medium">Редактор</span>
            </div>
            <Textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Начните печатать..."
              className="flex-1 resize-none min-h-96 font-mono"
              style={{ minHeight: '400px' }}
            />
          </div>
        </Card>

        {splitView && (
          <Card className="p-4 h-full">
            <div className="flex flex-col h-full">
              <div className="mb-2">
                <span className="text-sm font-medium">Предпросмотр</span>
              </div>
              <div className="flex-1 bg-muted p-4 rounded-md overflow-auto font-mono whitespace-pre-wrap">
                {text || 'Предпросмотр текста...'}
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Символов: {text.length} | Слов: {text.split(/\s+/).filter(word => word.length > 0).length} | Строк: {text.split('\n').length}
        </div>
        <div>
          Последнее автосохранение: {localStorage.getItem('textWizard_lastSave') ? 
            new Date(localStorage.getItem('textWizard_lastSave')!).toLocaleTimeString() : 'никогда'}
        </div>
      </div>
    </div>
  );
}