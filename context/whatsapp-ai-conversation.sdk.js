import { workflow, node, trigger, languageModel, newCredential, switchCase, expr } from '@n8n/workflow-sdk';

const FRAG_TABLE = { __rl: true, mode: 'list', value: '5S97YF2YvHeXqlfX', cachedResultName: 'pending_chat_fragments' };
const HIST_TABLE = { __rl: true, mode: 'list', value: 'gsAdL9PoCUSCk2aG', cachedResultName: 'chat_history' };
const KNOW_TABLE = { __rl: true, mode: 'list', value: 'k1r4PvN2Yws3AfmO', cachedResultName: 'clinic_knowledge' };
const LOG_WF = { __rl: true, mode: 'list', value: '1wAcR92r1dWktqzH', cachedResultName: 'Dads Clinic-Log Messages to History' };

const LOG_INPUT_SCHEMA = [
  { id: 'phone', displayName: 'phone', required: false, defaultMatch: false, display: true, canBeUsedToMatch: true, type: 'string', removed: false },
  { id: 'messages', displayName: 'messages', required: false, defaultMatch: false, display: true, canBeUsedToMatch: true, type: 'string', removed: false },
];

const subflowTrigger = trigger({
  type: 'n8n-nodes-base.executeWorkflowTrigger',
  version: 1.1,
  config: {
    name: 'When Executed by Parent',
    parameters: {
      inputSource: 'workflowInputs',
      workflowInputs: {
        values: [
          { name: 'phone', type: 'string' },
          { name: 'text', type: 'string' },
          { name: 'msg_id', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'quoted_id', type: 'string' },
          { name: 'forwarded', type: 'string' },
        ],
      },
    },
    position: [-1040, 200],
  },
  output: [{ phone: '962790000000', text: 'أهلين دكتور', msg_id: 'wamid.ABC', name: 'مريض', quoted_id: '', forwarded: '' }],
});

const normalizeInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Normalize Input',
    parameters: {
      assignments: {
        assignments: [
          { id: 'n1', name: 'phone', value: expr('{{ $json.phone }}'), type: 'string' },
          { id: 'n2', name: 'text', value: expr('{{ $json.text }}'), type: 'string' },
          { id: 'n3', name: 'msg_id', value: expr('{{ $json.msg_id }}'), type: 'string' },
          { id: 'n4', name: 'name', value: expr('{{ $json.name }}'), type: 'string' },
          { id: 'n5', name: 'quoted_id', value: expr('{{ $json.quoted_id }}'), type: 'string' },
          { id: 'n6', name: 'forwarded', value: expr('{{ $json.forwarded }}'), type: 'string' },
        ],
      },
      options: {},
    },
    position: [-820, 200],
  },
  output: [{ phone: '962790000000', text: 'أهلين دكتور', msg_id: 'wamid.ABC', name: 'مريض', quoted_id: '', forwarded: '' }],
});

const appendFragment = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Append Fragment',
    parameters: {
      operation: 'upsert',
      dataTableId: FRAG_TABLE,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'msg_id', condition: 'eq', keyValue: expr('{{ $json.msg_id }}') }] },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          phone: expr('{{ $json.phone }}'),
          text: expr('{{ $json.text }}'),
          msg_id: expr('{{ $json.msg_id }}'),
        },
        matchingColumns: ['msg_id'],
        schema: [
          { id: 'phone', displayName: 'phone', required: false, defaultMatch: false, display: true, type: 'string', readOnly: false, removed: false },
          { id: 'text', displayName: 'text', required: false, defaultMatch: false, display: true, type: 'string', readOnly: false, removed: false },
          { id: 'msg_id', displayName: 'msg_id', required: false, defaultMatch: false, display: true, type: 'string', readOnly: false, removed: false },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
      options: {},
    },
    alwaysOutputData: true,
    position: [-600, 200],
  },
  output: [{ id: 1, createdAt: '2026-07-01T10:00:00.000Z' }],
});

const debounceWait = node({
  type: 'n8n-nodes-base.wait',
  version: 1.1,
  config: {
    name: 'Debounce Wait',
    parameters: { resume: 'timeInterval', amount: 15, unit: 'seconds' },
    position: [-380, 200],
  },
  output: [{ id: 1 }],
});

