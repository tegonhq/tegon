import type { Range } from '@tiptap/core';

import { atom } from 'jotai';

export const queryAtom = atom('');
export const rangeAtom = atom<Range | null>(null);
