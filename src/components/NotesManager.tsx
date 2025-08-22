import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, Search, Download, Upload, Edit, Trash2, StickyNote } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function NotesManager() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('textWizard_notes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        const notesWithDates = parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('textWizard_notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createNote = () => {
    if (!noteTitle.trim()) {
      toast.error('Введите название заметки');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle.trim(),
      content: noteContent.trim(),
      tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes(prev => [newNote, ...prev]);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setIsAddingNote(false);
    toast.success('Заметка создана');
  };

  const updateNote = () => {
    if (!editingNote || !noteTitle.trim()) return;

    setNotes(prev => prev.map(note => 
      note.id === editingNote.id 
        ? {
            ...note,
            title: noteTitle.trim(),
            content: noteContent.trim(),
            tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date()
          }
        : note
    ));

    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    toast.success('Заметка обновлена');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.success('Заметка удалена');
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `text-wizard-notes-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Заметки экспортированы');
  };

  const importNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedNotes = JSON.parse(e.target?.result as string);
        const validNotes = importedNotes.map((note: any) => ({
          ...note,
          id: note.id || Date.now().toString() + Math.random(),
          createdAt: new Date(note.createdAt || Date.now()),
          updatedAt: new Date(note.updatedAt || Date.now())
        }));
        
        setNotes(prev => [...validNotes, ...prev]);
        toast.success(`Импортировано ${validNotes.length} заметок`);
      } catch (error) {
        toast.error('Ошибка импорта файла');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const getAllTags = () => {
    const allTags = notes.flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Заметки ({notes.length})
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={exportNotes} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Экспорт
              </Button>
              <label>
                <Button size="sm" variant="outline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-1" />
                  Импорт
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importNotes}
                  className="hidden"
                />
              </label>
              <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Новая заметка
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать заметку</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Название заметки"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Содержимое заметки"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={6}
                    />
                    <Input
                      placeholder="Теги (через запятую)"
                      value={noteTags}
                      onChange={(e) => setNoteTags(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                        Отмена
                      </Button>
                      <Button onClick={createNote}>
                        Создать
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск заметок..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {getAllTags().length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Теги:</div>
              <div className="flex flex-wrap gap-1">
                {getAllTags().map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {notes.length === 0 ? 'Пока нет заметок' : 'Заметки не найдены'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      Создано: {note.createdAt.toLocaleDateString()} {note.createdAt.toLocaleTimeString()}
                      {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                        <span className="ml-2">
                          • Изменено: {note.updatedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(note)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm mb-3">
                  {note.content}
                </div>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать заметку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Название заметки"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <Textarea
              placeholder="Содержимое заметки"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={6}
            />
            <Input
              placeholder="Теги (через запятую)"
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingNote(null)}>
                Отмена
              </Button>
              <Button onClick={updateNote}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}