import { describe, expect, it } from 'vitest';

import { lowercase } from '@/filters/lowercase';

describe('lowercase', () => {
  it('lowercases a value', () => {
    expect(lowercase('Ionic Vue')).toBe('ionic vue');
  });
});
