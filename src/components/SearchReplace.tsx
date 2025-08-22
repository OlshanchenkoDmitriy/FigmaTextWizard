import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Search, Replace, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SearchReplaceProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

export function SearchReplace({ text, setText, onTextChange }: SearchReplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);

  const matches = useMemo(() => {
    if (!searchTerm) return [];
    
    try {
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(searchTerm, flags);
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            index: match.index,
            length: match[0].length,
            text: match[0]
          });
          if (!regex.global) break;
        }
        return matches;
      } else {
        const matches = [];
        const searchLower = caseSensitive ? searchTerm : searchTerm.toLowerCase();
        const textToSearch = caseSensitive ? text : text.toLowerCase();
        let index = 0;
        
        while ((index = textToSearch.indexOf(searchLower, index)) !== -1) {
          matches.push({
            index,
            length: searchTerm.length,
            text: text.substring(index, index + searchTerm.length)
          });
          index += searchTerm.length;
        }
        return matches;
      }
    } catch (error) {
      return [];
    }
  }, [searchTerm, text, useRegex, caseSensitive]);

  const highlightedText = useMemo(() => {
    if (!searchTerm || matches.length === 0) return text;
    
    let highlighted = '';
    let lastIndex = 0;
    
    matches.forEach((match, index) => {
      highlighted += text.substring(lastIndex, match.index);
      const isCurrentMatch = index === currentMatch;
      highlighted += `<mark class="${isCurrentMatch ? 'bg-yellow-400' : 'bg-yellow-200'}">${match.text}</mark>`;
      lastIndex = match.index + match.length;
    });
    highlighted += text.substring(lastIndex);
    
    return highlighted;
  }, [text, matches, currentMatch, searchTerm]);

  const handleReplace = () => {
    if (matches.length === 0) return;
    
    try {
      let newText = text;
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(searchTerm, flags);
        newText = text.replace(regex, replaceTerm);
      } else {
        const searchRegex = new RegExp(
          searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          caseSensitive ? 'g' : 'gi'
        );
        newText = text.replace(searchRegex, replaceTerm);
      }
      
      setText(newText);
      onTextChange(newText);
      toast.success(`Заменено ${matches.length} совпадений`);
    } catch (error) {
      toast.error('Ошибка при замене');
    }
  };

  const handleReplaceOne = () => {
    if (matches.length === 0 || currentMatch >= matches.length) return;
    
    const match = matches[currentMatch];
    const newText = text.substring(0, match.index) + 
                   replaceTerm + 
                   text.substring(match.index + match.length);
    
    setText(newText);
    onTextChange(newText);
    toast.success('Заменено 1 совпадение');
  };

  const navigateMatch = (direction: 'prev' | 'next') => {
    if (matches.length === 0) return;
    
    if (direction === 'prev') {
      setCurrentMatch(currentMatch > 0 ? currentMatch - 1 : matches.length - 1);
    } else {
      setCurrentMatch(currentMatch < matches.length - 1 ? currentMatch + 1 : 0);
    }
  };

  const presetRegexes = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?://[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?' },
    { name: 'Телефон', pattern: '\\+?[1-9]\\d{1,14}' },
    { name: 'Дата (DD.MM.YYYY)', pattern: '\\d{2}\\.\\d{2}\\.\\d{4}' },
    { name: 'Время (HH:MM)', pattern: '\\d{2}:\\d{2}' },
    { name: 'IP адрес', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Поиск и замена
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Поиск</label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Введите текст для поиска..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Замена</label>
              <Input
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="Введите текст для замены..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="regex"
                checked={useRegex}
                onCheckedChange={(checked) => setUseRegex(checked as boolean)}
              />
              <label htmlFor="regex" className="text-sm">Регулярные выражения</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="case"
                checked={caseSensitive}
                onCheckedChange={(checked) => setCaseSensitive(checked as boolean)}
              />
              <label htmlFor="case" className="text-sm">Учитывать регистр</label>
            </div>
          </div>

          {matches.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {currentMatch + 1} из {matches.length}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => navigateMatch('prev')}>
                ← Предыдущее
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigateMatch('next')}>
                Следующее →
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleReplaceOne} disabled={matches.length === 0}>
              <Replace className="h-4 w-4 mr-1" />
              Заменить одно
            </Button>
            <Button onClick={handleReplace} disabled={matches.length === 0} variant="destructive">
              <Replace className="h-4 w-4 mr-1" />
              Заменить все
            </Button>
          </div>
        </CardContent>
      </Card>

      {useRegex && (
        <Card>
          <CardHeader>
            <CardTitle>Готовые регулярные выражения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {presetRegexes.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm(preset.pattern)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Предпросмотр</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="bg-muted p-4 rounded-md max-h-64 overflow-auto font-mono text-sm whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </CardContent>
      </Card>
    </div>
  );
}