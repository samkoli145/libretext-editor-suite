import { describe, it, expect } from 'vitest';
import {
  createCanvasProfile,
  getFilteredTools,
  mergeProfiles,
  getFilteredToolsFromProfiles,
  isToolAllowed,
  WRITER_PROFILE,
  CALC_PROFILE,
  IMPRESS_PROFILE,
  BASE_PROFILE,
  type CanvasProfile,
  type UnifiedToolItem,
} from '../../src/engines/canvas-profile-engine';

const mockTools: UnifiedToolItem[] = [
  { id: 'bold', name: 'Bold', nameAr: 'عريض', category: 'text', actionId: 'bold' },
  { id: 'italic', name: 'Italic', nameAr: 'مائل', category: 'text', actionId: 'italic' },
  { id: 'align-left', name: 'Align', nameAr: 'محاذاة', category: 'format', actionId: 'align' },
  { id: 'insert-image', name: 'Image', nameAr: 'صورة', category: 'insert', actionId: 'image' },
  { id: 'insert-table', name: 'Table', nameAr: 'جدول', category: 'insert', actionId: 'table' },
  { id: 'formula-sum', name: 'SUM', nameAr: 'مجموع', category: 'data', actionId: 'sum' },
  { id: 'formula-vlookup', name: 'VLOOKUP', nameAr: 'بحث', category: 'data', actionId: 'vlookup' },
  { id: 'draw-rect', name: 'Rectangle', nameAr: 'مستطيل', category: 'geometry', actionId: 'rect' },
  { id: 'draw-circle', name: 'Circle', nameAr: 'دائرة', category: 'geometry', actionId: 'circle' },
  { id: 'export-pdf', name: 'Export PDF', nameAr: 'تصدير PDF', category: 'system', actionId: 'pdf' },
  { id: 'image-crop', name: 'Crop', nameAr: 'قص', category: 'visual', actionId: 'crop' },
  { id: 'image-filter', name: 'Filter', nameAr: 'فلتر', category: 'visual', actionId: 'filter' },
];

