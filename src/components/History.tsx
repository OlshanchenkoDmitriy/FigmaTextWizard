import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { History as HistoryIcon, RotateCcw, Trash2, Search } from 'lucide-react';
import { Input } from './ui/input';

interface HistoryEntry {
  text: string;
  timestamp: Date;
}

interface HistoryProps {
  history: HistoryEntry[];
  currentIndex: number;
  onSelectHistory: (index: number) => void;
}

export function History({ history, currentIndex, onSelectHistory }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(entry => 
    entry.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    
    return date.toLocaleDateString();
  };

  const getPreviewText = (text: string) => {
    const lines = text.split('\n');
    const firstLine = lines[0] || '';
    if (firstLine.length > 100) {
      return firstLine.substring(0, 100) + '...';
    }
    if (lines.length > 1) {
      return firstLine + '...';
    }
    return firstLine;
  };

  const getTextStats = (text: string) => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    return { chars, words, lines };
  };

  const clearHistory = () => {
    if (confirm('Вы уверены, что хотите очистить историю? Это действие нельзя отменить.')) {
      // This would need to be implemented in the parent component
      console.log('Clear history requested');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5" />
              История изменений ({history.length})
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-1" />
                Очистить
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск в истории..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <HistoryIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {history.length === 0 ? 'История изменений пуста' : 'Ничего не найдено'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((entry, index) => {
              const actualIndex = history.indexOf(entry);
              const isCurrentVersion = actualIndex === currentIndex;
              const stats = getTextStats(entry.text);
              
              return (
                <Card 
                  key={actualIndex} 
                  className={`transition-colors cursor-pointer hover:bg-muted/50 ${
                    isCurrentVersion ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => onSelectHistory(actualIndex)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Версия {actualIndex + 1}
                        </span>
                        {isCurrentVersion && (
                          <Badge variant="default" size="sm">
                            Текущая
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      {getPreviewText(entry.text) || 'Пустой текст'}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{stats.chars} символов</span>
                      <span>{stats.words} слов</span>
                      <span>{stats.lines} строк</span>
                    </div>
                    
                    {!isCurrentVersion && (
                      <div className="mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHistory(actualIndex);
                          }}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Восстановить
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Статистика истории</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{history.length}</div>
                <div className="text-sm text-muted-foreground">Всего версий</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{currentIndex + 1}</div>
                <div className="text-sm text-muted-foreground">Текущая версия</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {history.length > 0 ? formatTimestamp(history[history.length - 1].timestamp) : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Последнее изменение</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {Math.round(
                    history.reduce((acc, entry) => acc + entry.text.length, 0) / history.length
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Средний размер</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}