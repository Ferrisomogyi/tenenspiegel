/* Toe Reading · hulpbot "Vraag het ons" · knop.js v1.0 (2 nov 2026, hoort bij app v9.21.0 en worker v3.7.2)
   Zwevend knopje rechtsonder + venster. Gesprek alleen in het geheugen van deze pagina (localStorage alleen voor de dagteller en de testvlag).
   Vangnet: bij 429/451/503/offline toont het venster de veelgestelde vragen uit /hulp/kennis_<taal>.json.
   ZICHTBAAR = false: knop alleen zichtbaar met ?hulp=1 (onthouden op dit toestel; ?hulp=0 zet het uit).
   Na de toetsset: ZICHTBAAR = true zetten en alleen dit bestand opnieuw uploaden. */
(function () {
  'use strict';
  if (window.__hulpKnop) return; window.__hulpKnop = 1;
  var ZICHTBAAR = true; // 3 nov 2026 15:27: zichtbaar na toetsset (worker v3.7.6, kennis v5)
  var WORKER = 'https://tenenspiegel-ai.ferri-a8a.workers.dev/hulp';
  var MAIL = 'support@toereading.com';
  var MAX_DAG = 20;
  try {
    var q = new URLSearchParams(location.search).get('hulp');
    if (q === '1') localStorage.hulp_test = '1';
    if (q === '0') localStorage.removeItem('hulp_test');
    if (localStorage.hulp_test === '1') ZICHTBAAR = true;
  } catch (e) {}
  if (!ZICHTBAAR) return;

  var S = {
    nl: { k: 'Vraag het ons', w: 'Hoi! Stel hier je vraag over de app, je tegoed, betalen of privacy. Ik antwoord op basis van onze site.', ph: 'Typ je vraag…', s: 'Verstuur', b: 'Even zoeken…', x: 'Sluiten', d: 'Automatisch antwoord op basis van onze site. Bij twijfel geldt de tekst van de voorwaarden.', l: 'Je hebt vandaag het maximum aantal vragen gesteld. Hieronder staan de veelgestelde vragen.', f: 'De hulpbot is nu even niet bereikbaar. Hieronder staan de veelgestelde vragen.', o: 'Je bent offline. Hieronder staan de veelgestelde vragen.', g: 'De hulpbot is in jouw regio niet beschikbaar. Hieronder staan de veelgestelde vragen.', q: 'Veelgestelde vragen', m: 'Mail ons', n: 'Nieuw gesprek' },
    en: { k: 'Ask us', w: 'Hi! Ask your question about the app, your credit, payments or privacy here. I answer based on our website.', ph: 'Type your question…', s: 'Send', b: 'Looking it up…', x: 'Close', d: 'Automatic answer based on our website. If in doubt, the text of the terms applies.', l: 'You have reached today’s maximum number of questions. The frequently asked questions are below.', f: 'The help bot can’t be reached right now. The frequently asked questions are below.', o: 'You are offline. The frequently asked questions are below.', g: 'The help bot is not available in your region. The frequently asked questions are below.', q: 'Frequently asked questions', m: 'Email us', n: 'New conversation' },
    de: { k: 'Frag uns', w: 'Hallo! Stell hier deine Frage zur App, zu deinem Guthaben, zum Bezahlen oder zum Datenschutz. Ich antworte auf Grundlage unserer Website.', ph: 'Schreib deine Frage…', s: 'Senden', b: 'Ich suche…', x: 'Schließen', d: 'Automatische Antwort auf Grundlage unserer Website. Im Zweifel gilt der Text der Bedingungen.', l: 'Du hast heute die maximale Anzahl an Fragen gestellt. Unten findest du die häufigen Fragen.', f: 'Der Hilfe-Bot ist gerade nicht erreichbar. Unten findest du die häufigen Fragen.', o: 'Du bist offline. Unten findest du die häufigen Fragen.', g: 'Der Hilfe-Bot ist in deiner Region nicht verfügbar. Unten findest du die häufigen Fragen.', q: 'Häufige Fragen', m: 'Schreib uns', n: 'Neues Gespräch' },
    fr: { k: 'Demande-nous', w: 'Bonjour ! Pose ici ta question sur l’appli, ton crédit, le paiement ou la confidentialité. Je réponds à partir de notre site.', ph: 'Écris ta question…', s: 'Envoyer', b: 'Je cherche…', x: 'Fermer', d: 'Réponse automatique basée sur notre site. En cas de doute, le texte des conditions fait foi.', l: 'Tu as atteint le nombre maximum de questions pour aujourd’hui. Les questions fréquentes sont ci-dessous.', f: 'Le robot d’aide est momentanément indisponible. Les questions fréquentes sont ci-dessous.', o: 'Tu es hors ligne. Les questions fréquentes sont ci-dessous.', g: 'Le robot d’aide n’est pas disponible dans ta région. Les questions fréquentes sont ci-dessous.', q: 'Questions fréquentes', m: 'Écris-nous', n: 'Nouvelle conversation' },
    es: { k: 'Pregúntanos', w: '¡Hola! Haz aquí tu pregunta sobre la app, tu saldo, los pagos o la privacidad. Respondo según nuestra web.', ph: 'Escribe tu pregunta…', s: 'Enviar', b: 'Buscando…', x: 'Cerrar', d: 'Respuesta automática basada en nuestra web. En caso de duda, vale el texto de las condiciones.', l: 'Hoy ya has hecho el número máximo de preguntas. Abajo tienes las preguntas frecuentes.', f: 'El asistente no está disponible ahora mismo. Abajo tienes las preguntas frecuentes.', o: 'Estás sin conexión. Abajo tienes las preguntas frecuentes.', g: 'El asistente no está disponible en tu región. Abajo tienes las preguntas frecuentes.', q: 'Preguntas frecuentes', m: 'Escríbenos', n: 'Nueva conversación' },
    it: { k: 'Chiedici', w: 'Ciao! Fai qui la tua domanda sull’app, sul tuo credito, sui pagamenti o sulla privacy. Rispondo in base al nostro sito.', ph: 'Scrivi la tua domanda…', s: 'Invia', b: 'Sto cercando…', x: 'Chiudi', d: 'Risposta automatica basata sul nostro sito. In caso di dubbio vale il testo delle condizioni.', l: 'Oggi hai raggiunto il numero massimo di domande. Qui sotto trovi le domande frequenti.', f: 'L’assistente non è raggiungibile in questo momento. Qui sotto trovi le domande frequenti.', o: 'Sei offline. Qui sotto trovi le domande frequenti.', g: 'L’assistente non è disponibile nella tua regione. Qui sotto trovi le domande frequenti.', q: 'Domande frequenti', m: 'Scrivici', n: 'Nuova conversazione' },
    pt: { k: 'Pergunta-nos', w: 'Olá! Faz aqui a tua pergunta sobre a app, o teu saldo, pagamentos ou privacidade. Respondo com base no nosso site.', ph: 'Escreve a tua pergunta…', s: 'Enviar', b: 'A procurar…', x: 'Fechar', d: 'Resposta automática com base no nosso site. Em caso de dúvida, vale o texto dos termos.', l: 'Hoje já fizeste o número máximo de perguntas. Em baixo estão as perguntas frequentes.', f: 'O assistente não está disponível neste momento. Em baixo estão as perguntas frequentes.', o: 'Estás offline. Em baixo estão as perguntas frequentes.', g: 'O assistente não está disponível na tua região. Em baixo estão as perguntas frequentes.', q: 'Perguntas frequentes', m: 'Escreve-nos', n: 'Nova conversa' },
    pl: { k: 'Zapytaj nas', w: 'Cześć! Zadaj tu pytanie o aplikację, swój kredyt, płatności lub prywatność. Odpowiadam na podstawie naszej strony.', ph: 'Wpisz pytanie…', s: 'Wyślij', b: 'Szukam…', x: 'Zamknij', d: 'Automatyczna odpowiedź na podstawie naszej strony. W razie wątpliwości obowiązuje treść regulaminu.', l: 'Zadałeś dziś maksymalną liczbę pytań. Poniżej znajdziesz najczęstsze pytania.', f: 'Asystent jest teraz niedostępny. Poniżej znajdziesz najczęstsze pytania.', o: 'Jesteś offline. Poniżej znajdziesz najczęstsze pytania.', g: 'Asystent nie jest dostępny w twoim regionie. Poniżej znajdziesz najczęstsze pytania.', q: 'Najczęstsze pytania', m: 'Napisz do nas', n: 'Nowa rozmowa' },
    ru: { k: 'Спроси нас', w: 'Привет! Задай здесь вопрос о приложении, балансе, оплате или конфиденциальности. Я отвечаю по материалам нашего сайта.', ph: 'Напиши свой вопрос…', s: 'Отправить', b: 'Ищу…', x: 'Закрыть', d: 'Автоматический ответ по материалам нашего сайта. В спорных случаях действует текст условий.', l: 'Сегодня ты задал максимальное число вопросов. Ниже частые вопросы.', f: 'Бот помощи сейчас недоступен. Ниже частые вопросы.', o: 'Ты офлайн. Ниже частые вопросы.', g: 'Бот помощи недоступен в твоём регионе. Ниже частые вопросы.', q: 'Частые вопросы', m: 'Напиши нам', n: 'Новый разговор' },
    tr: { k: 'Bize sor', w: 'Merhaba! Uygulama, bakiyen, ödeme veya gizlilik hakkındaki sorunu buraya yaz. Sitemizdeki bilgilere göre yanıtlıyorum.', ph: 'Sorunu yaz…', s: 'Gönder', b: 'Arıyorum…', x: 'Kapat', d: 'Sitemize dayalı otomatik yanıt. Şüphe halinde koşulların metni geçerlidir.', l: 'Bugün en fazla soru sayısına ulaştın. Sık sorulan sorular aşağıda.', f: 'Yardım botuna şu anda ulaşılamıyor. Sık sorulan sorular aşağıda.', o: 'Çevrimdışısın. Sık sorulan sorular aşağıda.', g: 'Yardım botu bölgende kullanılamıyor. Sık sorulan sorular aşağıda.', q: 'Sık sorulan sorular', m: 'Bize yaz', n: 'Yeni sohbet' },
    ar: { k: 'اسألنا', w: 'مرحبًا! اكتب هنا سؤالك عن التطبيق أو رصيدك أو الدفع أو الخصوصية. أجيب بناءً على موقعنا.', ph: 'اكتب سؤالك…', s: 'إرسال', b: 'أبحث…', x: 'إغلاق', d: 'إجابة تلقائية مبنية على موقعنا. عند الشك يُعتمد نص الشروط.', l: 'لقد وصلت اليوم إلى الحد الأقصى من الأسئلة. الأسئلة الشائعة في الأسفل.', f: 'روبوت المساعدة غير متاح الآن. الأسئلة الشائعة في الأسفل.', o: 'أنت غير متصل. الأسئلة الشائعة في الأسفل.', g: 'روبوت المساعدة غير متاح في منطقتك. الأسئلة الشائعة في الأسفل.', q: 'الأسئلة الشائعة', m: 'راسلنا', n: 'محادثة جديدة' },
    zh: { k: '问我们', w: '你好！在这里提问关于应用、额度、付款或隐私的问题。我会根据我们网站上的内容回答。', ph: '输入你的问题…', s: '发送', b: '正在查找…', x: '关闭', d: '根据我们网站内容自动回答。如有疑问，以条款原文为准。', l: '你今天的提问次数已达上限。下面是常见问题。', f: '帮助机器人暂时无法使用。下面是常见问题。', o: '你目前处于离线状态。下面是常见问题。', g: '帮助机器人在你所在的地区不可用。下面是常见问题。', q: '常见问题', m: '给我们发邮件', n: '新对话' },
    zht: { k: '問我們', w: '你好！在這裡提問關於應用程式、額度、付款或隱私的問題。我會根據我們網站上的內容回答。', ph: '輸入你的問題…', s: '傳送', b: '正在查找…', x: '關閉', d: '根據我們網站內容自動回答。如有疑問，以條款原文為準。', l: '你今天的提問次數已達上限。下面是常見問題。', f: '幫助機器人暫時無法使用。下面是常見問題。', o: '你目前處於離線狀態。下面是常見問題。', g: '幫助機器人在你所在的地區無法使用。下面是常見問題。', q: '常見問題', m: '寄信給我們', n: '新對話' },
    ja: { k: '質問する', w: 'こんにちは！アプリ、クレジット、支払い、プライバシーについての質問をここに書いてください。当サイトの内容をもとにお答えします。', ph: '質問を入力…', s: '送信', b: '調べています…', x: '閉じる', d: '当サイトの内容にもとづく自動回答です。疑問がある場合は規約の文言が優先されます。', l: '今日の質問数の上限に達しました。よくある質問は下にあります。', f: 'ヘルプボットは現在利用できません。よくある質問は下にあります。', o: 'オフラインです。よくある質問は下にあります。', g: 'ヘルプボットはお住まいの地域では利用できません。よくある質問は下にあります。', q: 'よくある質問', m: 'メールする', n: '新しい会話' },
    ko: { k: '물어보기', w: '안녕! 앱, 크레딧, 결제, 개인정보에 대한 질문을 여기에 남겨 줘. 우리 사이트 내용을 바탕으로 답할게.', ph: '질문을 입력해 줘…', s: '보내기', b: '찾는 중…', x: '닫기', d: '우리 사이트를 바탕으로 한 자동 답변이야. 애매할 때는 약관 원문이 우선이야.', l: '오늘 질문할 수 있는 최대 횟수에 도달했어. 자주 묻는 질문은 아래에 있어.', f: '지금은 도움 봇에 연결할 수 없어. 자주 묻는 질문은 아래에 있어.', o: '오프라인 상태야. 자주 묻는 질문은 아래에 있어.', g: '네 지역에서는 도움 봇을 쓸 수 없어. 자주 묻는 질문은 아래에 있어.', q: '자주 묻는 질문', m: '메일 보내기', n: '새 대화' },
    hi: { k: 'हमसे पूछो', w: 'नमस्ते! ऐप, अपने क्रेडिट, भुगतान या प्राइवेसी के बारे में अपना सवाल यहाँ पूछो। मैं हमारी साइट के आधार पर जवाब देता हूँ।', ph: 'अपना सवाल लिखो…', s: 'भेजो', b: 'खोज रहा हूँ…', x: 'बंद करो', d: 'हमारी साइट पर आधारित अपने-आप दिया गया जवाब। शक होने पर शर्तों का पाठ मान्य है।', l: 'आज तुमने सवालों की अधिकतम संख्या पूरी कर ली है। नीचे अक्सर पूछे जाने वाले सवाल हैं।', f: 'मदद बॉट अभी उपलब्ध नहीं है। नीचे अक्सर पूछे जाने वाले सवाल हैं।', o: 'तुम ऑफ़लाइन हो। नीचे अक्सर पूछे जाने वाले सवाल हैं।', g: 'मदद बॉट तुम्हारे क्षेत्र में उपलब्ध नहीं है। नीचे अक्सर पूछे जाने वाले सवाल हैं।', q: 'अक्सर पूछे जाने वाले सवाल', m: 'हमें मेल करो', n: 'नई बातचीत' },
    id: { k: 'Tanya kami', w: 'Hai! Tulis pertanyaanmu tentang aplikasi, saldo, pembayaran, atau privasi di sini. Aku menjawab berdasarkan situs kami.', ph: 'Ketik pertanyaanmu…', s: 'Kirim', b: 'Sedang mencari…', x: 'Tutup', d: 'Jawaban otomatis berdasarkan situs kami. Jika ragu, yang berlaku adalah teks ketentuan.', l: 'Hari ini kamu sudah mencapai batas jumlah pertanyaan. Pertanyaan umum ada di bawah.', f: 'Bot bantuan sedang tidak bisa dihubungi. Pertanyaan umum ada di bawah.', o: 'Kamu sedang offline. Pertanyaan umum ada di bawah.', g: 'Bot bantuan tidak tersedia di wilayahmu. Pertanyaan umum ada di bawah.', q: 'Pertanyaan umum', m: 'Email kami', n: 'Percakapan baru' },
    vi: { k: 'Hỏi chúng tôi', w: 'Chào bạn! Hãy đặt câu hỏi về ứng dụng, số dư, thanh toán hoặc quyền riêng tư tại đây. Mình trả lời dựa trên trang web của chúng tôi.', ph: 'Nhập câu hỏi của bạn…', s: 'Gửi', b: 'Đang tìm…', x: 'Đóng', d: 'Câu trả lời tự động dựa trên trang web của chúng tôi. Khi có nghi ngờ, văn bản điều khoản được áp dụng.', l: 'Hôm nay bạn đã hỏi đến giới hạn. Câu hỏi thường gặp ở bên dưới.', f: 'Bot hỗ trợ hiện không truy cập được. Câu hỏi thường gặp ở bên dưới.', o: 'Bạn đang ngoại tuyến. Câu hỏi thường gặp ở bên dưới.', g: 'Bot hỗ trợ không khả dụng ở khu vực của bạn. Câu hỏi thường gặp ở bên dưới.', q: 'Câu hỏi thường gặp', m: 'Gửi email cho chúng tôi', n: 'Cuộc trò chuyện mới' },
    th: { k: 'ถามเรา', w: 'สวัสดี! ถามเรื่องแอป เครดิต การชำระเงิน หรือความเป็นส่วนตัวได้ที่นี่ ฉันตอบจากข้อมูลบนเว็บไซต์ของเรา', ph: 'พิมพ์คำถามของคุณ…', s: 'ส่ง', b: 'กำลังค้นหา…', x: 'ปิด', d: 'คำตอบอัตโนมัติจากเว็บไซต์ของเรา หากมีข้อสงสัยให้ยึดข้อความในข้อกำหนด', l: 'วันนี้คุณถามครบจำนวนสูงสุดแล้ว คำถามที่พบบ่อยอยู่ด้านล่าง', f: 'ตอนนี้บอตช่วยเหลือใช้งานไม่ได้ คำถามที่พบบ่อยอยู่ด้านล่าง', o: 'คุณออฟไลน์อยู่ คำถามที่พบบ่อยอยู่ด้านล่าง', g: 'บอตช่วยเหลือไม่พร้อมใช้งานในภูมิภาคของคุณ คำถามที่พบบ่อยอยู่ด้านล่าง', q: 'คำถามที่พบบ่อย', m: 'อีเมลหาเรา', n: 'เริ่มบทสนทนาใหม่' },
    uk: { k: 'Запитай нас', w: 'Привіт! Постав тут запитання про застосунок, баланс, оплату чи конфіденційність. Я відповідаю на основі нашого сайту.', ph: 'Напиши своє запитання…', s: 'Надіслати', b: 'Шукаю…', x: 'Закрити', d: 'Автоматична відповідь на основі нашого сайту. У разі сумніву чинний текст умов.', l: 'Сьогодні ти вже поставив максимальну кількість запитань. Нижче поширені запитання.', f: 'Бот допомоги зараз недоступний. Нижче поширені запитання.', o: 'Ти офлайн. Нижче поширені запитання.', g: 'Бот допомоги недоступний у твоєму регіоні. Нижче поширені запитання.', q: 'Поширені запитання', m: 'Напиши нам', n: 'Нова розмова' },
    hu: { k: 'Kérdezz minket', w: 'Szia! Itt kérdezhetsz az appról, a kreditedről, a fizetésről vagy az adatvédelemről. Az oldalunk alapján válaszolok.', ph: 'Írd be a kérdésed…', s: 'Küldés', b: 'Keresem…', x: 'Bezárás', d: 'Automatikus válasz az oldalunk alapján. Kétség esetén a feltételek szövege az irányadó.', l: 'Ma elérted a kérdések maximális számát. Lent találod a gyakori kérdéseket.', f: 'A súgóbot most nem érhető el. Lent találod a gyakori kérdéseket.', o: 'Offline vagy. Lent találod a gyakori kérdéseket.', g: 'A súgóbot a régiódban nem érhető el. Lent találod a gyakori kérdéseket.', q: 'Gyakori kérdések', m: 'Írj nekünk', n: 'Új beszélgetés' },
    bn: { k: 'আমাদের জিজ্ঞেস করো', w: 'হাই! অ্যাপ, তোমার ক্রেডিট, পেমেন্ট বা প্রাইভেসি নিয়ে প্রশ্ন এখানে করো। আমি আমাদের সাইটের তথ্য দিয়ে উত্তর দিই।', ph: 'তোমার প্রশ্ন লেখো…', s: 'পাঠাও', b: 'খুঁজছি…', x: 'বন্ধ করো', d: 'আমাদের সাইটের ভিত্তিতে স্বয়ংক্রিয় উত্তর। সন্দেহ হলে শর্তাবলির লেখাই প্রযোজ্য।', l: 'আজ তুমি সর্বোচ্চ সংখ্যক প্রশ্ন করে ফেলেছ। নিচে সাধারণ প্রশ্নগুলো আছে।', f: 'সাহায্য বট এখন পাওয়া যাচ্ছে না। নিচে সাধারণ প্রশ্নগুলো আছে।', o: 'তুমি অফলাইনে আছ। নিচে সাধারণ প্রশ্নগুলো আছে।', g: 'তোমার অঞ্চলে সাহায্য বট পাওয়া যায় না। নিচে সাধারণ প্রশ্নগুলো আছে।', q: 'সাধারণ প্রশ্ন', m: 'আমাদের মেইল করো', n: 'নতুন কথোপকথন' },
    ur: { k: 'ہم سے پوچھیں', w: 'ہیلو! ایپ، اپنے کریڈٹ، ادائیگی یا رازداری کے بارے میں اپنا سوال یہاں پوچھیں۔ میں ہماری سائٹ کی بنیاد پر جواب دیتا ہوں۔', ph: 'اپنا سوال لکھیں…', s: 'بھیجیں', b: 'تلاش کر رہا ہوں…', x: 'بند کریں', d: 'ہماری سائٹ پر مبنی خودکار جواب۔ شک کی صورت میں شرائط کا متن معتبر ہے۔', l: 'آج آپ سوالوں کی زیادہ سے زیادہ تعداد تک پہنچ گئے ہیں۔ عام سوالات نیچے ہیں۔', f: 'مدد بوٹ اس وقت دستیاب نہیں۔ عام سوالات نیچے ہیں۔', o: 'آپ آف لائن ہیں۔ عام سوالات نیچے ہیں۔', g: 'مدد بوٹ آپ کے علاقے میں دستیاب نہیں۔ عام سوالات نیچے ہیں۔', q: 'عام سوالات', m: 'ہمیں ای میل کریں', n: 'نئی گفتگو' },
    fa: { k: 'از ما بپرس', w: 'سلام! سؤالت درباره‌ی اپ، اعتبار، پرداخت یا حریم خصوصی را اینجا بپرس. بر اساس محتوای سایت‌مان جواب می‌دهم.', ph: 'سؤالت را بنویس…', s: 'ارسال', b: 'در حال جست‌وجو…', x: 'بستن', d: 'پاسخ خودکار بر اساس سایت ما. در صورت تردید، متن شرایط ملاک است.', l: 'امروز به حداکثر تعداد سؤال رسیده‌ای. پرسش‌های پرتکرار در پایین هستند.', f: 'ربات راهنما الان در دسترس نیست. پرسش‌های پرتکرار در پایین هستند.', o: 'آفلاین هستی. پرسش‌های پرتکرار در پایین هستند.', g: 'ربات راهنما در منطقه‌ی تو در دسترس نیست. پرسش‌های پرتکرار در پایین هستند.', q: 'پرسش‌های پرتکرار', m: 'به ما ایمیل بزن', n: 'گفت‌وگوی تازه' },
    ms: { k: 'Tanya kami', w: 'Hai! Tanya soalan anda tentang aplikasi, kredit, pembayaran atau privasi di sini. Saya menjawab berdasarkan laman web kami.', ph: 'Taip soalan anda…', s: 'Hantar', b: 'Sedang mencari…', x: 'Tutup', d: 'Jawapan automatik berdasarkan laman web kami. Jika ragu, teks terma yang terpakai.', l: 'Anda sudah mencapai had soalan untuk hari ini. Soalan lazim ada di bawah.', f: 'Bot bantuan tidak dapat dihubungi sekarang. Soalan lazim ada di bawah.', o: 'Anda di luar talian. Soalan lazim ada di bawah.', g: 'Bot bantuan tidak tersedia di rantau anda. Soalan lazim ada di bawah.', q: 'Soalan lazim', m: 'E-mel kami', n: 'Perbualan baharu' },
    tl: { k: 'Magtanong sa amin', w: 'Hi! Itanong dito ang tungkol sa app, sa credit mo, sa pagbabayad o sa privacy. Sumasagot ako batay sa aming site.', ph: 'I-type ang tanong mo…', s: 'Ipadala', b: 'Hinahanap…', x: 'Isara', d: 'Awtomatikong sagot batay sa aming site. Kapag may duda, ang teksto ng mga tuntunin ang masusunod.', l: 'Naabot mo na ang maximum na bilang ng tanong ngayong araw. Nasa ibaba ang mga madalas itanong.', f: 'Hindi maabot ang help bot ngayon. Nasa ibaba ang mga madalas itanong.', o: 'Offline ka. Nasa ibaba ang mga madalas itanong.', g: 'Hindi available ang help bot sa rehiyon mo. Nasa ibaba ang mga madalas itanong.', q: 'Mga madalas itanong', m: 'Mag-email sa amin', n: 'Bagong usapan' },
    el: { k: 'Ρώτα μας', w: 'Γεια! Κάνε εδώ την ερώτησή σου για την εφαρμογή, το υπόλοιπό σου, τις πληρωμές ή το απόρρητο. Απαντώ με βάση τον ιστότοπό μας.', ph: 'Γράψε την ερώτησή σου…', s: 'Αποστολή', b: 'Ψάχνω…', x: 'Κλείσιμο', d: 'Αυτόματη απάντηση με βάση τον ιστότοπό μας. Σε περίπτωση αμφιβολίας ισχύει το κείμενο των όρων.', l: 'Σήμερα έφτασες τον μέγιστο αριθμό ερωτήσεων. Παρακάτω είναι οι συχνές ερωτήσεις.', f: 'Το ρομπότ βοήθειας δεν είναι διαθέσιμο αυτή τη στιγμή. Παρακάτω είναι οι συχνές ερωτήσεις.', o: 'Είσαι εκτός σύνδεσης. Παρακάτω είναι οι συχνές ερωτήσεις.', g: 'Το ρομπότ βοήθειας δεν είναι διαθέσιμο στην περιοχή σου. Παρακάτω είναι οι συχνές ερωτήσεις.', q: 'Συχνές ερωτήσεις', m: 'Στείλε μας email', n: 'Νέα συζήτηση' },
    cs: { k: 'Zeptej se nás', w: 'Ahoj! Zeptej se tu na aplikaci, svůj kredit, platby nebo soukromí. Odpovídám podle našeho webu.', ph: 'Napiš svou otázku…', s: 'Odeslat', b: 'Hledám…', x: 'Zavřít', d: 'Automatická odpověď podle našeho webu. V případě pochybností platí text podmínek.', l: 'Dnes jsi už položil maximální počet otázek. Časté otázky najdeš níže.', f: 'Pomocník je teď nedostupný. Časté otázky najdeš níže.', o: 'Jsi offline. Časté otázky najdeš níže.', g: 'Pomocník není ve tvém regionu dostupný. Časté otázky najdeš níže.', q: 'Časté otázky', m: 'Napiš nám', n: 'Nová konverzace' },
    ro: { k: 'Întreabă-ne', w: 'Salut! Pune aici întrebarea ta despre aplicație, creditul tău, plăți sau confidențialitate. Răspund pe baza site-ului nostru.', ph: 'Scrie întrebarea ta…', s: 'Trimite', b: 'Caut…', x: 'Închide', d: 'Răspuns automat pe baza site-ului nostru. În caz de dubiu, se aplică textul condițiilor.', l: 'Azi ai ajuns la numărul maxim de întrebări. Întrebările frecvente sunt mai jos.', f: 'Asistentul nu este disponibil acum. Întrebările frecvente sunt mai jos.', o: 'Ești offline. Întrebările frecvente sunt mai jos.', g: 'Asistentul nu este disponibil în regiunea ta. Întrebările frecvente sunt mai jos.', q: 'Întrebări frecvente', m: 'Scrie-ne', n: 'Conversație nouă' },
    sv: { k: 'Fråga oss', w: 'Hej! Ställ din fråga om appen, ditt saldo, betalning eller integritet här. Jag svarar utifrån vår webbplats.', ph: 'Skriv din fråga…', s: 'Skicka', b: 'Letar…', x: 'Stäng', d: 'Automatiskt svar utifrån vår webbplats. Vid tveksamhet gäller texten i villkoren.', l: 'Du har nått dagens maxantal frågor. Vanliga frågor finns nedan.', f: 'Hjälpboten går inte att nå just nu. Vanliga frågor finns nedan.', o: 'Du är offline. Vanliga frågor finns nedan.', g: 'Hjälpboten är inte tillgänglig i din region. Vanliga frågor finns nedan.', q: 'Vanliga frågor', m: 'Mejla oss', n: 'Nytt samtal' }
  };
  var RTL = { ar: 1, ur: 1, fa: 1 };

  function taal() {
    var t = '';
    try { if (typeof TAAL !== 'undefined' && TAAL) t = TAAL; } catch (e) {}
    if (!t) t = document.documentElement.getAttribute('data-taal') || '';
    if (!t) { try { t = localStorage.taal || ''; } catch (e) {} }
    return S[t] ? t : 'en';
  }
  function tx(k) { var t = taal(); return (S[t] && S[t][k]) || S.en[k]; }
  function scherm() {
    var p = location.pathname.replace(/^\/|\.html$/g, '') || 'app';
    if (p === 'index') p = 'app';
    if (p !== 'app') return p;
    var ov = Array.prototype.slice.call(document.querySelectorAll('[id$="Overlay"]')).filter(function (e) { return e.offsetParent !== null; })[0];
    return ov ? ov.id.replace(/Overlay$/, '') : 'app';
  }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    for (var a in (attrs || {})) { if (a === 'text') e.textContent = attrs[a]; else e.setAttribute(a, attrs[a]); }
    (kids || []).forEach(function (k) { if (k) e.appendChild(k); });
    return e;
  }

  var css = '#hulpKnop{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:9000;display:flex;align-items:center;gap:8px;' +
    'border:1px solid var(--lijn,#CBBD9F);background:var(--kaart,#FBF7EC);color:var(--inkt,#2B2118);border-radius:999px;padding:10px 16px 10px 12px;font-family:inherit;font-weight:600;font-size:15px;line-height:1.1;box-shadow:0 4px 14px rgba(43,33,24,.18);cursor:pointer}' +
    '#hulpKnop:focus-visible,#hulpVenster button:focus-visible,#hulpVenster textarea:focus-visible{outline:3px solid var(--ether,#4C5B9E);outline-offset:2px}' +
    '#hulpKnop svg{width:22px;height:22px;flex:none}' +
    '#hulpVenster{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));z-index:9001;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100dvh - 24px));display:flex;flex-direction:column;' +
    'background:var(--kaart,#FBF7EC);color:var(--inkt,#2B2118);border:1px solid var(--lijn,#CBBD9F);border-radius:16px;box-shadow:0 12px 40px rgba(43,33,24,.28);font-family:inherit;overflow:hidden}' +
    '#hulpVenster[hidden]{display:none}#hulpVenster header{display:flex;align-items:center;gap:8px;padding:12px 12px 10px 16px;border-bottom:1px solid var(--lijn-zacht,#DCD2BA)}' +
    '#hulpVenster h2{flex:1;margin:0;font-size:17px}#hulpVenster header button{border:0;background:none;color:inherit;font-size:22px;line-height:1;padding:6px 8px;cursor:pointer;border-radius:8px}' +
    '#hulpVenster .hl-nieuw{font-size:13px!important;text-decoration:underline}' +
    '#hulpLog{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px}' +
    '#hulpLog .hl-b{max-width:88%;padding:9px 12px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word;font-size:15px;line-height:1.45}' +
    '#hulpLog .hl-bot{align-self:flex-start;background:var(--papier,#EFE8D8)}#hulpLog .hl-ik{align-self:flex-end;background:var(--ether,#4C5B9E);color:#fff}' +
    '#hulpLog .hl-bezig{opacity:.7;font-style:italic}#hulpLog .hl-faq{font-size:14px}#hulpLog .hl-faq h3{font-size:15px;margin:4px 0 6px}#hulpLog details{margin:0 0 6px;border-bottom:1px solid var(--lijn-zacht,#DCD2BA);padding:4px 0}' +
    '#hulpLog summary{cursor:pointer;font-weight:600}#hulpLog details p{margin:6px 0 4px;white-space:pre-wrap}#hulpLog a{color:var(--ether,#4C5B9E)}' +
    '#hulpVenster form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--lijn-zacht,#DCD2BA)}' +
    '#hulpVenster textarea{flex:1;resize:none;height:44px;max-height:120px;border:1px solid var(--lijn,#CBBD9F);border-radius:10px;padding:10px;font:inherit;font-size:15px;background:#fff;color:inherit}' +
    '#hulpVenster form button{border:0;border-radius:10px;padding:0 14px;background:var(--inkt,#2B2118);color:#fff;font:inherit;font-weight:600;cursor:pointer}#hulpVenster form button:disabled{opacity:.5}' +
    '#hulpVenster .hl-disc{font-size:12px;color:var(--inkt-zacht,#6B5D4A);padding:0 14px 10px;margin:0}' +
    '@media print{#hulpKnop,#hulpVenster{display:none!important}}';
  var ICOON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/><path d="M9.6 9.5a2.4 2.4 0 0 1 4.7.6c0 1.6-2.3 2-2.3 3.4"/><path d="M12 16.6h.01"/></svg>';

  var gesprek = [], knop, venster, log, invoer, verstuur, titel, disc, nieuw, sluit, bezig = false, laatsteFocus = null, faqGetoond = false;

  function teller(plus) {
    var d = new Date().toISOString().slice(0, 10), o = { d: d, n: 0 };
    try { o = JSON.parse(localStorage.hulp_n || '{}'); if (o.d !== d) o = { d: d, n: 0 }; } catch (e) { o = { d: d, n: 0 }; }
    if (plus) { o.n++; try { localStorage.hulp_n = JSON.stringify(o); } catch (e) {} }
    return o.n;
  }
  function bericht(tekst, wie, extra) {
    var b = el('div', { 'class': 'hl-b ' + (wie === 'ik' ? 'hl-ik' : 'hl-bot') + (extra ? ' ' + extra : '') });
    zetLinks(b, tekst);
    log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
  }
  function zetLinks(doel, tekst) { // tekst veilig, alleen toereading-links en support-mail klikbaar
    doel.textContent = '';
    var re = /(https:\/\/toereading\.com\/[^\s)<>"]*[^\s)<>".,;:!?]|support@toereading\.com)/g, i = 0, m;
    while ((m = re.exec(tekst))) {
      if (m.index > i) doel.appendChild(document.createTextNode(tekst.slice(i, m.index)));
      var href = m[0].indexOf('@') > 0 ? 'mailto:' + m[0] : m[0];
      doel.appendChild(el('a', { href: href, target: href.indexOf('mailto:') === 0 ? '_self' : '_blank', rel: 'noopener', text: m[0] }));
      i = m.index + m[0].length;
    }
    if (i < tekst.length) doel.appendChild(document.createTextNode(tekst.slice(i)));
  }
  function toonFaq(reden) {
    bericht(tx(reden), 'bot');
    if (faqGetoond) return; faqGetoond = true;
    var blok = el('div', { 'class': 'hl-faq' }, [el('h3', { text: tx('q') })]);
    log.appendChild(blok);
    var klaar = function (lijst) {
      (lijst || []).forEach(function (f) { var p = el('p'); zetLinks(p, f.a); blok.appendChild(el('details', {}, [el('summary', { text: f.v }), p])); });
      var mail = el('p'); mail.appendChild(el('a', { href: 'mailto:' + MAIL, text: tx('m') + ': ' + MAIL })); blok.appendChild(mail);
      log.scrollTop = log.scrollHeight;
    };
    fetch('/hulp/kennis_' + taal() + '.json').then(function (r) { return r.ok ? r.json() : {}; }).then(function (k) { klaar(k.faq); }).catch(function () { klaar([]); });
  }
  function stel(e) {
    if (e) e.preventDefault();
    var vraag = invoer.value.trim(); if (!vraag || bezig) return;
    if (!navigator.onLine) { toonFaq('o'); return; }
    if (teller() >= MAX_DAG) { toonFaq('l'); return; }
    invoer.value = ''; bericht(vraag, 'ik');
    bezig = true; verstuur.disabled = true; var wacht = bericht(tx('b'), 'bot', 'hl-bezig');
    log.setAttribute('aria-busy', 'true');
    var body = { vraag: vraag.slice(0, 500), taal: taal(), scherm: scherm(), gesprek: gesprek.slice(-6) };
    var ctrl = window.AbortController ? new AbortController() : null, tm = setTimeout(function () { if (ctrl) ctrl.abort(); }, 30000);
    teller(true);
    fetch(WORKER, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (x) {
        wacht.remove();
        if (x.s === 200 && x.j && x.j.ok && x.j.antwoord) {
          bericht(x.j.antwoord, 'bot');
          gesprek.push({ rol: 'bezoeker', tekst: vraag }, { rol: 'bot', tekst: x.j.antwoord });
        } else if (x.s === 429) toonFaq('l');
        else if (x.s === 451) toonFaq('g');
        else toonFaq('f');
      })
      .catch(function () { wacht.remove(); toonFaq(navigator.onLine ? 'f' : 'o'); })
      .then(function () { clearTimeout(tm); bezig = false; verstuur.disabled = false; log.setAttribute('aria-busy', 'false'); invoer.focus(); });
  }
  function teksten() {
    var t = taal();
    venster.setAttribute('dir', RTL[t] ? 'rtl' : 'ltr'); venster.setAttribute('lang', ({ zht: 'zh-Hant', tl: 'fil' })[t] || t);
    titel.textContent = tx('k'); invoer.placeholder = tx('ph'); invoer.setAttribute('aria-label', tx('ph'));
    verstuur.textContent = tx('s'); sluit.setAttribute('aria-label', tx('x')); sluit.title = tx('x'); nieuw.textContent = tx('n');
    disc.textContent = tx('d') + ' ';
    disc.appendChild(el('a', { href: 'mailto:' + MAIL, text: MAIL }));
    knop.querySelector('span').textContent = tx('k'); knop.setAttribute('aria-label', tx('k'));
  }
  function open() {
    laatsteFocus = document.activeElement; teksten();
    if (!log.childNodes.length) bericht(tx('w'), 'bot');
    venster.hidden = false; knop.hidden = true; knop.setAttribute('aria-expanded', 'true'); invoer.focus();
  }
  function dicht() {
    venster.hidden = true; knop.hidden = false; knop.setAttribute('aria-expanded', 'false');
    (laatsteFocus && laatsteFocus.focus ? laatsteFocus : knop).focus();
  }
  function opnieuw() { gesprek = []; faqGetoond = false; log.textContent = ''; bericht(tx('w'), 'bot'); invoer.focus(); }
  function bouw() {
    document.head.appendChild(el('style', { id: 'hulpStijl', text: css }));
    knop = el('button', { id: 'hulpKnop', type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-controls': 'hulpVenster' });
    knop.innerHTML = ICOON + '<span></span>';
    titel = el('h2', { id: 'hulpTitel' });
    nieuw = el('button', { type: 'button', 'class': 'hl-nieuw' });
    sluit = el('button', { type: 'button', text: '×' });
    log = el('div', { id: 'hulpLog', role: 'log', 'aria-live': 'polite', 'aria-busy': 'false' });
    invoer = el('textarea', { id: 'hulpInvoer', rows: '1', maxlength: '500', autocomplete: 'off' });
    verstuur = el('button', { type: 'submit' });
    var form = el('form', {}, [invoer, verstuur]);
    disc = el('p', { 'class': 'hl-disc' });
    venster = el('div', { id: 'hulpVenster', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'hulpTitel', hidden: '' }, [el('header', {}, [titel, nieuw, sluit]), log, form, disc]);
    document.body.appendChild(knop); document.body.appendChild(venster); teksten();
    knop.addEventListener('click', open); sluit.addEventListener('click', dicht); nieuw.addEventListener('click', opnieuw);
    form.addEventListener('submit', stel);
    invoer.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) stel(e); });
    venster.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); dicht(); }
      if (e.key === 'Tab') { // focus binnen het venster houden
        var f = Array.prototype.slice.call(venster.querySelectorAll('button,textarea,a[href],summary')).filter(function (x) { return x.offsetParent !== null && !x.disabled; });
        if (!f.length) return; var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.hulpOpen = open; // voor tests en eventuele links ("Vraag het ons" elders in de app)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bouw); else bouw();
})();
