import { afterEach, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

import { focusChatInput } from '../dom';

const originalDocument = globalThis.document;
const composerEditorSource = readFileSync(new URL('../ComposerEditor.tsx', import.meta.url), 'utf-8');
const chatCss = readFileSync(new URL('../../../../../index.css', import.meta.url), 'utf-8');

afterEach(() => {
    globalThis.document = originalDocument;
});

test('focuses the CodeMirror chat input content', () => {
    let selector = '';
    let focused = false;
    globalThis.document = {
        querySelector: (value: string) => {
            selector = value;
            return { focus: () => { focused = true; } };
        },
    } as unknown as Document;

    focusChatInput();

    expect(selector).toBe('[data-chat-input="true"] .cm-content');
    expect(focused).toBe(true);
});

test('configures the prompt editor for automatic bidirectional direction', () => {
    const attributesStart = composerEditorSource.indexOf('EditorView.contentAttributes.of({');
    expect(attributesStart).toBeGreaterThan(-1);

    expect(composerEditorSource.slice(attributesStart, attributesStart + 1_000)).toContain("dir: 'auto'");
});

test('scopes bidirectional text styling to prompts and rendered prose while isolating technical text', () => {
    expect(chatCss).toContain(
        '[data-chat-input="true"] .cm-content,\n.markdown-content {\n  unicode-bidi: plaintext;\n  text-align: start;\n}',
    );
    expect(chatCss).toContain('.markdown-content :where(');
    expect(chatCss).toContain('direction: ltr;\n  unicode-bidi: isolate;\n  text-align: left;');
});
