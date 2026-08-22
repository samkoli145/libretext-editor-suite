import { describe, it, expect } from 'vitest';
import { createComponentRegistry } from '../../src/registry/component-registry';

describe('CORE-REG-001: component-registry', () => {
  it('registers and retrieves component', () => {
    const reg = createComponentRegistry();
    reg.register({
      id: 'tabs', nameAr: 'شريط التبويبات', nameEn: 'Tabs Bar',
      category: 'shell', filePath: 'src/tabs.tsx', defaultPosition: 'top-bar',
      currentPosition: 'top-bar', isRegistered: true, isVisible: true,
      iconName: 'Layout', descriptionAr: 'شريط التبويبات',
    });
    expect(reg.get('tabs')).toBeDefined();
    expect(reg.size()).toBe(1);
  });

  it('rejects invalid registration', () => {
    const reg = createComponentRegistry();
    expect(reg.register({ id: '', nameEn: '' } as any)).toBe(false);
  });

  it('setVisible toggles visibility', () => {
    const reg = createComponentRegistry();
    reg.register({
      id: 'a', nameAr: 'A', nameEn: 'A', category: 'shell',
      filePath: 'a.ts', defaultPosition: 'top-bar', currentPosition: 'top-bar',
      isRegistered: true, isVisible: true, iconName: '', descriptionAr: '',
    });
    reg.setVisible('a', false);
    expect(reg.get('a')!.isVisible).toBe(false);
  });

  it('setPosition changes position', () => {
    const reg = createComponentRegistry();
    reg.register({
      id: 'a', nameAr: 'A', nameEn: 'A', category: 'canvas',
      filePath: 'a.ts', defaultPosition: 'top-bar', currentPosition: 'top-bar',
      isRegistered: true, isVisible: true, iconName: '', descriptionAr: '',
    });
    reg.setPosition('a', 'sidebar');
    expect(reg.get('a')!.currentPosition).toBe('sidebar');
  });

  it('listByCategory filters', () => {
    const reg = createComponentRegistry();
    reg.register({ id: 'a', nameAr: 'A', nameEn: 'A', category: 'shell', filePath: '', defaultPosition: 'top-bar', currentPosition: 'top-bar', isRegistered: true, isVisible: true, iconName: '', descriptionAr: '' });
    reg.register({ id: 'b', nameAr: 'B', nameEn: 'B', category: 'canvas', filePath: '', defaultPosition: 'sidebar', currentPosition: 'sidebar', isRegistered: true, isVisible: true, iconName: '', descriptionAr: '' });
    expect(reg.listByCategory('shell')).toHaveLength(1);
    expect(reg.listByCategory('canvas')).toHaveLength(1);
  });

  it('toMatrix returns record', () => {
    const reg = createComponentRegistry();
    reg.register({ id: 'x', nameAr: 'X', nameEn: 'X', category: 'shared', filePath: '', defaultPosition: 'modal', currentPosition: 'modal', isRegistered: true, isVisible: true, iconName: '', descriptionAr: '' });
    const matrix = reg.toMatrix();
    expect(matrix.x).toBeDefined();
  });
});
