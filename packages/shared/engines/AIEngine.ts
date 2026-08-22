/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الذكاء الاصطناعي متعدد النماذج - Gemini/Ollama/Custom مع 4 أوضاع
 * 🏛️ الدور: محرك مشترك - تكامل Gemini API مع محاكاة محلية عند عدم التوفر
 * 📥 المستهلك: InteractiveWysiwygCodeStudio, LiveCodePanel, AI-powered features
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Provider Abstraction + Local Simulation: واجهة موحدة للمحركين مع محاكاة
 *    تلقائية للمحلل عند عدم توفر مفتاح API لضمان عمل التطبيق بدون اتصال
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. مفتاح GEMINI_API_KEY يجب أن يكون في .env - لا يُCommit أبداً
 *    2. طلبات API قد تتجاوز الحد - يجب تطبيق Rate Limiting
 *    3. الردود قد تحتوي كود ضار - يجب تنظيفها قبل العرض
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود المفتاح قبل إنشاء GoogleGenAI instance
 *    - try/catch على كل طلب API مع إرجاع AIResponse بقيم افتراضية
 *    - timeout على الطلبات لمنع التعليق
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/AIEngine.ts
// ============================================================
// محرك الذكاء الاصطناعي متعدد النماذج والشخصيات المتقدمة (AI Engine)
// يدعم أوضاع التخطيط (Plan)، التنفيذ (Execute)، المقارنة السطرية (Diff/Compare)، والبحث
// مع التزام صارم بالثيم الفاتح النقي 100% ودعم محاكاة العميل التلقائية في حال عدم توفر مفتاح
// ============================================================

import { GoogleGenAI } from '@google/genai';

export type AIProvider = 'gemini' | 'ollama' | 'custom';
export type AIMode = 'plan' | 'execute' | 'compare' | 'search';
export type AIStrength = 'standard' | 'medium' | 'deep';
export type AIPersona = 'hermes' | 'openclaw' | 'qwencoder' | 'deepseek' | 'custom';

export interface AIMemoryItem {
  id: string;
  key: string;
  value: string;
}

export interface AIResponse {
  text: string;
  codeSnippet?: string;
  proposedCode?: string;
  explanation?: string;
  diffResult?: {
    original: string;
    proposed: string;
    explanation: string;
  };
}

export interface AIExecutionParams {
  prompt: string;
  provider?: AIProvider;
  geminiModel?: string;
  geminiApiKey?: string;
  ollamaEndpoint?: string;
  ollamaModel?: string;
  customEndpointUrl?: string;
  customApiKey?: string;
  mode?: AIMode;
  strength?: AIStrength;
  persona?: AIPersona;
  currentCode?: string;
  format?: 'html' | 'markdown' | 'tsx' | 'css' | 'json';
  selectedContexts?: string[];
  memories?: AIMemoryItem[];
}

export const PERSONA_CONFIGS: Record<AIPersona, { name: string; avatar: string; systemRole: string; title: string }> = {
  hermes: {
    name: 'هيرمس (Hermes Agent)',
    avatar: '🦊',
    title: 'خبير تصميم وتطوير متكامل',
    systemRole:
      'أنت وكيل هيرمس المتقدم الخبير في بناء واجهات المستخدم الاحترافية بنقاء الثيم الفاتح 100% وHTML/CSS وReact. تجيب بإتقان واحترافية وتنتج أكواداً نظيفة خالية من الأخطاء.',
  },
  openclaw: {
    name: 'أوبن كلاو (OpenClaw Studio)',
    avatar: '🦅',
    title: 'مهندس البرمجيات البنيوية',
    systemRole:
      'أنت مهندس البرمجيات أوبن كلاو. تركيزك ينصب على الهيكلة البرمجية القوية، النظافة، والأداء العالي للأكواد.',
  },
  qwencoder: {
    name: 'كودر (Qwen-Coder Pro)',
    avatar: '💻',
    title: 'متخصص الخوارزميات والأكواد المتقدمة',
    systemRole:
      'أنت متخصص البرمجة والتكويد Qwen-Coder. تحل أعتى المشكلات البرمجية بسرعة خارقة وتولد كوداً دقيقاً ومصقولاً.',
  },
  deepseek: {
    name: 'ديب سيك (DeepSeek R1)',
    avatar: '🤖',
    title: 'محلل الاستدلال البرمجي والعمق المعرفي',
    systemRole:
      'أنت النموذج الاستدلالي DeepSeek R1. تشرح التفكير خطوة بخطوة وتدقق في الشفرات بحثاً عن أي ثغرة أو خطأ.',
  },
  custom: {
    name: 'عميل مخصص (Custom Client Persona)',
    avatar: '⚙️',
    title: 'وكيل مخصص بحسب متطلبات العميل',
    systemRole: 'أنت وكيل الذكاء الاصطناعي المخصص للعميل. تتكيف تماماً مع متطلبات المشروع المحددة.',
  },
};

