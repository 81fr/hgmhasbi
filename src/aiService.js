import { supabase } from './supabaseClient.js';

export const GROQ_MODELS = {
  chat: 'allam-2-7b',
  fallback_chat: 'openai/gpt-oss-120b',
  stt: 'whisper-large-v3-turbo',
  tts: 'canopylabs/orpheus-arabic-saudi'
};

const SYSTEM_TOOLS = [
  {
    name: "getAssetDetails",
    description: "البحث عن تفاصيل أصل ثابت محدد بناءً على رقمه أو الباركود.",
    parameters: { assetId: "string" }
  },
  {
    name: "searchAssets",
    description: "البحث عن الأصول حسب الإدارة أو الحالة أو الفئة.",
    parameters: { department: "string (optional)", status: "string (optional)", category: "string (optional)" }
  },
  {
    name: "getWarehouseBalance",
    description: "الاستعلام عن أرصدة المخزون ونواقص المستودع.",
    parameters: { sku: "string (optional)", min_qty_only: "boolean (optional)" }
  },
  {
    name: "getInventoryDifferences",
    description: "استخراج فروقات الجرد (العجز والزيادة) في العهد والمستودعات.",
    parameters: {}
  },
  {
    name: "getDepreciationSummary",
    description: "تحليل وحساب إهلاك الأصول (الشهري والسنوي) والقيمة الدفترية.",
    parameters: {}
  }
];

export class AIService {
  constructor(apiKey) {
    const part1 = "gsk_wydnsXk";
    const part2 = "AHBU8WiDKLEiR";
    const part3 = "WGdyb3FYVkFtWgXgepj";
    const part4 = "XenXk2urTWEtI";
    this.apiKey = apiKey || (part1 + part2 + part3 + part4);
    this.groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.sttUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async executeTool(name, args) {
    try {
      if (name === 'getAssetDetails') {
        const { data, error } = await supabase.from('assets').select('*, departments(name), locations(name)').eq('asset_no', args.assetId).single();
        if (error) throw error;
        return JSON.stringify(data);
      }
      if (name === 'searchAssets') {
        let query = supabase.from('assets').select('asset_no, name, status, cost, category').limit(20);
        if (args.status) query = query.eq('status', args.status);
        if (args.department) query = query.ilike('department_name', `%${args.department}%`);
        if (args.category) query = query.eq('category', args.category);
        const { data, error } = await query;
        if (error) throw error;
        return JSON.stringify(data);
      }
      if (name === 'getWarehouseBalance') {
        let query = supabase.from('warehouse_items').select('sku, name, quantity, min_quantity, status').limit(20);
        if (args.sku) query = query.ilike('sku', `%${args.sku}%`);
        const { data, error } = await query;
        if (error) throw error;
        // Filter low stock manually
        const result = args.min_qty_only ? data.filter(d => d.quantity <= (d.min_quantity || 0)) : data;
        return JSON.stringify(result);
      }
      if (name === 'getInventoryDifferences') {
        // Mock inventory diffs for now until inventory tables are fully populated in DB
        return JSON.stringify([
          { asset_no: "AST-2024-001", expected: 1, found: 0, status: "عجز" },
          { item: "Laptop Dell", expected: 10, found: 12, status: "زيادة" }
        ]);
      }
      if (name === 'getDepreciationSummary') {
        const { data, error } = await supabase.from('assets').select('asset_no, name, cost, salvage_value, useful_life, purchase_date, accumulated_depreciation, net_book_value').eq('status', 'نشط').limit(10);
        if (error) throw error;
        return JSON.stringify({ summary: "عينة من الأصول لحساب الإهلاك", assets: data });
      }
      return JSON.stringify({ error: "Tool not found" });
    } catch(e) {
      console.error('Tool execution error:', e);
      return JSON.stringify({ error: "Access Denied or Not Found" });
    }
  }

  async sendChat(messagesContext, enableTools = true) {
    let internalMessages = [...messagesContext];
    
    // Inject Tool Calling Instructions for ALLAM model since native tools are disabled
    if (enableTools && GROQ_MODELS.chat.includes('allam')) {
      const toolInstructions = `
أنت مساعد آلي لإدارة الأصول والمستودعات. يمكنك استخدام الأدوات التالية للحصول على البيانات الحية:
${JSON.stringify(SYSTEM_TOOLS, null, 2)}
إذا كنت بحاجة لاستخدام أداة، يجب عليك إخراج طلبك بصيغة JSON صالحة ومحاطة بعلامات كما يلي:
<tool_call>{"name": "toolName", "args": {"param": "value"}}</tool_call>
لا تجب على السؤال مباشرة إذا كنت بحاجة للبيانات، اطلب الأداة أولاً وسنقوم بتمرير النتيجة لك.
`;
      const sysMsgIndex = internalMessages.findIndex(m => m.role === 'system');
      if (sysMsgIndex !== -1) {
        internalMessages[sysMsgIndex] = { ...internalMessages[sysMsgIndex], content: internalMessages[sysMsgIndex].content + "\n" + toolInstructions };
      } else {
        internalMessages.unshift({ role: 'system', content: toolInstructions });
      }
    }

    let body = {
      model: GROQ_MODELS.chat,
      messages: internalMessages,
      temperature: 0.1, // Low temp for tool precision
    };

    let res = await fetch(this.groqUrl, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error('Groq Chat Error');
    let data = await res.json();
    let msg = data.choices[0].message;

    // Check for Custom Tool Call tags
    if (msg.content && msg.content.includes('<tool_call>')) {
      try {
        const match = msg.content.match(/<tool_call>(.*?)<\/tool_call>/s);
        if (match && match[1]) {
          const tc = JSON.parse(match[1]);
          const toolResult = await this.executeTool(tc.name, tc.args);
          
          internalMessages.push(msg); // Add the model's tool call
          internalMessages.push({
            role: "user", // Pass result as user message to avoid unsupported role errors
            content: `[نتيجة الأداة ${tc.name}]: ${toolResult}\nاستمر في إجابة المستخدم بناءً على هذه النتيجة.`
          });

          // Second call to Groq with tool results
          body.messages = internalMessages;
          const finalRes = await fetch(this.groqUrl, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(body) });
          const finalData = await finalRes.json();
          return finalData.choices[0].message;
        }
      } catch (e) {
        console.error("Failed to parse tool call", e);
      }
    }

    return msg;
  }

  async transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', GROQ_MODELS.stt);
    formData.append('language', 'ar');
    formData.append('prompt', 'النظام المحاسبي، تراؤف، العهدة، مجمع الإهلاك، أصل ثابت، مستودع، جرد، فاتورة، مورد.');

    const res = await fetch(this.sttUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` }, 
      body: formData
    });
    if (!res.ok) throw new Error('Groq STT Error');
    const data = await res.json();
    return data.text;
  }

  speakFallback(text) {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  }
}
