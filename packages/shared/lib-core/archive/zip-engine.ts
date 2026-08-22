/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك أرشيف ZIP معزول بالكامل بدون مكتبات خارجية - إنشاء وقراءة ملفات ZIP
 * 🏛️ الدور: نواة مشتركة معزولة (Zero-Dependency) - أساس لتصدير ODT/DOCX/EPUB
 * 📥 المستهلك: UniversalFormatConverter, OdfEngine, DocxServices, zip-engine.test
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Engine: بناء محرك ZIP كامل من الصفر باستخدام Web APIs فقط
 *    (Uint8Array, DataView, TextEncoder, CompressionStream) بدل مكتبة JSZip
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. حجم الملفات الكبيرة جداً قد يسبب نفاد الذاكرة - يُنصح بتدريج التحميل
 *    2. ترميز UTF-8 للعربية يتطلب تفعيل Bit 11 في General Purpose Bit Flag
 *    3. التوقيعات الثنائية (Signatures) يجب أن تكون دقيقة للبايت الواحد
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صلاحية التوقيعات (0x04034b50, 0x02014b50, 0x06054b50) قبل المعالجة
 *    - تعامل مع الملفات الفارغة والمجلدات بدون أخطاء قسمة على صفر
 *    - إرجاع Uint8Array دائماً حتى للنصوص لضمان التوافق الثنائي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ZipEntry {
  name: string;
  data: Uint8Array | string;
  lastModified?: Date;
  comment?: string;
}

export interface ExtractedZipFile {
  name: string;
  data: Uint8Array;
  text: () => string;
  size: number;
}

// CRC32 Lookup Table & Calculator
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC32_TABLE[i] = c >>> 0;
}

