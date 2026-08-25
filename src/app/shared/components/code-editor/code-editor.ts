import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CodeSubmission {
  languageId: number;
  sourceCode: string;
  stdin: string | null;
}

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-editor.html',
  styleUrls: ['./code-editor.css']
})
export class CodeEditorComponent implements AfterViewInit, OnChanges {

  @ViewChild('editorContainer', { static: true })
  editorContainer!: ElementRef<HTMLDivElement>;

  @Input() isRunning = false;
  @Input() isSubmitting = false;

  @Input() runResult: any = null;
  @Input() submitResult: any = null;
  @Input() submitMessage: string | null = null;
  @Input() runError: string | null = null;
  @Input() submitError: string | null = null;

  // Seeds stdin with the assignment's sample test-case input, so a
  // student can Run/Submit without typing anything. Only applied while
  // stdin is still untouched — never overwrites what the student typed.
  @Input() defaultStdin: string | null = null;

  private stdinTouched = false;

  showCustomInput = false;

  @Output() run = new EventEmitter<CodeSubmission>();
  @Output() submit = new EventEmitter<CodeSubmission>();

  editor: any;
  monaco: any;

  selectedLanguage = 'python';

  stdin = '';

  // Judge0 language IDs (from this backend's live /languages endpoint),
  // not sequential — Judge0's own id=1 is archived Bash, not Python.
  readonly languageIds: Record<string, number> = {
    python: 71,
    javascript: 63,
    java: 62,
    cpp: 54,
    csharp: 51
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['defaultStdin'] &&
      !this.stdinTouched &&
      this.defaultStdin
    ) {
      this.stdin = this.defaultStdin;
    }

  }

  onStdinChange(value: string): void {
    this.stdin = value;
    this.stdinTouched = true;
  }

  async ngAfterViewInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.configureMonacoWorkers();

    // Import only the editor core plus plain syntax-highlighting
    // (Monarch grammar, no worker involved) for the languages this
    // judge platform supports. The full 'monaco-editor' barrel also
    // auto-registers the TypeScript language *service*, which needs
    // a worker-side module loader this ESM/Vite setup doesn't provide
    // and throws even when the active language is something else.
    this.monaco = await import('monaco-editor/esm/vs/editor/editor.api');

    await Promise.all([
      import('monaco-editor/esm/vs/basic-languages/python/python.contribution'),
      import('monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'),
      import('monaco-editor/esm/vs/basic-languages/java/java.contribution'),
      import('monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution'),
      import('monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution')
    ]);

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

  private configureMonacoWorkers(): void {

    // None of the languages we register (Python/JS/Java/C++/C#) use
    // anything beyond plain Monarch tokenization, so the generic
    // editor worker (bracket matching, folding, etc.) is the only
    // one ever requested.
    (window as any).MonacoEnvironment = {

      getWorker: () =>
        new Worker(
          new URL('../../../../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
          { type: 'module' }
        )

    };
  }

  changeLanguage(language: string) {

    this.selectedLanguage = language;

    this.monaco.editor.setModelLanguage(
      this.editor.getModel(),
      language
    );

    this.editor.setValue(this.getDefaultCode(language));
  }

  resetCode(): void {

    this.editor.setValue(
      this.getDefaultCode(this.selectedLanguage)
    );
  }

  onRunClick(): void {

    this.run.emit({
      languageId: this.languageIds[this.selectedLanguage],
      sourceCode: this.editor.getValue(),
      stdin: this.stdin.trim() ? this.stdin : null
    });
  }

  onSubmitClick(): void {

    this.submit.emit({
      languageId: this.languageIds[this.selectedLanguage],
      sourceCode: this.editor.getValue(),
      stdin: this.stdin.trim() ? this.stdin : null
    });
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