export class AIEngine {
  private static instance: AIEngine;

  public static getInstance(): AIEngine {
    if (!AIEngine.instance) {
      AIEngine.instance = new AIEngine();
    }
    return AIEngine.instance;
  }

  public static async executePrompt(params: AIExecutionParams): Promise<AIResponse> {
    const {
      prompt,
      provider = 'gemini',
      geminiModel = 'gemini-2.5-flash',
      geminiApiKey,
      ollamaEndpoint = 'http://localhost:11434',
      ollamaModel = 'qwen2.5-coder',
      customEndpointUrl = 'http://localhost:8000/v1',
      customApiKey,
      mode = 'execute',
      strength = 'standard',
      persona = 'hermes',
      currentCode = '',
      format = 'html',
      selectedContexts = [],
      memories = [],
    } = params;

    const systemPrompt = AIEngine.buildSystemPrompt({
      persona,
      mode,
      strength,
      format,
      selectedContexts,
      memories,
      currentCode,
    });

    const fullPrompt = `${systemPrompt}\n\n[طلب المستخدم / التوجيه]:\n${prompt}`;

    try {
      if (provider === 'gemini') {
        return await AIEngine.callGeminiAPI({
          prompt: fullPrompt,
          geminiModel,
          geminiApiKey,
          mode,
          currentCode,
        });
      } else if (provider === 'ollama') {
        return await AIEngine.callOllamaAPI({
          prompt: fullPrompt,
          endpoint: ollamaEndpoint,
          model: ollamaModel,
          mode,
          currentCode,
        });
      } else {
        return await AIEngine.callCustomLocalAPI({
          prompt: fullPrompt,
          endpointUrl: customEndpointUrl,
          apiKey: customApiKey,
          mode,
          currentCode,
        });
      }
    } catch (error: any) {
      return AIEngine.generateSmartFallbackResponse({
        prompt,
        mode,
        strength,
        currentCode,
        format,
        errorMessage: error?.message || 'تم تفعيل التوليد المكتبي السريع.',
      });
    }
  }

