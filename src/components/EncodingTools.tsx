import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Code, Lock, Unlock, RotateCcw, Hash } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EncodingToolsProps {
  text: string;
  setText: (text: string) => void;
  onTextChange: (text: string) => void;
}

export function EncodingTools({ text, setText, onTextChange }: EncodingToolsProps) {
  const [encodedResult, setEncodedResult] = useState('');

  const applyResult = (result: string) => {
    setText(result);
    onTextChange(result);
  };

  // Base64 encoding/decoding
  const encodeBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setEncodedResult(encoded);
      toast.success('Текст закодирован в Base64');
    } catch (error) {
      toast.error('Ошибка кодирования Base64');
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(text)));
      setEncodedResult(decoded);
      toast.success('Base64 декодирован');
    } catch (error) {
      toast.error('Ошибка декодирования Base64');
    }
  };

  // ROT13 encoding
  const rot13 = () => {
    const result = text.replace(/[a-zA-Z]/g, function(c) {
      return String.fromCharCode(
        (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
      );
    });
    setEncodedResult(result);
    toast.success('ROT13 применён');
  };

  // URL encoding/decoding
  const encodeURL = () => {
    try {
      const encoded = encodeURIComponent(text);
      setEncodedResult(encoded);
      toast.success('URL закодирован');
    } catch (error) {
      toast.error('Ошибка кодирования URL');
    }
  };

  const decodeURL = () => {
    try {
      const decoded = decodeURIComponent(text);
      setEncodedResult(decoded);
      toast.success('URL декодирован');
    } catch (error) {
      toast.error('Ошибка декодирования URL');
    }
  };

  // HTML encoding/decoding
  const encodeHTML = () => {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    
    const encoded = text.replace(/[&<>"'\/]/g, (s) => htmlEntities[s]);
    setEncodedResult(encoded);
    toast.success('HTML закодирован');
  };

  const decodeHTML = () => {
    const htmlEntities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/'
    };
    
    let decoded = text;
    Object.entries(htmlEntities).forEach(([entity, char]) => {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    });
    setEncodedResult(decoded);
    toast.success('HTML декодирован');
  };

  // JSON escape/unescape
  const escapeJSON = () => {
    try {
      const escaped = JSON.stringify(text);
      setEncodedResult(escaped.slice(1, -1)); // Remove surrounding quotes
      toast.success('JSON экранирован');
    } catch (error) {
      toast.error('Ошибка экранирования JSON');
    }
  };

  const unescapeJSON = () => {
    try {
      const unescaped = JSON.parse(`"${text}"`);
      setEncodedResult(unescaped);
      toast.success('JSON деэкранирован');
    } catch (error) {
      toast.error('Ошибка деэкранирования JSON');
    }
  };

  // Binary conversion
  const textToBinary = () => {
    const binary = text.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
    setEncodedResult(binary);
    toast.success('Конвертировано в двоичный код');
  };

  const binaryToText = () => {
    try {
      const binary = text.replace(/\s/g, '');
      let result = '';
      for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.substr(i, 8);
        if (byte.length === 8) {
          result += String.fromCharCode(parseInt(byte, 2));
        }
      }
      setEncodedResult(result);
      toast.success('Двоичный код конвертирован в текст');
    } catch (error) {
      toast.error('Ошибка конвертации двоичного кода');
    }
  };

  // Hex conversion
  const textToHex = () => {
    const hex = text.split('').map(char => 
      char.charCodeAt(0).toString(16).padStart(2, '0')
    ).join(' ');
    setEncodedResult(hex);
    toast.success('Конвертировано в шестнадцатеричный код');
  };

  const hexToText = () => {
    try {
      const hex = text.replace(/\s/g, '');
      let result = '';
      for (let i = 0; i < hex.length; i += 2) {
        const hexByte = hex.substr(i, 2);
        if (hexByte.length === 2) {
          result += String.fromCharCode(parseInt(hexByte, 16));
        }
      }
      setEncodedResult(result);
      toast.success('Шестнадцатеричный код конвертирован в текст');
    } catch (error) {
      toast.error('Ошибка конвертации шестнадцатеричного кода');
    }
  };

  // Caesar cipher
  const caesarCipher = (shift: number) => {
    const result = text.replace(/[a-zA-Z]/g, function(c) {
      const start = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - start + shift) % 26) + start);
    });
    setEncodedResult(result);
    toast.success(`Шифр Цезаря применён (сдвиг ${shift})`);
  };

  // Morse code
  const morseCode: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/'
  };

  const textToMorse = () => {
    const morse = text.toUpperCase().split('').map(char => 
      morseCode[char] || char
    ).join(' ');
    setEncodedResult(morse);
    toast.success('Конвертировано в азбуку Морзе');
  };

  const morseToText = () => {
    const reverseMorse = Object.fromEntries(
      Object.entries(morseCode).map(([k, v]) => [v, k])
    );
    const result = text.split(' ').map(code => 
      reverseMorse[code] || code
    ).join('');
    setEncodedResult(result);
    toast.success('Азбука Морзе конвертирована в текст');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Инструменты кодирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="base64" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="base64">Base64</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="other">Другие</TabsTrigger>
            </TabsList>

            <TabsContent value="base64" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={encodeBase64}>
                  <Lock className="h-4 w-4 mr-1" />
                  Кодировать
                </Button>
                <Button onClick={decodeBase64}>
                  <Unlock className="h-4 w-4 mr-1" />
                  Декодировать
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={encodeURL}>
                  <Lock className="h-4 w-4 mr-1" />
                  URL Encode
                </Button>
                <Button onClick={decodeURL}>
                  <Unlock className="h-4 w-4 mr-1" />
                  URL Decode
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={encodeHTML}>
                  <Lock className="h-4 w-4 mr-1" />
                  HTML Escape
                </Button>
                <Button onClick={decodeHTML}>
                  <Unlock className="h-4 w-4 mr-1" />
                  HTML Unescape
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={escapeJSON}>
                  <Lock className="h-4 w-4 mr-1" />
                  JSON Escape
                </Button>
                <Button onClick={unescapeJSON}>
                  <Unlock className="h-4 w-4 mr-1" />
                  JSON Unescape
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={rot13}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  ROT13
                </Button>
                <Button onClick={() => caesarCipher(3)}>
                  <Hash className="h-4 w-4 mr-1" />
                  Цезарь +3
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={textToBinary}>Текст → Двоичный</Button>
                <Button onClick={binaryToText}>Двоичный → Текст</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={textToHex}>Текст → Hex</Button>
                <Button onClick={hexToText}>Hex → Текст</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={textToMorse}>Текст → Морзе</Button>
                <Button onClick={morseToText}>Морзе → Текст</Button>
              </div>
            </TabsContent>
          </Tabs>

          {encodedResult && (
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium">Результат:</label>
              <Textarea
                value={encodedResult}
                readOnly
                className="font-mono"
                rows={6}
              />
              <Button onClick={() => applyResult(encodedResult)}>
                Применить к основному тексту
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}