const getFragments = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Get Fragments',
    parameters: {
      operation: 'get',
      dataTableId: FRAG_TABLE,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'phone', condition: 'eq', keyValue: expr("{{ $('Normalize Input').first().json.phone }}") }] },
      returnAll: true,
      orderBy: true,
      orderByColumn: 'createdAt',
      orderByDirection: 'ASC',
    },
    alwaysOutputData: true,
    position: [-160, 200],
  },
  output: [{ id: 1, phone: '962790000000', text: 'أهلين دكتور', msg_id: 'wamid.ABC', createdAt: '2026-07-01T10:00:00.000Z' }],
});

const claimAssemble = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Claim & Assemble',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const rows = $input.all().map(i => i.json).filter(r => r && r.msg_id);
const myMsgId = String($('Normalize Input').first().json.msg_id);
if (!rows.length) { return []; }
const sorted = rows.slice().sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) || ((a.id || 0) - (b.id || 0)));
const newest = sorted[sorted.length - 1];
if (String(newest.msg_id) !== myMsgId) { return []; }
const assembledText = sorted.map(r => r.text).join('\\n');
const consumedMsgIds = sorted.map(r => r.msg_id);
const fragments = sorted.map(r => ({ wamid: r.msg_id, text: r.text }));
const ctx = $('Normalize Input').first().json;
return [{ json: { phone: ctx.phone, name: ctx.name, assembledText, consumedMsgIds, fragments, quotedId: ctx.quoted_id || '', forwarded: ctx.forwarded || '' } }];`,
    },
    position: [60, 200],
  },
  output: [{ phone: '962790000000', name: 'مريض', assembledText: 'أهلين دكتور\nكم سعر عملية المرارة؟', consumedMsgIds: ['wamid.ABC', 'wamid.DEF'], fragments: [{ wamid: 'wamid.ABC', text: 'أهلين دكتور' }], quotedId: '', forwarded: '' }],
});

const loadHistory = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Load History',
    parameters: {
      operation: 'get',
      dataTableId: HIST_TABLE,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'phone', condition: 'eq', keyValue: expr('{{ $json.phone }}') }] },
      returnAll: false,
      limit: 1,
    },
    alwaysOutputData: true,
    position: [280, 120],
  },
  output: [{ phone: '962790000000', history: '[]' }],
});

const buildInboundLog = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Inbound Log',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const ctx = $('Claim & Assemble').first().json;
const frags = Array.isArray(ctx.fragments) ? ctx.fragments : [];
const messages = frags.map(f => ({ wamid: f.wamid, role: 'user', text: f.text }));
return [{ json: { phone: ctx.phone, messages: JSON.stringify(messages) } }];`,
    },
    position: [500, 120],
  },
  output: [{ phone: '962790000000', messages: '[]' }],
});

const logInbound = node({
  type: 'n8n-nodes-base.executeWorkflow',
  version: 1.3,
  config: {
    name: 'Log Inbound',
    parameters: {
      workflowId: LOG_WF,
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: { phone: expr('{{ $json.phone }}'), messages: expr('{{ $json.messages }}') },
        matchingColumns: [],
        schema: LOG_INPUT_SCHEMA,
        attemptToConvertTypes: false,
        convertFieldsToString: true,
      },
      options: { waitForSubWorkflow: true },
    },
    position: [720, 120],
  },
  output: [{ phone: '962790000000', history: '[]' }],
});

const loadKnowledge = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Load Knowledge',
    parameters: {
      operation: 'get',
      dataTableId: KNOW_TABLE,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'key', condition: 'eq', keyValue: 'procedures' }] },
      returnAll: false,
      limit: 1,
    },
    alwaysOutputData: true,
    position: [940, 120],
  },
  output: [{ key: 'procedures', content: '# دليل عمليات العيادة ...' }],
});

