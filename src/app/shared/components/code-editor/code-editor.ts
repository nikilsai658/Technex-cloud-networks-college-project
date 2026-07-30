import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  templateUrl: './code-editor.html',
  styleUrls: ['./code-editor.css']
})
export class CodeEditorComponent implements AfterViewInit {

  @ViewChild('editorContainer', { static: true })
  editorContainer!: ElementRef<HTMLDivElement>;

  editor: any;
  monaco: any;

  selectedLanguage = 'python';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.monaco = await import('monaco-editor');

    this.editor = this.monaco.editor.create(
      this.editorContainer.nativeElement,
      {
        value: this.getDefaultCode('python'),
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: true
        }
      }
    );
  }

  changeLanguage(language: string) {

    this.selectedLanguage = language;

    this.monaco.editor.setModelLanguage(
      this.editor.getModel(),
      language
    );

    this.editor.setValue(this.getDefaultCode(language));
  }

  getDefaultCode(language: string): string {

    switch (language) {

      case 'python':
        return `print("Hello World")`;

      case 'javascript':
        return `console.log("Hello World");`;

      case 'java':
        return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`;

      case 'cpp':
        return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
}`;

      case 'csharp':
        return `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello World");
    }
}`;

      default:
        return '';
    }
  }
}