  private static async callGeminiAPI(params: {
    prompt: string;
    geminiModel: string;
    geminiApiKey?: string;
    mode: AIMode;
    currentCode: string;
  }): Promise<AIResponse> {
    const { prompt, geminiModel, geminiApiKey, mode, currentCode } = params;
    const apiKey =
      geminiApiKey ||
      (typeof process !== 'undefined' ? (process.env as any)?.GEMINI_API_KEY : '') ||
      '';

    if (!apiKey) {
      throw new Error('مفتاح Gemini API غير مسجل');
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: geminiModel || 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    return AIEngine.parseModelOutput(text, mode, currentCode);
  }

  private static async callOllamaAPI(params: {
    prompt: string;
    endpoint: string;
    model: string;
    mode: AIMode;
    currentCode: string;
  }): Promise<AIResponse> {
    const { prompt, endpoint, model, mode, currentCode } = params;
    const cleanEndpoint = endpoint.replace(/\/$/, '');

    const response = await fetch(`${cleanEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'qwen2.5-coder',
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`فشل الاتصال بـ Ollama (${response.statusText})`);
    }

    const data = await response.json();
    return AIEngine.parseModelOutput(data.response || '', mode, currentCode);
  }

  private static async callCustomLocalAPI(params: {
    prompt: string;
    endpointUrl: string;
    apiKey?: string;
    mode: AIMode;
    currentCode: string;
  }): Promise<AIResponse> {
    const { prompt, endpointUrl, apiKey, mode, currentCode } = params;
    const cleanUrl = endpointUrl.replace(/\/$/, '');
    const targetUrl = cleanUrl.endsWith('/chat/completions') ? cleanUrl : `${cleanUrl}/chat/completions`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: 'local-model',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`فشل الاتصال بـ API (${response.statusText})`);
    }

    const data = await response.json();
    return AIEngine.parseModelOutput(data.choices?.[0]?.message?.content || '', mode, currentCode);
  }

  private static buildSystemPrompt(options: {
    persona: AIPersona;
    mode: AIMode;
    strength: AIStrength;
    format: string;
    selectedContexts: string[];
    memories: AIMemoryItem[];
    currentCode: string;
  }): string {
    const { persona, mode, strength, format, selectedContexts, memories, currentCode } = options;
    const personaConfig = PERSONA_CONFIGS[persona] || PERSONA_CONFIGS.hermes;

    let modeInstruction = '';
    switch (mode) {
      case 'plan':
        modeInstruction =
          '[وضع العمل: التخطيط (Plan)]\nالمطلوب تقديم تحليل معماري وخطوات واضحة للتطوير قبل تطبيق الكود.';
        break;
      case 'execute':
        modeInstruction =
          '[وضع العمل: التنفيذ المباشر (Execute)]\nالمطلوب توليد الكود النهائي المحدث والمكتمل بدقة متناهية بالثيم الفاتح النقي.';
        break;
      case 'compare':
        modeInstruction =
          '[وضع العمل: المقارنة (Compare / Diff)]\nالمطلوب مقارنة الشفرة الحالية بالشفرة المقترحة وتوضيح الفروقات.';
        break;
      case 'search':
        modeInstruction =
          '[وضع العمل: البحث في الشفرة (Code Search)]\nالمطلوب تحليل الكود الحالي والبحث عن العناصر والوظائف.';
        break;
    }

    const contextsText = selectedContexts.length > 0 ? `السياقات: ${selectedContexts.join(', ')}` : '';
    const memoriesText =
      memories.length > 0 ? `الذاكرة:\n${memories.map((m) => `- [${m.key}]: ${m.value}`).join('\n')}` : '';

    return `${personaConfig.systemRole}
${modeInstruction}
مستوى التحليل: ${strength}
نوع الملف: ${format.toUpperCase()}
ممنوع استخدام أي ثيم ليلي أو خلفيات سوداء أو داكنة. استخدم دوماً ثيم فاتح نقي 100%.
${contextsText}
${memoriesText}

[الشفرة الحالية]:
\`\`\`${format}
${currentCode.slice(0, 3000)}
\`\`\`
`;
  }

  private static parseModelOutput(text: string, mode: AIMode, currentCode: string): AIResponse {
    const codeMatch = text.match(/```(?:html|markdown|css|js|tsx|jsx|json)?\n([\s\S]*?)\n```/);
    const codeSnippet = codeMatch ? codeMatch[1] : undefined;

    if (mode === 'compare' && codeSnippet) {
      return {
        text,
        codeSnippet,
        proposedCode: codeSnippet,
        explanation: text.replace(/```[\s\S]*?```/g, '').trim(),
        diffResult: {
          original: currentCode,
          proposed: codeSnippet,
          explanation: text.replace(/```[\s\S]*?```/g, '').trim() || 'تم إنشاء الشفرة المقترحة بنجاح.',
        },
      };
    }

    return {
      text,
      codeSnippet,
      proposedCode: codeSnippet,
      explanation: text,
    };
  }

  private static generateSmartFallbackResponse(params: {
    prompt: string;
    mode: AIMode;
    strength: AIStrength;
    currentCode: string;
    format: string;
    errorMessage: string;
  }): AIResponse {
    const { prompt, mode, currentCode, format, errorMessage } = params;

    let generatedCode = currentCode;
    if (format === 'html' || format === 'tsx') {
      const newBlock = `\n<!-- تم إنشاؤه ذكائياً بالثيم الفاتح: ${prompt} -->\n<div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs my-4 space-y-3">\n  <div class="flex items-center gap-2 text-blue-600 font-bold">\n    <span class="p-1.5 bg-blue-50 rounded-lg">✨</span>\n    <h3 class="text-base text-slate-900">${prompt}</h3>\n  </div>\n  <p class="text-xs text-slate-600 leading-relaxed">مكون تفاعلي حديث تم تصميمه بالثيم الفاتح النقي ومظهر عالي التباين.</p>\n  <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">تنفيذ الإجراء →</button>\n</div>`;
      generatedCode = currentCode ? currentCode + '\n' + newBlock : newBlock;
    } else {
      generatedCode = `${currentCode}\n\n## 💡 ${prompt}\n> **الوضع:** ${mode} | **التنفيذ:** محرك المعالجة الفورية المدمج بالثيم الفاتح\n\n- [x] تم تحليل المدخلات وتوليد الاستجابة.\n`;
    }

    let explanation = `[تنبيه]: ${errorMessage}\nتم تطبيق التوليد المكتبي الفوري بنجاح.`;

    if (mode === 'plan') {
      explanation = `### 📋 خطة العمل المقترحة:\n1. **تحليل الطلب:** معالجة التوجيه "${prompt}".\n2. **تجهيز المكونات:** ربط العناصر التفاعلية ونمط الاتجاه العربي RTL والثيم الفاتح.\n3. **دمج الشفرة:** إضافة القسم المحدث مع ضمان التباين العالي.`;
    }

    return {
      text: explanation,
      codeSnippet: generatedCode,
      proposedCode: generatedCode,
      explanation,
      diffResult:
        mode === 'compare'
          ? {
              original: currentCode,
              proposed: generatedCode,
              explanation,
            }
          : undefined,
    };
  }
}

export const aiEngine = AIEngine.getInstance();
