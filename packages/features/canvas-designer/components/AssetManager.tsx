/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مدير الأصول الصورية والوسائط التفاعلي - Asset Manager
 * 🏛️ الدور: مكون مشترك - إدارة مكتبة الصور والوسائط والتصنيف التلقائي
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Auto-Classified Asset Library: مكتبة أصول مصنفة تلقائياً
 *    (خلفيات، صور شخصية، منتجات، أيقونات) مع ImageEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الصور يجب قراءة EXIF Orientation يدوياً (صفر مكتبات)
 *    2. التصنيف يجب أن يكون دقيقاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع الصور قبل الرفع
 *    - fallback لتصنيف "أخرى"
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Edit3,
  Plus,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Tag,
  FolderOpen,
} from 'lucide-react';
import {
  prepareUploadedImage,
  type ProcessedImageResult,
} from '../../../core/engines/ImagePipelineEngine';
import { ImageEditor } from '../../../shared/components/ImageEditor';
import type { CanvasElement } from '../model';

export interface ProjectAsset {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly type: 'image' | 'icon' | 'svg' | 'background';
  readonly category: string;
  readonly sizeKB?: number;
  readonly width?: number;
  readonly height?: number;
  readonly uploadedAt?: string;
}

export interface AssetManagerProps {
  readonly selectedElementId: string | null;
  readonly onInsertAsset: (asset: ProjectAsset) => void;
  readonly onUpdateSelectedElementImage?: (url: string) => void;
}

export const DEFAULT_ASSETS: readonly ProjectAsset[] = [
  {
    id: 'asset-hero-modern',
    name: 'مساحة عمل رقمية عصرية',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    type: 'background',
    category: 'خلفيات وبنرات',
    sizeKB: 140,
    width: 1200,
    height: 800,
    uploadedAt: 'افتراضي',
  },
  {
    id: 'asset-avatar-exec',
    name: 'صورة شخصية تنفيذية',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    type: 'image',
    category: 'صور شخصية',
    sizeKB: 65,
    width: 600,
    height: 600,
    uploadedAt: 'افتراضي',
  },
  {
    id: 'asset-product-minimal',
    name: 'منتج تقني أنيق',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    category: 'منتجات وبطاقات',
    sizeKB: 88,
    width: 800,
    height: 600,
    uploadedAt: 'افتراضي',
  },
  {
    id: 'asset-nature-calm',
    name: 'طبيعة جبلية هادئة',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    type: 'background',
    category: 'خلفيات وبنرات',
    sizeKB: 180,
    width: 1200,
    height: 800,
    uploadedAt: 'افتراضي',
  },
  {
    id: 'asset-tech-code',
    name: 'شاشة تطوير وبرمجة',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    type: 'image',
    category: 'منتجات وبطاقات',
    sizeKB: 120,
    width: 1200,
    height: 800,
    uploadedAt: 'افتراضي',
  },
];

const CATEGORIES = [
  'الكل',
  'خلفيات وبنرات',
  'صور شخصية',
  'منتجات وبطاقات',
  'أيقونات ورسوم',
  'عام',
] as const;

export function autoDetectCategory(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (/hero|bg|banner|خلفية|wall|cover/i.test(lower)) {
    return 'خلفيات وبنرات';
  }
  if (/avatar|user|person|صورة|شخصية|face|portrait/i.test(lower)) {
    return 'صور شخصية';
  }
  if (/product|card|منتج|بطاقة|mockup|item/i.test(lower)) {
    return 'منتجات وبطاقات';
  }
  if (/icon|logo|شعار|رمز|svg/i.test(lower)) {
    return 'أيقونات ورسوم';
  }
  return 'عام';
}

