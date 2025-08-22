import React, { useState, useEffect } from 'react';
import { TextEditor } from './components/TextEditor';
import { SearchReplace } from './components/SearchReplace';
import { Statistics } from './components/Statistics';
import { NotesManager } from './components/NotesManager';
import { Settings } from './components/Settings';
import { History } from './components/History';
import { SunoEditor } from './components/SunoEditor';
import { FormattingCatalog } from './components/FormattingCatalog';
import { Lists } from './components/Lists';
import { Markdown } from './components/Markdown';
import { SpecialChars } from './components/SpecialChars';
import { RegExpMacros } from './components/RegExpMacros';
import { About } from './components/About';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from './components/ui/sidebar';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { FileText, Search, BarChart3, StickyNote, Settings as SettingsIcon, History as HistoryIcon, Music, Type, List, Hash, Zap, Info, WifiOff, Check, Menu, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [text, setText] = useState('');
  const [splitView, setSplitView] = useState(false);
  const [history, setHistory] = useState<Array<{text: string; timestamp: Date}>>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set viewport meta tag for Xiaomi Redmi Note 13 Pro
  useEffect(() => {
    // Create or update viewport meta tag
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    
    // Optimized viewport for Xiaomi Redmi Note 13 Pro (393x852)
    viewportMeta.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );

    // PWA meta tags for mobile installation
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    setMetaTag('theme-color', '#1E2430');

    // Prevent iOS bounce effect
    document.body.style.overscrollBehavior = 'none';
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Соединение восстановлено');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Нет соединения с интернетом');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      if (text.trim()) {
        try {
          localStorage.setItem('textWizard_autoSave', text);
          localStorage.setItem('textWizard_lastSave', new Date().toISOString());
          setLastSaveTime(new Date());
        } catch (error) {
          toast.error('Ошибка автосохранения');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [text, autoSaveEnabled]);

  // Load saved text on mount
  useEffect(() => {
    try {
      const savedText = localStorage.getItem('textWizard_autoSave');
      const savedTime = localStorage.getItem('textWizard_lastSave');
      
      if (savedText) {
        setText(savedText);
        addToHistory(savedText);
        
        if (savedTime) {
          setLastSaveTime(new Date(savedTime));
        }
      }
    } catch (error) {
      toast.error('Ошибка загрузки сохранённых данных');
    }
  }, []);

  // Always use dark theme
  useEffect(() => {
    document.documentElement.className = 'dark';
    document.body.style.backgroundColor = '#1E2430';
    document.body.style.color = '#E8EAED';
  }, []);

  // Close mobile sidebar when tab changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [activeTab, isMobile]);

  const addToHistory = (newText: string) => {
    const newEntry = { text: newText, timestamp: new Date() };
    setHistory(prev => {
      const updated = [...prev, newEntry];
      return updated.slice(-50); // Keep last 50 entries
    });
    setCurrentHistoryIndex(history.length);
  };

  const undo = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setText(history[newIndex].text);
    }
  };

  const redo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setText(history[newIndex].text);
    }
  };

  const transferToNotes = () => {
    if (!text.trim()) {
      toast.error('Нет текста для переноса');
      return;
    }

    try {
      const existingNotes = JSON.parse(localStorage.getItem('textWizard_notes') || '[]');
      const newNote = {
        id: Date.now().toString(),
        title: `Перенос из редактора ${new Date().toLocaleString()}`,
        content: text,
        tags: ['редактор'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      existingNotes.unshift(newNote);
      localStorage.setItem('textWizard_notes', JSON.stringify(existingNotes));
      toast.success('Текст перенесён в заметки');
    } catch (error) {
      toast.error('Ошибка переноса в заметки');
    }
  };

  const transferToSuno = () => {
    if (!text.trim()) {
      toast.error('Нет текста для переноса');
      return;
    }

    setActiveTab('suno');
    toast.success('Переключились в Suno Editor');
  };

  const menuItems = [
    { 
      id: 'editor', 
      label: 'Редактор', 
      icon: FileText,
      badge: text.length > 0 ? text.length.toString() : null
    },
    { id: 'search', label: 'Поиск/Замена', icon: Search },
    { id: 'format', label: 'Форматирование', icon: Type },
    { id: 'lists', label: 'Списки', icon: List },
    { id: 'markdown', label: 'Markdown', icon: Hash },
    { id: 'special', label: 'Спец. символы', icon: Zap },
    { id: 'regexp', label: 'RegExp Макросы', icon: Hash },
    { id: 'stats', label: 'Статистика', icon: BarChart3 },
    { id: 'notes', label: 'Заметки', icon: StickyNote },
    { id: 'suno', label: 'Suno Editor', icon: Music },
    { id: 'history', label: 'История', icon: HistoryIcon },
    { id: 'settings', label: 'Настройки', icon: SettingsIcon },
    { id: 'about', label: 'О программе', icon: Info }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen mobile-optimized" style={{ backgroundColor: '#1E2430' }}>
        {/* Mobile Sidebar Overlay */}
        {isMobile && isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${
          isMobile 
            ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
                isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'relative'
        }`}>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-between p-4">
                <h2 className="font-semibold" style={{ color: '#E8EAED' }}>Text Wizard</h2>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-400" />
                  )}
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      isActive={activeTab === item.id}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </div>

        <main className="flex-1 flex flex-col" style={{ backgroundColor: '#1E2430' }}>
          <div className="border-b p-3 md:p-4 flex items-center justify-between" style={{ 
            borderColor: '#374151', 
            backgroundColor: '#232B3A' 
          }}>
            <div className="flex items-center gap-2">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="h-8 w-8 p-0 md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-lg font-semibold" style={{ color: '#E8EAED' }}>
                {menuItems.find(item => item.id === activeTab)?.label}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {activeTab === 'editor' && !isMobile && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={transferToNotes}
                    disabled={!text.trim()}
                  >
                    → Заметки
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={transferToSuno}
                    disabled={!text.trim()}
                  >
                    → Suno
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSplitView(!splitView)}
                  >
                    {splitView ? 'Одиночный' : 'Разделённый'}
                  </Button>
                </>
              )}
              
              {/* Compact status for mobile */}
              <span className="flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                {autoSaveEnabled ? (
                  <>
                    <Check className="h-3 w-3 text-green-400" />
                    {isMobile ? 'Авто' : 'Автосохранение'}
                    {lastSaveTime && !isMobile && (
                      <span className="text-xs">
                        ({lastSaveTime.toLocaleTimeString()})
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs">Авто откл.</span>
                )}
              </span>
            </div>
          </div>

          {!isOnline && (
            <Alert className="mx-3 md:mx-4 mt-2" style={{ backgroundColor: '#2A3441', borderColor: '#374151' }}>
              <WifiOff className="h-4 w-4" />
              <AlertDescription style={{ color: '#E8EAED' }}>
                {isMobile ? 'Офлайн режим' : 'Работа в офлайн режиме. Все данные сохраняются локально.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Mobile action buttons for editor */}
          {activeTab === 'editor' && isMobile && (
            <div className="flex items-center gap-1 p-2 border-b" style={{ borderColor: '#374151' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={transferToNotes}
                disabled={!text.trim()}
                className="text-xs"
              >
                → Заметки
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={transferToSuno}
                disabled={!text.trim()}
                className="text-xs"
              >
                → Suno
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSplitView(!splitView)}
                className="text-xs"
              >
                {splitView ? 'Одиночный' : 'Разделённый'}
              </Button>
            </div>
          )}

          <div className="flex-1 p-3 md:p-4 overflow-auto" style={{ backgroundColor: '#1E2430' }}>
            {activeTab === 'editor' && (
              <TextEditor
                text={text}
                setText={setText}
                splitView={splitView && !isMobile} // Disable split view on mobile
                onUndo={undo}
                onRedo={redo}
                canUndo={currentHistoryIndex > 0}
                canRedo={currentHistoryIndex < history.length - 1}
                onTextChange={addToHistory}
                onTransferToNotes={transferToNotes}
                onTransferToSuno={transferToSuno}
              />
            )}
            {activeTab === 'search' && (
              <SearchReplace text={text} setText={setText} onTextChange={addToHistory} />
            )}
            {activeTab === 'format' && (
              <FormattingCatalog text={text} setText={setText} onTextChange={addToHistory} />
            )}
            {activeTab === 'lists' && (
              <Lists text={text} setText={setText} onTextChange={addToHistory} />
            )}
            {activeTab === 'markdown' && (
              <Markdown text={text} setText={setText} onTextChange={addToHistory} />
            )}
            {activeTab === 'special' && (
              <SpecialChars text={text} setText={setText} onTextChange={addToHistory} />
            )}
            {activeTab === 'regexp' && (
              <RegExpMacros text={text} setText={setText} onTextChange={addToHistory} />
            )}
            {activeTab === 'stats' && (
              <Statistics text={text} />
            )}
            {activeTab === 'notes' && (
              <NotesManager />
            )}
            {activeTab === 'suno' && (
              <SunoEditor text={text} setText={setText} onTextChange={addToHistory} />
            )}
            {activeTab === 'history' && (
              <History 
                history={history} 
                currentIndex={currentHistoryIndex}
                onSelectHistory={(index) => {
                  setCurrentHistoryIndex(index);
                  setText(history[index].text);
                }}
              />
            )}
            {activeTab === 'settings' && (
              <Settings autoSaveEnabled={autoSaveEnabled} setAutoSaveEnabled={setAutoSaveEnabled} />
            )}
            {activeTab === 'about' && (
              <About />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}