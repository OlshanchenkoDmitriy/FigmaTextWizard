import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart3, Hash, Type, FileText, Clock } from 'lucide-react';

interface StatisticsProps {
  text: string;
}

export function Statistics({ text }: StatisticsProps) {
  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    
    // Character frequency
    const charFreq: Record<string, number> = {};
    for (const char of text.toLowerCase()) {
      if (char.match(/[a-zа-яё]/)) {
        charFreq[char] = (charFreq[char] || 0) + 1;
      }
    }
    
    // Word frequency
    const wordFreq: Record<string, number> = {};
    const words_array = text.toLowerCase().match(/\b\w+\b/g) || [];
    for (const word of words_array) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
    
    // Most common characters and words
    const topChars = Object.entries(charFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    // Reading time estimation (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    // Text complexity metrics
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    const avgCharsPerWord = words > 0 ? charsNoSpaces / words : 0;
    
    // Language detection (basic)
    const cyrillicChars = (text.match(/[а-яё]/gi) || []).length;
    const latinChars = (text.match(/[a-z]/gi) || []).length;
    const detectedLanguage = cyrillicChars > latinChars ? 'Русский' : 'Английский';
    
    return {
      chars,
      charsNoSpaces,
      words,
      lines,
      paragraphs,
      sentences,
      topChars,
      topWords,
      readingTime,
      avgWordsPerSentence,
      avgCharsPerWord,
      detectedLanguage,
      spaces: chars - charsNoSpaces,
      uniqueWords: Object.keys(wordFreq).length,
      uniqueChars: Object.keys(charFreq).length
    };
  }, [text]);

  const readabilityScore = useMemo(() => {
    // Simplified readability score based on sentence and word length
    if (stats.sentences === 0 || stats.words === 0) return 0;
    
    const score = 206.835 - (1.015 * stats.avgWordsPerSentence) - (84.6 * (stats.avgCharsPerWord / 4.7));
    return Math.max(0, Math.min(100, score));
  }, [stats]);

  const getReadabilityLevel = (score: number) => {
    if (score >= 90) return { level: 'Очень легко', color: 'bg-green-500' };
    if (score >= 80) return { level: 'Легко', color: 'bg-green-400' };
    if (score >= 70) return { level: 'Довольно легко', color: 'bg-yellow-400' };
    if (score >= 60) return { level: 'Стандартно', color: 'bg-yellow-500' };
    if (score >= 50) return { level: 'Довольно сложно', color: 'bg-orange-400' };
    if (score >= 30) return { level: 'Сложно', color: 'bg-red-400' };
    return { level: 'Очень сложно', color: 'bg-red-500' };
  };

  const readability = getReadabilityLevel(readabilityScore);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Основная статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.chars}</div>
              <div className="text-sm text-muted-foreground">Символов всего</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.charsNoSpaces}</div>
              <div className="text-sm text-muted-foreground">Без пробелов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.words}</div>
              <div className="text-sm text-muted-foreground">Слов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.lines}</div>
              <div className="text-sm text-muted-foreground">Строк</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Структура текста
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{stats.paragraphs}</div>
              <div className="text-sm text-muted-foreground">Абзацев</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{stats.sentences}</div>
              <div className="text-sm text-muted-foreground">Предложений</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{stats.spaces}</div>
              <div className="text-sm text-muted-foreground">Пробелов</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{stats.uniqueWords}</div>
              <div className="text-sm text-muted-foreground">Уникальных слов</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Анализ текста
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Время чтения</div>
              <div className="text-lg font-semibold">{stats.readingTime} мин</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Слов в предложении</div>
              <div className="text-lg font-semibold">{stats.avgWordsPerSentence.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Символов в слове</div>
              <div className="text-lg font-semibold">{stats.avgCharsPerWord.toFixed(1)}</div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Читаемость</span>
              <Badge variant="secondary">{readability.level}</Badge>
            </div>
            <Progress value={readabilityScore} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {readabilityScore.toFixed(0)} баллов из 100
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Определённый язык</div>
            <Badge variant="outline">{stats.detectedLanguage}</Badge>
          </div>
        </CardContent>
      </Card>

      {stats.topChars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Частота символов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topChars.slice(0, 5).map(([char, count]) => (
                <div key={char} className="flex items-center justify-between">
                  <span className="font-mono text-lg">"{char}"</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <Progress 
                      value={(count / stats.topChars[0][1]) * 100} 
                      className="flex-1 h-2" 
                    />
                    <span className="text-sm text-muted-foreground min-w-8">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.topWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Частота слов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topWords.slice(0, 10).map(([word, count]) => (
                <div key={word} className="flex items-center justify-between">
                  <span className="font-medium">{word}</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <Progress 
                      value={(count / stats.topWords[0][1]) * 100} 
                      className="flex-1 h-2" 
                    />
                    <span className="text-sm text-muted-foreground min-w-8">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}