export function calculateCRC32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = CRC32_TABLE[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function dateToDosTimeDate(date: Date): { time: number; date: number } {
  const dosTime = ((date.getHours() << 11) | (date.getMinutes() << 5) | (Math.floor(date.getSeconds() / 2))) & 0xFFFF;
  const dosDate = (((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()) & 0xFFFF;
  return { time: dosTime, date: dosDate };
}

function dosToJsDate(dosDate: number, dosTime: number): Date {
  const year = ((dosDate >> 9) & 0x7F) + 1980;
  const month = ((dosDate >> 5) & 0x0F) - 1;
  const day = dosDate & 0x1F;
  const hour = (dosTime >> 11) & 0x1F;
  const minute = (dosTime >> 5) & 0x3F;
  const second = (dosTime & 0x1F) * 2;
  return new Date(year, month, day, hour, minute, second);
}

/**
 * Pure In-Memory ZIP Pack Engine (Zero external dependencies)
 */
export class ZipArchiveWriter {
  private entries: Array<{
    nameBytes: Uint8Array;
    name: string;
    data: Uint8Array;
    crc32: number;
    size: number;
    time: number;
    date: number;
  }> = [];

  private encoder = new TextEncoder();

  /**
   * Add a file to the ZIP archive
   */
  public addFile(name: string, content: Uint8Array | string, date: Date = new Date()): void {
    const rawData = typeof content === 'string' ? this.encoder.encode(content) : content;
    const nameBytes = this.encoder.encode(name.replace(/\\/g, '/'));
    const crc = calculateCRC32(rawData);
    const { time, date: dosDate } = dateToDosTimeDate(date);

    this.entries.push({
      nameBytes,
      name,
      data: rawData,
      crc32: crc,
      size: rawData.length,
      time,
      date: dosDate,
    });
  }

  /**
   * Build the complete ZIP archive binary buffer
   */
  public build(): Uint8Array {
    let totalLocalHeadersSize = 0;
    let totalCentralDirectorySize = 0;

    for (const entry of this.entries) {
      // Local header: 30 bytes + name length + data length
      totalLocalHeadersSize += 30 + entry.nameBytes.length + entry.size;
      // Central Directory entry: 46 bytes + name length
      totalCentralDirectorySize += 46 + entry.nameBytes.length;
    }

    // End of Central Directory Record (EOCD): 22 bytes
    const totalArchiveSize = totalLocalHeadersSize + totalCentralDirectorySize + 22;
    const buffer = new Uint8Array(totalArchiveSize);
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

    let currentOffset = 0;
    const localOffsets: number[] = [];

    // 1. Write Local File Headers and Data (STORE method = 0)
    for (const entry of this.entries) {
      localOffsets.push(currentOffset);

      // Local file header signature = 0x04034b50
      view.setUint32(currentOffset, 0x04034b50, true);
      view.setUint16(currentOffset + 4, 20, true); // Version needed (2.0)
      view.setUint16(currentOffset + 6, 0x0800, true); // General purpose bit flag (UTF-8)
      view.setUint16(currentOffset + 8, 0, true); // Compression method (0 = STORE)
      view.setUint16(currentOffset + 10, entry.time, true);
      view.setUint16(currentOffset + 12, entry.date, true);
      view.setUint32(currentOffset + 14, entry.crc32, true);
      view.setUint32(currentOffset + 18, entry.size, true); // Compressed size
      view.setUint32(currentOffset + 22, entry.size, true); // Uncompressed size
      view.setUint16(currentOffset + 26, entry.nameBytes.length, true); // File name length
      view.setUint16(currentOffset + 28, 0, true); // Extra field length

      currentOffset += 30;
      buffer.set(entry.nameBytes, currentOffset);
      currentOffset += entry.nameBytes.length;

      buffer.set(entry.data, currentOffset);
      currentOffset += entry.size;
    }

    const centralDirectoryOffset = currentOffset;

    // 2. Write Central Directory Headers
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      const localOffset = localOffsets[i];

      // Central file header signature = 0x02014b50
      view.setUint32(currentOffset, 0x02014b50, true);
      view.setUint16(currentOffset + 4, 20, true); // Version made by
      view.setUint16(currentOffset + 6, 20, true); // Version needed
      view.setUint16(currentOffset + 8, 0x0800, true); // General purpose bit flag (UTF-8)
      view.setUint16(currentOffset + 10, 0, true); // Compression method (STORE)
      view.setUint16(currentOffset + 12, entry.time, true);
      view.setUint16(currentOffset + 14, entry.date, true);
      view.setUint32(currentOffset + 16, entry.crc32, true);
      view.setUint32(currentOffset + 20, entry.size, true);
      view.setUint32(currentOffset + 24, entry.size, true);
      view.setUint16(currentOffset + 28, entry.nameBytes.length, true);
      view.setUint16(currentOffset + 30, 0, true); // Extra field length
      view.setUint16(currentOffset + 32, 0, true); // File comment length
      view.setUint16(currentOffset + 34, 0, true); // Disk number start
      view.setUint16(currentOffset + 36, 0, true); // Internal file attributes
      view.setUint32(currentOffset + 38, 0, true); // External file attributes
      view.setUint32(currentOffset + 42, localOffset, true); // Relative offset of local header

      currentOffset += 46;
      buffer.set(entry.nameBytes, currentOffset);
      currentOffset += entry.nameBytes.length;
    }

    const centralDirectorySize = currentOffset - centralDirectoryOffset;

    // 3. Write End of Central Directory Record (EOCD)
    // Signature = 0x06054b50
    view.setUint32(currentOffset, 0x06054b50, true);
    view.setUint16(currentOffset + 4, 0, true); // Number of this disk
    view.setUint16(currentOffset + 6, 0, true); // Disk where central directory starts
    view.setUint16(currentOffset + 8, this.entries.length, true); // Total entries on this disk
    view.setUint16(currentOffset + 10, this.entries.length, true); // Total entries
    view.setUint32(currentOffset + 12, centralDirectorySize, true); // Size of central directory
    view.setUint32(currentOffset + 16, centralDirectoryOffset, true); // Offset of start of central directory
    view.setUint16(currentOffset + 20, 0, true); // ZIP comment length

    return buffer;
  }

  /**
   * Helper to download the created zip file directly in the browser
   */
  public downloadAs(filename: string): void {
    const zipBytes = this.build();
    const blob = new Blob([zipBytes], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.zip') ? filename : `${filename}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Pure In-Memory ZIP Unpack Engine (Zero external dependencies)
 */
export class ZipArchiveReader {
  private buffer: Uint8Array;
  private view: DataView;
  private decoder = new TextDecoder('utf-8');

  constructor(data: Uint8Array | ArrayBuffer) {
    this.buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  /**
   * Read all files inside the ZIP archive
   */
  public async extractFiles(): Promise<ExtractedZipFile[]> {
    const files: ExtractedZipFile[] = [];
    const eocdOffset = this.findEOCD();

    if (eocdOffset === -1) {
      // Fallback: parse sequentially through local headers
      return this.extractSequentially();
    }

    const totalEntries = this.view.getUint16(eocdOffset + 10, true);
    const centralDirOffset = this.view.getUint32(eocdOffset + 16, true);

    let currentCDOffset = centralDirOffset;

    for (let i = 0; i < totalEntries; i++) {
      if (currentCDOffset + 46 > this.buffer.length) break;
      const signature = this.view.getUint32(currentCDOffset, true);
      if (signature !== 0x02014b50) break;

      const compressionMethod = this.view.getUint16(currentCDOffset + 10, true);
      const compressedSize = this.view.getUint32(currentCDOffset + 20, true);
      const uncompressedSize = this.view.getUint32(currentCDOffset + 24, true);
      const nameLength = this.view.getUint16(currentCDOffset + 28, true);
      const extraLength = this.view.getUint16(currentCDOffset + 30, true);
      const commentLength = this.view.getUint16(currentCDOffset + 32, true);
      const localHeaderOffset = this.view.getUint32(currentCDOffset + 42, true);

      const nameBytes = this.buffer.subarray(currentCDOffset + 46, currentCDOffset + 46 + nameLength);
      const filename = this.decoder.decode(nameBytes);

      // Skip directory entries
      if (!filename.endsWith('/')) {
        const fileData = await this.extractFileData(localHeaderOffset, compressionMethod, compressedSize, uncompressedSize);
        files.push({
          name: filename,
          data: fileData,
          size: fileData.length,
          text: () => this.decoder.decode(fileData),
        });
      }

      currentCDOffset += 46 + nameLength + extraLength + commentLength;
    }

    return files;
  }

  private async extractFileData(
    localOffset: number,
    compressionMethod: number,
    compressedSize: number,
    uncompressedSize: number
  ): Promise<Uint8Array> {
    if (localOffset + 30 > this.buffer.length) return new Uint8Array(0);
    const localSig = this.view.getUint32(localOffset, true);
    if (localSig !== 0x04034b50) return new Uint8Array(0);

    const nameLen = this.view.getUint16(localOffset + 26, true);
    const extraLen = this.view.getUint16(localOffset + 28, true);
    const dataStart = localOffset + 30 + nameLen + extraLen;
    const rawData = this.buffer.subarray(dataStart, dataStart + compressedSize);

    if (compressionMethod === 0) {
      // STORE (no compression)
      return new Uint8Array(rawData);
    } else if (compressionMethod === 8 && typeof DecompressionStream !== 'undefined') {
      // DEFLATE using standard browser stream
      try {
        const ds = new DecompressionStream('deflate-raw');
        const writer = ds.writable.getWriter();
        writer.write(rawData);
        writer.close();
        const reader = ds.readable.getReader();
        const chunks: Uint8Array[] = [];
        let totalLen = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            totalLen += value.length;
          }
        }

        const result = new Uint8Array(totalLen);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        return result;
      } catch (err) {
        console.warn('DecompressionStream failed, fallback to raw buffer', err);
        return new Uint8Array(rawData);
      }
    }

    return new Uint8Array(rawData);
  }

  private findEOCD(): number {
    // EOCD is at the end of the file, minimum 22 bytes
    for (let i = this.buffer.length - 22; i >= Math.max(0, this.buffer.length - 65557); i--) {
      if (this.view.getUint32(i, true) === 0x06054b50) {
        return i;
      }
    }
    return -1;
  }

  private async extractSequentially(): Promise<ExtractedZipFile[]> {
    const files: ExtractedZipFile[] = [];
    let offset = 0;

    while (offset + 30 <= this.buffer.length) {
      const sig = this.view.getUint32(offset, true);
      if (sig !== 0x04034b50) break; // Not a local header

      const compMethod = this.view.getUint16(offset + 8, true);
      const compSize = this.view.getUint32(offset + 18, true);
      const uncompSize = this.view.getUint32(offset + 22, true);
      const nameLength = this.view.getUint16(offset + 26, true);
      const extraLength = this.view.getUint16(offset + 28, true);

      const nameBytes = this.buffer.subarray(offset + 30, offset + 30 + nameLength);
      const filename = this.decoder.decode(nameBytes);

      const dataStart = offset + 30 + nameLength + extraLength;
      const fileData = await this.extractFileData(offset, compMethod, compSize, uncompSize);

      if (!filename.endsWith('/')) {
        files.push({
          name: filename,
          data: fileData,
          size: fileData.length,
          text: () => this.decoder.decode(fileData),
        });
      }

      offset = dataStart + compSize;
    }

    return files;
  }
}
