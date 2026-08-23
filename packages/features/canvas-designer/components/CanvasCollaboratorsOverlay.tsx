/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: طبقة عرض مؤشرات وتحديدات المتعاونين الحية (Collaborators Overlay).
 * 🏛️ الدور: مكون واجهة تفاعلي مشترك (Collaboration Viewport Layer).
 * 📥 المستهلك: CanvasDesignerEditor, Workbench.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    High-Contrast Viewport Transformed Cursors with Pure Light Badges:
 *    إسقاط مؤشرات الفأرة الحية مع تكبير/تصغير الكاميرا ومربعات التحديد الملونة
 *    مع دعم القفز المباشر لشاشة المتعاون عند النقر.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تطبيق `pointer-events-none` على الطبقة لعدم حجب نقرات المستخدم المحلي.
 *    2. تنظيف الروابط ومراقبي الحالة عند إلغاء التركيب (Unmount).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لبيانات المتعاونين.
 *    - التزام صارم بالثيم الفاتح النقي (Pure Light Theme) في البطاقات والألوان.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';
import {
  PeerAwarenessEngine,
  RemotePeer,
} from '../../../shared/lib-core/collaboration/peer-awareness-engine';

interface CanvasCollaboratorsOverlayProps {
  engine: PeerAwarenessEngine;
  zoom: number;
  panX: number;
  panY: number;
  onJumpToPeer?: (peer: RemotePeer) => void;
}

export const CanvasCollaboratorsOverlay: React.FC<CanvasCollaboratorsOverlayProps> = ({
  engine,
  zoom,
  panX,
  panY,
  onJumpToPeer,
}) => {
  const [peers, setPeers] = useState<RemotePeer[]>([]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((updatedPeers) => {
      setPeers(updatedPeers);
    });
    return unsubscribe;
  }, [engine]);

  if (peers.length === 0) return null;

  return (
    <div
      id="canvas-collaborators-overlay"
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      style={{
        transformOrigin: '0 0',
      }}
    >
      {peers.map((peer) => {
        if (!peer.cursor) return null;

        // تحويل إحداثيات الكانفا إلى موضع الشاشة
        const screenX = peer.cursor.x * zoom + panX;
        const screenY = peer.cursor.y * zoom + panY;

        return (
          <div
            key={peer.id}
            id={`remote-cursor-${peer.id}`}
            className="absolute top-0 left-0 transition-transform duration-75 ease-out pointer-events-auto"
            style={{
              transform: `translate3d(${screenX}px, ${screenY}px, 0)`,
            }}
            onClick={() => onJumpToPeer && onJumpToPeer(peer)}
            title={`انقر للانتقال إلى شاشة ${peer.name}`}
          >
            {/* سهم المؤشر الفيكتوري */}
            <svg
              className="w-4 h-4 drop-shadow-sm -translate-x-0.5 -translate-y-0.5"
              viewBox="0 0 24 24"
              fill={peer.color}
              stroke="#ffffff"
              strokeWidth="1.5"
            >
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
            </svg>

            {/* بطاقة اسم المتعاون */}
            <div
              className="px-2 py-0.5 rounded text-[11px] font-semibold text-white shadow-sm whitespace-nowrap ml-3 -mt-1 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: peer.color }}
            >
              {peer.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
