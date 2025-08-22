import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Music, Plus, Download, Copy, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SunoEditorProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

interface SongSection {
  id: string;
  type: string;
  content: string;
  label?: string;
}

interface SongMetadata {
  title: string;
  artist: string;
  genre: string;
  key: string;
  bpm: string;
  tags: string[];
}

export function SunoEditor({ text, setText, onTextChange }: SunoEditorProps) {
  const [songSections, setSongSections] = useState<SongSection[]>([]);
  const [metadata, setMetadata] = useState<SongMetadata>({
    title: '',
    artist: '',
    genre: '',
    key: 'C',
    bpm: '120',
    tags: []
  });
  const [newSectionType, setNewSectionType] = useState('verse');
  const [tagInput, setTagInput] = useState('');

  // Parse existing text into song structure
  useEffect(() => {
    if (text.trim()) {
      parseSongText(text);
    }
  }, []);

  const sectionTypes = [
    { value: 'verse', label: 'Куплет' },
    { value: 'chorus', label: 'Припев' },
    { value: 'bridge', label: 'Бридж' },
    { value: 'pre-chorus', label: 'Пре-припев' },
    { value: 'outro', label: 'Концовка' },
    { value: 'intro', label: 'Вступление' },
    { value: 'instrumental', label: 'Инструментал' },
    { value: 'breakdown', label: 'Брейкдаун' },
    { value: 'hook', label: 'Хук' }
  ];

  const musicalKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const genres = [
    'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Folk', 'Jazz', 'Country', 
    'R&B', 'Reggae', 'Blues', 'Funk', 'Punk', 'Metal', 'Indie', 'Alternative'
  ];

  const commonTags = [
    'love', 'heartbreak', 'party', 'summer', 'nostalgia', 'friendship', 
    'motivation', 'sadness', 'happiness', 'freedom', 'dreams', 'youth',
    'family', 'hope', 'rebellion', 'peace', 'energy', 'romance'
  ];

  const parseSongText = (songText: string) => {
    const lines = songText.split('\n');
    const sections: SongSection[] = [];
    let currentSection: SongSection | null = null;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for section headers like [Verse 1], [Chorus], etc.
      const sectionMatch = trimmedLine.match(/^\[([^\]]+)\]$/);
      if (sectionMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const sectionLabel = sectionMatch[1].toLowerCase();
        const sectionType = sectionTypes.find(type => 
          sectionLabel.includes(type.value)
        )?.value || 'verse';
        
        currentSection = {
          id: Date.now().toString() + index,
          type: sectionType,
          content: '',
          label: sectionMatch[1]
        };
      } else if (currentSection && trimmedLine) {
        currentSection.content += (currentSection.content ? '\n' : '') + line;
      } else if (!currentSection && trimmedLine) {
        // If no section header found, treat as verse
        currentSection = {
          id: Date.now().toString() + index,
          type: 'verse',
          content: line,
          label: 'Verse'
        };
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    setSongSections(sections);
  };

  const addSection = () => {
    const newSection: SongSection = {
      id: Date.now().toString(),
      type: newSectionType,
      content: '',
      label: sectionTypes.find(type => type.value === newSectionType)?.label || 'Verse'
    };
    setSongSections([...songSections, newSection]);
  };

  const updateSection = (id: string, content: string) => {
    setSongSections(prev => prev.map(section => 
      section.id === id ? { ...section, content } : section
    ));
  };

  const deleteSection = (id: string) => {
    setSongSections(prev => prev.filter(section => section.id !== id));
  };

  const generateSongText = () => {
    let songText = '';
    
    // Add metadata as comments
    if (metadata.title) songText += `# ${metadata.title}\n`;
    if (metadata.artist) songText += `# Artist: ${metadata.artist}\n`;
    if (metadata.genre) songText += `# Genre: ${metadata.genre}\n`;
    if (metadata.key) songText += `# Key: ${metadata.key}\n`;
    if (metadata.bpm) songText += `# BPM: ${metadata.bpm}\n`;
    if (metadata.tags.length > 0) songText += `# Tags: ${metadata.tags.join(', ')}\n`;
    if (songText) songText += '\n';

    // Add sections
    songSections.forEach((section, index) => {
      songText += `[${section.label}]\n`;
      songText += section.content;
      if (index < songSections.length - 1) songText += '\n\n';
    });

    return songText;
  };

  const applySongToText = () => {
    const songText = generateSongText();
    setText(songText);
    onTextChange(songText);
    toast.success('Песня применена к основному тексту');
  };

  const exportSong = (format: 'txt' | 'json') => {
    const songText = generateSongText();
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'txt') {
      content = songText;
      filename = `${metadata.title || 'song'}.txt`;
      mimeType = 'text/plain';
    } else {
      const songData = {
        metadata,
        sections: songSections,
        generatedText: songText,
        exportDate: new Date().toISOString()
      };
      content = JSON.stringify(songData, null, 2);
      filename = `${metadata.title || 'song'}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Песня экспортирована как ${format.toUpperCase()}`);
  };

  const addTag = (tag: string) => {
    if (tag && !metadata.tags.includes(tag)) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Suno Editor - Структура песни
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Название песни"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Исполнитель</label>
              <Input
                value={metadata.artist}
                onChange={(e) => setMetadata(prev => ({ ...prev, artist: e.target.value }))}
                placeholder="Имя исполнителя"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Жанр</label>
              <Select value={metadata.genre} onValueChange={(value) => setMetadata(prev => ({ ...prev, genre: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите жанр" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Тональность</label>
                <Select value={metadata.key} onValueChange={(value) => setMetadata(prev => ({ ...prev, key: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {musicalKeys.map(key => (
                      <SelectItem key={key} value={key}>{key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">BPM</label>
                <Input
                  type="number"
                  value={metadata.bpm}
                  onChange={(e) => setMetadata(prev => ({ ...prev, bpm: e.target.value }))}
                  placeholder="120"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Теги</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {metadata.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Добавить тег"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(tagInput);
                    setTagInput('');
                  }
                }}
              />
              <Button onClick={() => { addTag(tagInput); setTagInput(''); }}>
                Добавить
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {commonTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Секции песни</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Select value={newSectionType} onValueChange={setNewSectionType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addSection}>
              <Plus className="h-4 w-4 mr-1" />
              Добавить секцию
            </Button>
          </div>

          <div className="space-y-4">
            {songSections.map((section, index) => (
              <Card key={section.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {section.label} {index + 1}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    placeholder={`Введите текст для ${section.label.toLowerCase()}...`}
                    rows={4}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {songSections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-4" />
              <p>Добавьте секции для начала работы с песней</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={applySongToText}>
              <Copy className="h-4 w-4 mr-1" />
              Применить к тексту
            </Button>
            <Button variant="outline" onClick={() => exportSong('txt')}>
              <Download className="h-4 w-4 mr-1" />
              Экспорт TXT
            </Button>
            <Button variant="outline" onClick={() => exportSong('json')}>
              <Download className="h-4 w-4 mr-1" />
              Экспорт JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      {songSections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Предпросмотр песни</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md max-h-64 overflow-auto whitespace-pre-wrap font-mono text-sm">
              {generateSongText()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}