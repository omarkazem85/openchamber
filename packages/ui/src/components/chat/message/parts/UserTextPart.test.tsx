import React from 'react';
import { describe, expect, mock, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

mock.module('@/stores/useUIStore', () => ({
  useUIStore: (selector: (state: Record<string, unknown>) => unknown) => selector({
    userMessageRenderingMode: 'plain',
    collapsibleUserMessages: false,
    openContextFile: () => undefined,
  }),
}));

mock.module('@/stores/useSkillsStore', () => ({
  useSkillsStore: (selector: (state: Record<string, unknown>) => unknown) => selector({
    skills: [],
  }),
}));

mock.module('@/hooks/useEffectiveDirectory', () => ({
  useEffectiveDirectory: () => '/tmp',
}));

mock.module('@/lib/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const { default: UserTextPart } = await import('./UserTextPart');

describe('UserTextPart', () => {
  test('applies automatic bidirectional layout to plain user messages', () => {
    const html = renderToStaticMarkup(
      <UserTextPart
        part={{ id: 'part-1', type: 'text', text: 'مرحبا ABC 123' } as never}
        messageId="message-1"
        isMobile={false}
      />,
    );

    expect(html).toContain('dir="auto"');
    expect(html).toContain('[unicode-bidi:plaintext]');
    expect(html).toContain('text-start');
  });
});