describe('CORE-ENG-021: canvas-profile-engine', () => {
  describe('createCanvasProfile', () => {
    it('creates profile with required fields', () => {
      const p = createCanvasProfile({
        id: 'test',
        nameAr: 'اختبار',
        nameEn: 'Test',
        allowedCategories: ['text'],
      });
      expect(p.id).toBe('test');
      expect(p.nameAr).toBe('اختبار');
      expect(p.allowedCategories).toEqual(['text']);
      expect(p.blockedIds).toEqual([]);
      expect(p.allowedDomains).toEqual([]);
      expect(p.priority).toBe(0);
    });

    it('creates profile with optional fields', () => {
      const p = createCanvasProfile({
        id: 'test',
        nameAr: 'اختبار',
        nameEn: 'Test',
        descriptionAr: 'وصف',
        allowedCategories: ['text', 'format'],
        blockedIds: ['export-pdf'],
        allowedDomains: ['Writer'],
        priority: 5,
      });
      expect(p.descriptionAr).toBe('وصف');
      expect(p.blockedIds).toEqual(['export-pdf']);
      expect(p.allowedDomains).toEqual(['Writer']);
      expect(p.priority).toBe(5);
    });
  });

  describe('getFilteredTools', () => {
    it('returns tools matching allowed categories', () => {
      const p = createCanvasProfile({
        id: 'text-only',
        nameAr: 'نصوص فقط',
        nameEn: 'Text Only',
        allowedCategories: ['text'],
      });
      const result = getFilteredTools(p, mockTools);
      expect(result.tools).toHaveLength(2);
      expect(result.tools.every(t => t.category === 'text')).toBe(true);
    });

    it('returns tools from multiple categories', () => {
      const p = createCanvasProfile({
        id: 'text-format',
        nameAr: 'نصوص وتنسيق',
        nameEn: 'Text + Format',
        allowedCategories: ['text', 'format'],
      });
      const result = getFilteredTools(p, mockTools);
      expect(result.tools).toHaveLength(3);
    });

    it('excludes blocked tools', () => {
      const p = createCanvasProfile({
        id: 'no-export',
        nameAr: 'بدون تصدير',
        nameEn: 'No Export',
        allowedCategories: ['text', 'format', 'insert', 'data', 'geometry', 'visual', 'system'],
        blockedIds: ['export-pdf'],
      });
      const result = getFilteredTools(p, mockTools);
      expect(result.tools.find(t => t.id === 'export-pdf')).toBeUndefined();
      expect(result.blockedCount).toBe(1);
    });

    it('returns empty for no matching categories', () => {
      const p = createCanvasProfile({
        id: 'empty',
        nameAr: 'فارغ',
        nameEn: 'Empty',
        allowedCategories: ['logic'],
      });
      const result = getFilteredTools(p, mockTools);
      expect(result.tools).toHaveLength(0);
      expect(result.totalCount).toBe(12);
    });

    it('returns empty for all blocked', () => {
      const p = createCanvasProfile({
        id: 'all-blocked',
        nameAr: 'محظور',
        nameEn: 'All Blocked',
        allowedCategories: ['text'],
        blockedIds: ['bold', 'italic'],
      });
      const result = getFilteredTools(p, mockTools);
      expect(result.tools).toHaveLength(0);
    });
  });

  describe('mergeProfiles', () => {
    it('merges categories as union', () => {
      const a = createCanvasProfile({
        id: 'a', nameAr: 'أ', nameEn: 'A',
        allowedCategories: ['text'],
      });
      const b = createCanvasProfile({
        id: 'b', nameAr: 'ب', nameEn: 'B',
        allowedCategories: ['data'],
      });
      const merged = mergeProfiles(a, b);
      expect(merged.allowedCategories).toEqual(['text', 'data']);
    });

    it('merges blocked IDs as union', () => {
      const a = createCanvasProfile({
        id: 'a', nameAr: 'أ', nameEn: 'A',
        allowedCategories: ['text'],
        blockedIds: ['export-pdf'],
      });
      const b = createCanvasProfile({
        id: 'b', nameAr: 'ب', nameEn: 'B',
        allowedCategories: ['text'],
        blockedIds: ['image-filter'],
      });
      const merged = mergeProfiles(a, b);
      expect(merged.blockedIds).toEqual(['export-pdf', 'image-filter']);
    });

    it('takes highest priority', () => {
      const a = createCanvasProfile({
        id: 'a', nameAr: 'أ', nameEn: 'A',
        allowedCategories: ['text'],
        priority: 3,
      });
      const b = createCanvasProfile({
        id: 'b', nameAr: 'ب', nameEn: 'B',
        allowedCategories: ['text'],
        priority: 7,
      });
      const merged = mergeProfiles(a, b);
      expect(merged.priority).toBe(7);
    });

    it('generates combined ID', () => {
      const a = createCanvasProfile({
        id: 'writer', nameAr: 'محرر', nameEn: 'Writer',
        allowedCategories: ['text'],
      });
      const b = createCanvasProfile({
        id: 'image', nameAr: 'صور', nameEn: 'Image',
        allowedCategories: ['visual'],
      });
      const merged = mergeProfiles(a, b);
      expect(merged.id).toBe('writer+image');
    });

    it('deduplicates categories', () => {
      const a = createCanvasProfile({
        id: 'a', nameAr: 'أ', nameEn: 'A',
        allowedCategories: ['text', 'format'],
      });
      const b = createCanvasProfile({
        id: 'b', nameAr: 'ب', nameEn: 'B',
        allowedCategories: ['text', 'data'],
      });
      const merged = mergeProfiles(a, b);
      expect(merged.allowedCategories).toEqual(['text', 'format', 'data']);
    });
  });

  describe('getFilteredToolsFromProfiles', () => {
    it('filters with merged profiles', () => {
      const profiles = [
        createCanvasProfile({
          id: 'a', nameAr: 'أ', nameEn: 'A',
          allowedCategories: ['text'],
        }),
        createCanvasProfile({
          id: 'b', nameAr: 'ب', nameEn: 'B',
          allowedCategories: ['data'],
        }),
      ];
      const result = getFilteredToolsFromProfiles(profiles, mockTools);
      expect(result.tools).toHaveLength(4); // 2 text + 2 data
    });

    it('applies blocked IDs from all profiles', () => {
      const profiles = [
        createCanvasProfile({
          id: 'a', nameAr: 'أ', nameEn: 'A',
          allowedCategories: ['text', 'data'],
          blockedIds: ['bold'],
        }),
        createCanvasProfile({
          id: 'b', nameAr: 'ب', nameEn: 'B',
          allowedCategories: ['text', 'data'],
          blockedIds: ['formula-sum'],
        }),
      ];
      const result = getFilteredToolsFromProfiles(profiles, mockTools);
      expect(result.tools.find(t => t.id === 'bold')).toBeUndefined();
      expect(result.tools.find(t => t.id === 'formula-sum')).toBeUndefined();
      expect(result.tools).toHaveLength(2); // italic + formula-vlookup
    });
  });

  describe('isToolAllowed', () => {
    it('allows tool in category', () => {
      expect(isToolAllowed('bold', 'text', WRITER_PROFILE)).toBe(true);
    });

    it('blocks tool not in category', () => {
      expect(isToolAllowed('formula-sum', 'data', WRITER_PROFILE)).toBe(false);
    });

    it('blocks explicitly blocked tool', () => {
      const p = createCanvasProfile({
        id: 'test', nameAr: 'اختبار', nameEn: 'Test',
        allowedCategories: ['text', 'data'],
        blockedIds: ['bold'],
      });
      expect(isToolAllowed('bold', 'text', p)).toBe(false);
    });
  });

  describe('pre-built profiles', () => {
    it('WRITER_PROFILE allows text and format', () => {
      expect(WRITER_PROFILE.allowedCategories).toContain('text');
      expect(WRITER_PROFILE.allowedCategories).toContain('format');
    });

    it('WRITER_PROFILE blocks data', () => {
      expect(WRITER_PROFILE.blockedIds).toContain('data-formula');
    });

    it('CALC_PROFILE allows data', () => {
      expect(CALC_PROFILE.allowedCategories).toContain('data');
    });

    it('IMPRESS_PROFILE allows geometry', () => {
      expect(IMPRESS_PROFILE.allowedCategories).toContain('geometry');
    });

    it('BASE_PROFILE allows data', () => {
      expect(BASE_PROFILE.allowedCategories).toContain('data');
    });

    it('all profiles have unique IDs', () => {
      const ids = [WRITER_PROFILE.id, CALC_PROFILE.id, IMPRESS_PROFILE.id, BASE_PROFILE.id];
      expect(new Set(ids).size).toBe(4);
    });
  });
});