export const AssetManager: React.FC<AssetManagerProps> = ({
  selectedElementId,
  onInsertAsset,
  onUpdateSelectedElementImage,
}) => {
  const [assets, setAssets] = useState<ProjectAsset[]>(() => [...DEFAULT_ASSETS]);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Editing Asset in ImageEditor
  const [editingAsset, setEditingAsset] = useState<ProjectAsset | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Image File Upload (100% Mouse Driven via File Picker)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result: ProcessedImageResult = await prepareUploadedImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.9,
          format: file.type === 'image/png' ? 'image/png' : 'image/webp',
        });

        const newAsset: ProjectAsset = {
          id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: result.dataUrl,
          type: 'image',
          category: autoDetectCategory(file.name),
          sizeKB: Math.round(result.fileSize / 1024),
          width: result.width,
          height: result.height,
          uploadedAt: 'الآن',
        };

        setAssets((prev) => [newAsset, ...prev]);
      }
    } catch (err) {
      console.error('[AssetManager] خطأ في رفع ومعالجة الصورة:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Copy URL to Clipboard
  const handleCopyUrl = (asset: ProjectAsset) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Delete Asset
  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Handle Save Edited Image
  const handleSaveEditedAsset = (result: ProcessedImageResult) => {
    if (!editingAsset) return;
    setAssets((prev) =>
      prev.map((a) =>
        a.id === editingAsset.id
          ? {
              ...a,
              url: result.dataUrl,
              width: result.width,
              height: result.height,
              sizeKB: Math.round(result.fileSize / 1024),
            }
          : a
      )
    );

    // If currently applied to the selected element, update it live
    if (onUpdateSelectedElementImage) {
      onUpdateSelectedElementImage(result.dataUrl);
    }

    setEditingAsset(null);
  };

  // Filter Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesCat = selectedCategory === 'الكل' || asset.category === selectedCategory;
    const matchesSearch = !searchQuery || asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="asset-manager-panel" className="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden" dir="rtl">
      {/* Top Upload Action Header */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-extrabold text-slate-900">مدير أصول الصور والوسائط</span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold">{assets.length} أصول</span>
        </div>

        {/* Upload Trigger Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'جاري قراءة ومعالجة الصورة...' : 'رفع صور من الجهاز (فأرة فقط)'}</span>
          </button>
        </div>

        {/* Category Chips Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-2">
            <FolderOpen className="w-8 h-8 text-slate-300 stroke-1" />
            <div className="text-xs font-bold text-slate-600">لا توجد صور في هذا التصنيف</div>
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              انقر على زر "رفع صور من الجهاز" لإضافة صور جديدة ومعالجتها تلقائياً.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-slate-50 hover:bg-blue-50/30 border border-slate-200 hover:border-blue-300 rounded-xl p-2.5 transition shadow-2xs flex flex-col gap-2"
              >
                <div className="flex items-center gap-2.5">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{asset.name}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                      <span className="bg-white border border-slate-200 px-1.5 py-0.2 rounded text-slate-600">
                        {asset.category}
                      </span>
                      {asset.width && asset.height && (
                        <span>{asset.width}×{asset.height}</span>
                      )}
                      {asset.sizeKB && <span>{asset.sizeKB}KB</span>}
                    </div>
                  </div>
                </div>

                {/* Mouse Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 gap-1">
                  <div className="flex items-center gap-1">
                    {/* Insert / Apply Button */}
                    <button
                      type="button"
                      onClick={() => onInsertAsset(asset)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer"
                      title={selectedElementId ? 'تطبيق على العنصر المحدد' : 'إدراج كصورة جديدة'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{selectedElementId ? 'تطبيق' : 'إدراج بالكانفا'}</span>
                    </button>

                    {/* Edit in ImageEditor */}
                    <button
                      type="button"
                      onClick={() => setEditingAsset(asset)}
                      className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      title="قص وتعديل الصورة في المحرر"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>تحرير</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Copy Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset)}
                      className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
                      title="نسخ رابط الصورة"
                    >
                      {copiedId === asset.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 rounded-lg transition cursor-pointer"
                      title="حذف الأصل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Editor Modal when editing asset */}
      {editingAsset && (
        <ImageEditor
          src={editingAsset.url}
          imageName={editingAsset.name}
          onSave={handleSaveEditedAsset}
          onCancel={() => setEditingAsset(null)}
        />
      )}
    </div>
  );
};