const buildPrompt = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Prompt',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const ctx = $('Claim & Assemble').first().json;
const histRow = $('Load History').first().json || {};
const knowRow = $('Load Knowledge').first().json || {};
let history = [];
try { history = JSON.parse(histRow.history || '[]'); } catch (e) { history = []; }
if (!Array.isArray(history)) history = [];
const isFirst = history.length === 0;
const getText = (m) => (m && m.text != null) ? m.text : ((m && m.content != null) ? m.content : '');
let turns = [];
for (const m of history) {
  if (!m) continue;
  const role = (m.role === 'assistant') ? 'assistant' : 'user';
  const t = getText(m);
  const last = turns[turns.length - 1];
  if (last && last.role === role) { last.text += '\\n' + t; } else { turns.push({ role, text: t }); }
}
const historyText = turns.length ? turns.map(t => (t.role === 'assistant' ? 'المساعد: ' : 'المريض: ') + t.text).join('\\n') : 'لا توجد محادثة سابقة.';
let quotedNote = '';
const quotedId = ctx.quotedId ? String(ctx.quotedId) : '';
if (quotedId) {
  const q = history.find(m => m && String(m.wamid) === quotedId);
  if (q) { const who = (q.role === 'assistant') ? 'المساعد' : 'المريض'; quotedNote = '[ردًّا على رسالة ' + who + ': «' + getText(q) + '»]\\n'; }
  else { quotedNote = '[ردًّا على رسالة سابقة]\\n'; }
}
const forwardedTag = (ctx.forwarded && String(ctx.forwarded) !== 'false' && String(ctx.forwarded) !== '') ? '(رسالة محوّلة) ' : '';
const knowledge = (knowRow && knowRow.content) ? knowRow.content : 'غير متوفر حاليًا.';
const clinicInfo = [
  'أنت المساعد الآلي لعيادة الدكتور مؤمن ديرانية (أبو عبيدة الجرّاح). تجيب على استفسارات المرضى عبر واتساب باللغة العربية بأسلوب مهذب ومختصر.',
  '',
  'معلومات العيادة:',
  '- الطبيب: د. مؤمن مأمون ديرانية، استشاري الجراحة العامة والتنظيرية',
  '- المؤهلات: FRCS Edinburgh، ثلاثة عقود خبرة',
  '- التخصصات: الفتوق، المرارة، البواسير، الناسور، الشرخ الشرجي، الجيب الشعري، الغدة الدرقية، الثدي، القولون، الزائدة الدودية',
  '- التقنيات: المنظار والليزر المتخصص',
  '- رسوم الكشف: 25 دينارًا أردنيًا',
  '- الموقع: مجمع عيادات النور التخصصية، الطابق الثاني، 13 شارع عبد الله بن جبير، عمّان',
  '- الساعات: السبت-الأربعاء (10 صباحًا-4 عصرًا)؛ الخميس (10 صباحًا-2 ظهرًا)',
  '- رقم العيادة: 0798872899',
  '- رقم الطبيب: 0799133299',
  '- رابط الحجز: https://abuobaydatajjarrah.com/bookings/',
].join('\\n');
const instructions = [
  'صنّف نية المريض إلى واحدة من:',
  '- "info": سؤال عن معلومات العيادة أو العمليات أو محادثة عامة — أجب مباشرة مستعينًا بمرجع العمليات أعلاه.',
  '- "medical": سؤال طبي يحتاج رأي الطبيب — أخبره أن يتواصل مع الطبيب مباشرة على 0799133299.',
  '- "administrative": موضوع إداري (فواتير، تقارير، تأمين) — أخبره أن يتواصل مع موظفة الاستقبال على 0798872899.',
  '- "booking": يريد حجز أو تعديل أو إلغاء موعد — وجّهه إلى https://abuobaydatajjarrah.com/bookings/.',
  '',
  'أسلوب الرد (مهم جدًا — واتساب لا يعرض أي تنسيق نصّي):',
  '- التعريف بالهوية: في أول رسالة من المحادثة أو إذا خاطبك المريض بصفتك الطبيب (مثل "كيفك يا دكتور")، ابدأ ردّك بجملة تعريف واحدة مختصرة «أنا المساعد الآلي لعيادة الدكتور مؤمن ديرانية» ثم أجب عن استفساره. أما في بقية رسائل المحادثة فادخل مباشرةً في صلب الإجابة معتمِدًا على سياق ما سبق.',
  '- تابع سياق المحادثة السابقة: إذا كان سؤال المريض استكمالًا لموضوع سبق نقاشه (مثل عملية أو منطقة ذُكرت سابقًا)، فافهمه ضمن ذلك السياق وأجب عنه ضمنه، ولا تبدأ من جديد. مثال: بعد الحديث عن الناسور، يكون سؤال "ما أنواع العمليات المتاحة؟" مقصودًا به أنواع عمليات الناسور تحديدًا.',
  '- إذا بدأت رسالة المريض بـ "[ردًّا على رسالة ...]" فهذا هو النص الذي يقتبسه المريض من المحادثة؛ اعتبره موضوع سؤاله وأجب بناءً عليه.',
  '- إذا بدأت الرسالة بـ "(رسالة محوّلة)" فهي رسالة أعاد المريض توجيهها إليك وليست بالضرورة كلامه هو.',
  '- اكتب نصًا عاديًا فقط. ممنوع منعًا باتًا استخدام النجمة (*) أو الشرطة السفلية (_) أو القوائم النقطية أو العناوين أو أي رموز تعبيرية (إيموجي).',
  '- أجب بجملة إلى ثلاث جمل قصيرة كحد أقصى، في فقرة واحدة متصلة بلا تعداد ولا نقاط.',
  '- عند السؤال عن السعر، اذكر نطاقًا واحدًا مختصرًا (من أقل قيمة إلى أعلى قيمة) دون سرد كل خيار جراحي على حدة ودون ذكر أسماء التقنيات، إلا إذا طلب المريض التفصيل. مثال: "تتراوح تكلفة عملية الناسور بين ٦٠٠ و١٢٠٠ دينار حسب نوعه وطريقة العلاج".',
  '- استخدم الأرقام العربية الهندية (٠١٢٣٤٥٦٧٨٩) في جميع الأعداد والأسعار. أما أرقام الهاتف فاكتبها بالأرقام اللاتينية بالصيغة المحلية (مثل 0799133299) لتبقى قابلة للنقر والاتصال.',
  '- إذا ذكر المريض عملية أو منطقة بعينها (مثل الناسور أو المرارة أو البواسير) فاعتبرها موضوع الحديث وتابع عليها مباشرة، ولا تسأله "أي عملية؟".',
  '- نبرة هادئة ومهنية ومطمئنة تناسب المرضى كبار السن؛ قلّل من علامات التعجب.',
  '- استعن بمرجع العمليات عند الإجابة عن الأسعار أو الألم أو التعافي أو البدائل.',
  '- لا تتظاهر بأنك طبيب ولا تقدّم تشخيصًا أو نصيحة طبية شخصية.',
  '',
  'أخرج الناتج بصيغة JSON فقط، بالشكل: {"intent":"info","reply":"نص الرد"} — دون أي نص أو شرح أو علامات كود قبل الكائن أو بعده. القيمة "intent" واحدة من: info أو medical أو administrative أو booking. والقيمة "reply" هي نص الرسالة المُرسَلة للمريض وفق قواعد الأسلوب أعلاه.',
].join('\\n');
const firstNote = isFirst ? '\\n\\nملاحظة مهمة: هذه أول رسالة في هذه المحادثة، لذا ابدأ ردّك بجملة تعريف واحدة مختصرة «أنا المساعد الآلي لعيادة الدكتور مؤمن ديرانية» ثم تابع مباشرة بالإجابة دون عبارات زائدة.' : '';
const systemMessage = [clinicInfo, '', '## مرجع العمليات (للاستعانة):', knowledge, '', '## المحادثة السابقة مع هذا المريض:', historyText, '', '## التعليمات:', instructions + firstNote].join('\\n');
const userText = quotedNote + forwardedTag + ctx.assembledText;
return [{ json: { phone: ctx.phone, name: ctx.name, text: userText, systemMessage } }];`,
    },
    position: [1160, 120],
  },
  output: [{ phone: '962790000000', name: 'مريض', text: 'أهلين دكتور', systemMessage: '...' }],
});

const claudeModel = languageModel({
  type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
  version: 1.3,
  config: {
    name: 'Claude Haiku',
    parameters: {
      model: { __rl: true, mode: 'list', value: 'claude-haiku-4-5-20251001', cachedResultName: 'Claude Haiku 4.5' },
      options: { temperature: 0.3 },
    },
    credentials: { anthropicApi: newCredential('Anthropic account') },
    position: [1160, 360],
  },
});

const clinicAgent = node({
  type: '@n8n/n8n-nodes-langchain.agent',
  version: 3.1,
  config: {
    name: 'Clinic AI Assistant',
    parameters: {
      promptType: 'define',
      text: expr('{{ $json.text }}'),
      hasOutputParser: false,
      options: {
        systemMessage: expr('{{ $json.systemMessage }}'),
        maxIterations: 3,
        enableStreaming: false,
      },
    },
    subnodes: { model: claudeModel },
    position: [1380, 120],
  },
  output: [{ output: '{"intent":"info","reply":"أنواع عمليات الناسور تشمل الفتح الجراحي وربط المسار وعلاج الليزر، ويحدد الأنسب حسب حالتك."}' }],
});

const prepareReply = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Reply',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const ctx = $('Claim & Assemble').first().json;
const raw = $input.first().json.output;
function cleanReply(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/[\\u2060\\u200B\\u200C\\u200D\\u200E\\u200F\\uFEFF]/g, '')
    .replace(/[\\u002A\\u005F\\u0060]/g, '')
    .replace(/^[ \\t]*[\\u2022\\u25AA\\u2023\\u00B7]\\s*/gm, '')
    .replace(/^[ \\t]*[-\\u2013\\u2014]\\s+/gm, '')
    .replace(/[ \\t]{2,}/g, ' ')
    .replace(/\\n{3,}/g, '\\n\\n')
    .trim();
}
function parseAi(r) {
  if (r && typeof r === 'object' && (r.reply != null || r.intent != null)) return r;
  const s = String(r == null ? '' : r);
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a !== -1 && b !== -1 && b > a) {
    try { return JSON.parse(s.slice(a, b + 1)); } catch (e) {}
  }
  return { intent: 'info', reply: s.trim() };
}
const ai = parseAi(raw);
const reply = cleanReply(ai.reply != null ? ai.reply : '');
const intent = ai.intent || 'info';
return [{ json: { phone: ctx.phone, intent: intent, reply: reply } }];`,
    },
    position: [1600, 120],
  },
  output: [{ phone: '962790000000', intent: 'info', reply: 'أنواع عمليات الناسور تشمل الفتح الجراحي وربط المسار وعلاج الليزر.' }],
});

const sendWhatsApp = node({
  type: 'n8n-nodes-base.whatsApp',
  version: 1.1,
  config: {
    name: 'Send WhatsApp Reply',
    parameters: {
      resource: 'message',
      operation: 'send',
      phoneNumberId: '943723358817193',
      recipientPhoneNumber: expr("{{ $('Prepare Reply').first().json.phone }}"),
      messageType: 'text',
      textBody: expr("{{ $('Prepare Reply').first().json.reply }}"),
      additionalFields: {},
    },
    credentials: { whatsAppApi: newCredential('WhatsApp account') },
    position: [1820, 120],
  },
  output: [{ messaging_product: 'whatsapp', messages: [{ id: 'wamid.XYZ' }] }],
});

const buildOutboundLog = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Outbound Log',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const pr = $('Prepare Reply').first().json;
const send = $input.first().json || {};
let wamid = '';
try { wamid = send.messages[0].id; } catch (e) { wamid = ''; }
const messages = [{ wamid: wamid, role: 'assistant', text: pr.reply }];
return [{ json: { phone: pr.phone, messages: JSON.stringify(messages) } }];`,
    },
    position: [2040, 120],
  },
  output: [{ phone: '962790000000', messages: '[]' }],
});

const logOutbound = node({
  type: 'n8n-nodes-base.executeWorkflow',
  version: 1.3,
  config: {
    name: 'Log Outbound',
    parameters: {
      workflowId: LOG_WF,
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: { phone: expr('{{ $json.phone }}'), messages: expr('{{ $json.messages }}') },
        matchingColumns: [],
        schema: LOG_INPUT_SCHEMA,
        attemptToConvertTypes: false,
        convertFieldsToString: true,
      },
      options: { waitForSubWorkflow: true },
    },
    position: [2260, 120],
  },
  output: [{ phone: '962790000000', history: '[]' }],
});

const logTelegram = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Log to Telegram',
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: '211021550',
      text: expr("واتساب من {{ $('Prepare Reply').first().json.phone }}:\n{{ $('Claim & Assemble').first().json.assembledText }}\n\nالتصنيف: {{ $('Prepare Reply').first().json.intent }}\nالرد: {{ $('Prepare Reply').first().json.reply }}"),
      additionalFields: { appendAttribution: false },
    },
    credentials: { telegramApi: newCredential('Telegram account') },
    position: [2480, 120],
  },
  output: [{ ok: true }],
});

const classify = switchCase({
  version: 3.4,
  config: {
    name: 'Switch Classification',
    parameters: {
      rules: {
        values: [
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 3 },
              conditions: [{ id: 'c1', leftValue: expr('{{ $json.intent.toLowerCase() }}'), rightValue: 'medical', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'medical',
          },
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 3 },
              conditions: [{ id: 'c2', leftValue: expr('{{ $json.intent.toLowerCase() }}'), rightValue: 'administrative', operator: { type: 'string', operation: 'equals' } }],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'administrative',
          },
        ],
      },
      looseTypeValidation: true,
      options: {},
    },
    position: [1600, 380],
  },
});

const sendToDoctor = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Send to Doctor',
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: '1491333235',
      text: expr("رسالة طبية من الرقم {{ $('Prepare Reply').first().json.phone }}:\n{{ $('Claim & Assemble').first().json.assembledText }}"),
      additionalFields: { appendAttribution: false },
    },
    credentials: { telegramApi: newCredential('Telegram account') },
    position: [1820, 320],
  },
  output: [{ ok: true }],
});

const sendToAssistant = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Send to Assistant',
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: '7859418734',
      text: expr("رسالة إدارية من الرقم {{ $('Prepare Reply').first().json.phone }}:\n{{ $('Claim & Assemble').first().json.assembledText }}"),
      additionalFields: { appendAttribution: false },
    },
    credentials: { telegramApi: newCredential('Telegram account') },
    position: [1820, 460],
  },
  output: [{ ok: true }],
});

const splitConsumed = node({
  type: 'n8n-nodes-base.splitOut',
  version: 1,
  config: {
    name: 'Split Consumed Ids',
    parameters: {
      fieldToSplitOut: 'consumedMsgIds',
      include: 'noOtherFields',
      options: { destinationFieldName: 'msg_id' },
    },
    position: [280, 380],
  },
  output: [{ msg_id: 'wamid.ABC' }],
});

const deleteFragment = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Delete Fragment',
    parameters: {
      operation: 'deleteRows',
      dataTableId: FRAG_TABLE,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'msg_id', condition: 'eq', keyValue: expr('{{ $json.msg_id }}') }] },
      options: {},
    },
    alwaysOutputData: true,
    position: [500, 380],
  },
  output: [{ id: 1 }],
});

export default workflow('whatsapp-ai-conversation', 'Dads Clinic-WhatsApp AI Conversation')
  .add(subflowTrigger)
  .to(normalizeInput)
  .to(appendFragment)
  .to(debounceWait)
  .to(getFragments)
  .to(claimAssemble)
  .to(loadHistory)
  .to(buildInboundLog)
  .to(logInbound)
  .to(loadKnowledge)
  .to(buildPrompt)
  .to(clinicAgent)
  .to(prepareReply)
  .to(sendWhatsApp)
  .to(buildOutboundLog)
  .to(logOutbound)
  .to(logTelegram)
  .add(prepareReply)
  .to(classify.onCase(0, sendToDoctor).onCase(1, sendToAssistant))
  .add(claimAssemble)
  .to(splitConsumed)
  .to(deleteFragment);
