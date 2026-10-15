import type { Language } from "@/lib/i18n";
import {termsSections} from "./terms";
import {privacySections} from "./privacy";
export type LegalPageId = "impressum" | "datenschutz" | "agb" | "widerruf" | "rechtliches";
export type LegalContent = {title:string;summary:string;sections:readonly (readonly [string,string])[]};
export const legalContent = {
  "impressum": {
    "de": {
      "title": "Impressum",
      "sections": [
        [
          "Anbieter nach § 5 DDG",
          "Mohammad Refat Alyoussef\nCaro Bara Werbeagentur\nFanningerstraße 20\n10365 Berlin\nDeutschland"
        ],
        [
          "Kontakt",
          "Telefon: +49 30 43021132\nE-Mail: info@carobara.de"
        ],
        [
          "Umsatzsteuer-Identifikationsnummer",
          "DE367793052"
        ],
        [
          "Hinweis zur Website",
          "Caro Bara Smart Print ist die Bezeichnung dieser Anfrageplattform. Die Plattform nimmt unverbindliche Anfragen entgegen; ein kostenpflichtiger Auftrag entsteht nicht allein durch Absenden eines Formulars."
        ]
      ],
      "summary": "Hier finden Sie den verantwortlichen Anbieter sowie die Anschrift und Kontaktdaten."
    },
    "ar": {
      "title": "بيانات المشغّل",
      "summary": "فيما يلي بيانات المشغّل المسؤول والعنوان ووسائل التواصل.",
      "sections": [
        [
          "المشغّل وفق المادة 5 من قانون الخدمات الرقمية",
          "محمد رفعت اليوسف\nCaro Bara Werbeagentur\nFanningerstraße 20\n10365 Berlin\nألمانيا"
        ],
        [
          "التواصل",
          "الهاتف: ‎+49 30 43021132\nالبريد الإلكتروني: info@carobara.de"
        ],
        [
          "رقم التعريف لضريبة القيمة المضافة",
          "DE367793052"
        ],
        [
          "توضيح بشأن الموقع",
          "Caro Bara Smart Print هو اسم منصة الاستفسارات هذه. تستقبل المنصة استفسارات غير ملزمة؛ ولا ينشأ طلب مدفوع بمجرد إرسال نموذج."
        ]
      ]
    },
    "en": {
      "title": "Legal notice",
      "summary": "The responsible provider, address and contact details are listed below.",
      "sections": [
        [
          "Provider under section 5 of the German Digital Services Act",
          "Mohammad Refat Alyoussef\nCaro Bara Werbeagentur\nFanningerstraße 20\n10365 Berlin\nGermany"
        ],
        [
          "Contact",
          "Telephone: +49 30 43021132\nEmail: info@carobara.de"
        ],
        [
          "VAT identification number",
          "DE367793052"
        ],
        [
          "About this website",
          "Caro Bara Smart Print is the name of this inquiry platform. It accepts non-binding inquiries; submitting a form alone does not create a paid order."
        ]
      ]
    }
  },
  "datenschutz": {
    "de": {
      "title": "Datenschutzerklärung",
      "sections": privacySections,
      "summary": "Diese Erklärung erläutert die Verarbeitung Ihrer Daten, die eingesetzten Dienstleister sowie Ihre Rechte und Kontaktmöglichkeiten."
    },
    "ar": {
      "title": "سياسة الخصوصية",
      "summary": "توضح هذه السياسة معالجة بياناتك ومقدمي الخدمات وحقوقك ووسائل التواصل.",
      "sections": [
        [
          "المسؤول عن معالجة البيانات",
          "Mohammad Refat Alyoussef · Caro Bara Werbeagentur · Fanningerstraße 20، 10365 Berlin، ألمانيا. البريد: info@carobara.de؛ الهاتف: ‎+49 30 43021132. يرجى استخدام هذه البيانات أيضًا لمسائل حماية البيانات."
        ],
        [
          "الموقع والبيانات الفنية",
          "عند زيارة الموقع تُعالَج بيانات الاتصال الضرورية فنيًا، مثل عنوان الإنترنت ووقت الزيارة والرابط المطلوب ومعلومات المتصفح وحالة الاستجابة، لتوفير الموقع وحمايته من إساءة الاستخدام. تُقدَّم الاستضافة عبر Vercel. الأساس القانوني هو المادة 6، الفقرة 1، البند f من اللائحة العامة لحماية البيانات؛ والمصلحة المشروعة هي التشغيل الآمن والموثوق."
        ],
        [
          "الاستفسارات والسلة والمواعيد",
          "بحسب النموذج نعالج الاسم وبيانات التواصل والعنوان والخدمات المطلوبة والمواصفات والرسالة وبيانات الموعد. الغرض هو معالجة استفسارك وإعداد العرض وتنظيم الموعد، استنادًا إلى المادة 6، الفقرة 1، البند b من اللائحة العامة لحماية البيانات. الاستفسارات العامة غير المرتبطة بعقد تُعالَج للرد عليها استنادًا إلى البند f من الفقرة نفسها. الحقول الإلزامية محددة. لا يمكن معالجة الإجراء المعني دون المعلومات الضرورية. يرجى عدم إرسال بيانات حساسة غير لازمة."
        ],
        [
          "مقدمو الخدمة والجهات المستلمة",
          "نستخدم Vercel للاستضافة وSupabase لحفظ الاستفسارات والمواعيد وResend لرسائل البريد المرتبطة بالإجراءات. يحصل كل مزوّد على البيانات اللازمة لمهمته. داخل المنشأة يتاح الوصول للأشخاص المكلفين بالمعالجة. لا تُضاف جهات أخرى، مثل التوصيل أو الاستشارة الضريبية، إلا عند الضرورة لطلب محدد أو لالتزام قانوني."
        ],
        [
          "المعالجة خارج المنطقة الاقتصادية الأوروبية",
          "يعمل المزوّدون المذكورون دوليًا؛ وقد تجري معالجة البيانات أو إتاحتها خارج المنطقة الاقتصادية الأوروبية. لا يُسمح بالنقل إلا وفق شروط المادة 44 وما يليها من اللائحة العامة لحماية البيانات. يمكنك طلب معلومات عن الضمانات المستخدمة لمعالجة محددة ونسخة منها عبر info@carobara.de. لا نضمن اقتصار تخزين البيانات على ألمانيا."
        ],
        [
          "مدة الحفظ",
          "تلزم بيانات الاستفسارات والمواعيد طوال مدة معالجتها ومتابعتها أو تسوية المطالبات المفتوحة. بعد ذلك يجب حذفها ما لم توجد واجبات حفظ قانونية أو أسباب مشروعة لاستمرار الحفظ. تخضع مستندات العقود والمحاسبة للمدد القانونية المعنية. تُستخدم السجلات الفنية للتشغيل وتوضيح الأعطال أو إساءة الاستخدام فقط. تتحدد المدة الدقيقة بحسب نوع البيانات وحالة المعالجة والمتطلبات القانونية."
        ],
        [
          "ملفات الارتباط والتخزين المحلي",
          "يحفظ الموقع محتويات السلة في التخزين المحلي للمتصفح، ويحفظ اللغة المختارة محليًا وفي ملف ارتباط تصل مدته إلى سنة. تُستخدم للإدارة المحمية ملفات ارتباط للجلسة. يمكن حذف بيانات السلة عبر إفراغ القائمة أو إعدادات المتصفح، وكذلك إعدادات اللغة عبر المتصفح. تخضع عمليات التخزين الضرورية تمامًا للمادة 25، الفقرة 2 من قانون حماية البيانات في الاتصالات والخدمات الرقمية؛ وتخضع المعالجة اللاحقة للبيانات الشخصية للأساس المناسب في اللائحة العامة لحماية البيانات. لا يجوز استخدام تقنيات التتبع غير الضرورية إلا بعد موافقة صحيحة."
        ],
        [
          "واتساب والروابط الخارجية",
          "واتساب وسيلة تواصل خارجية تختارها أنت. لا يجري التواصل عبر مزوّده ووفق شروطه إلا عند فتح الرابط أو إرسال الرسالة هناك. تحتوي الرسالة المُعدّة على البيانات التي أدخلتها. يتاح النموذج الداخلي أو البريد الإلكتروني بديلًا. تؤدي روابط الخرائط وشبكات التواصل إلى خدمات خارجية تسري لديها سياسات الخصوصية الخاصة بها."
        ],
        [
          "الإعلانات",
          "إرسال نموذج الاستفسار أو الموعد لا يمنح موافقة على الإعلانات. لا يتيح نموذج المواعيد حاليًا الاشتراك في نشرة بريدية. أي اشتراك تسويقي لاحق يحتاج معلومات منفصلة عن القناة والمحتوى وسحب الموافقة وأساسًا مشروعًا قابلًا للإثبات للإرسال. معالجة استفسارك مستقلة عن ذلك."
        ],
        [
          "حقوقك",
          "في الحدود القانونية، لك حقوق الاطلاع والتصحيح والحذف وتقييد المعالجة ونقل البيانات. يمكنك سحب موافقة سابقة للمستقبل. عند المعالجة على أساس المصلحة المشروعة يمكنك الاعتراض لأسباب تتعلق بوضعك الخاص، وعلى التسويق المباشر في أي وقت. للتواصل: info@carobara.de. يمكنك تقديم شكوى لجهة رقابة على حماية البيانات، وبخاصة مفوضة برلين لحماية البيانات وحرية المعلومات عبر www.datenschutz-berlin.de."
        ],
        [
          "القرارات الآلية",
          "يُستخدم الموقع لجمع الاستفسارات بصورة منظمة ومعالجتها بشريًا. لا يُتخذ عبر هذا المسار قرار آلي بالكامل يترتب عليه أثر قانوني أو أثر مماثل في أهميته."
        ]
      ]
    },
    "en": {
      "title": "Privacy notice",
      "summary": "This notice explains how your data is processed, the service providers involved, your rights and contact options.",
      "sections": [
        [
          "Controller",
          "Mohammad Refat Alyoussef · Caro Bara Werbeagentur · Fanningerstraße 20, 10365 Berlin, Germany. Email: info@carobara.de; telephone: +49 30 43021132. Please also use this contact for privacy matters."
        ],
        [
          "Website and technical data",
          "When you visit, technically necessary connection data such as IP address, time, requested URL, browser information and response status are processed to deliver the website and protect it against misuse. Vercel provides hosting. The legal basis is Article 6(1)(f) GDPR; the legitimate interest is secure and reliable operation."
        ],
        [
          "Inquiries, cart and appointments",
          "Depending on the form, we process your name, contact details, address, requested services, specifications, message and appointment details. Processing serves to handle your inquiry, prepare an offer and organize appointments under Article 6(1)(b) GDPR. General inquiries unrelated to a contract are processed to answer your message under Article 6(1)(f) GDPR. Mandatory fields are marked. The relevant process cannot be handled without necessary information. Please do not send unnecessary sensitive data."
        ],
        [
          "Service providers and recipients",
          "We use Vercel for hosting, Supabase to store inquiries and appointments, and Resend for transactional emails. Each provider receives the data necessary for its task. Within the business, people handling the matter have access. Other recipients, such as delivery providers or tax advisers, are involved only where necessary for a specific order or a statutory obligation."
        ],
        [
          "Processing outside the EEA",
          "The providers operate internationally; processing or access may take place outside the European Economic Area. Transfers are permitted only under the conditions of Articles 44 onwards GDPR. You can request information on the safeguards used for specific processing and a copy of them at info@carobara.de. Storage exclusively in Germany is not guaranteed."
        ],
        [
          "Retention",
          "Inquiry and appointment data are needed while processing, follow-up or clarification of outstanding claims continues. They must then be deleted unless statutory retention obligations or lawful grounds for further retention apply. Contract and accounting documents are subject to the applicable statutory periods. Technical logs serve only operation and investigation of errors or misuse. The precise duration depends on the data type, processing status and statutory requirements."
        ],
        [
          "Cookies and local storage",
          "The website stores cart contents in browser local storage and the selected language in local storage and a cookie. The language cookie lasts up to one year. A session cookie is used for protected administration. Cart data can be removed by clearing the list or through browser settings; language settings can also be removed through the browser. Strictly necessary storage is governed by section 25(2) of the German Telecommunications Digital Services Data Protection Act; subsequent processing of personal data uses the appropriate GDPR legal basis. Unnecessary tracking technologies may be used only after valid consent."
        ],
        [
          "WhatsApp and external links",
          "WhatsApp is an optional external contact channel you choose. Communication through that provider under its terms takes place only when you open the link or send your message there. The prepared message contains the details you entered. The internal inquiry form or email is available as an alternative. Map and social-network links lead to external services governed by their own privacy policies."
        ],
        [
          "Advertising",
          "The inquiry and appointment forms do not grant advertising consent. The appointment form currently offers no newsletter subscription. Any later advertising subscription requires separate information on the channel, content and withdrawal, and a demonstrable lawful basis for sending. Handling your inquiry is independent of this."
        ],
        [
          "Your rights",
          "To the extent provided by law, you have rights of access, rectification, erasure, restriction of processing and data portability. You may withdraw consent for the future. Where processing is based on legitimate interests, you may object on grounds relating to your particular situation; you may object to direct marketing at any time. Contact: info@carobara.de. You may complain to a data protection supervisory authority, particularly the Berlin Commissioner for Data Protection and Freedom of Information at www.datenschutz-berlin.de."
        ],
        [
          "Automated decisions",
          "The website collects structured inquiries for human processing. This inquiry process does not make solely automated decisions with legal or similarly significant effects."
        ]
      ]
    }
  },
  "agb": {
    "de": {
      "title": "Allgemeine Geschäftsbedingungen",
      "sections": termsSections,
      "summary": "Website-Anfragen sind unverbindlich. Ein individueller Auftrag und eine Produktionsfreigabe werden gesondert vereinbart."
    },
    "ar": {
      "title": "شروط التعامل",
      "summary": "إرسال الاستفسار لا يلزمك بالدفع. يُتفق بصورة منفصلة على الطلب وعلى اعتماد الإنتاج.",
      "sections": [
        [
          "المشغّل ونطاق الشروط",
          "مقدم الخدمة هو Mohammad Refat Alyoussef، Caro Bara Werbeagentur، Fanningerstraße 20، 10365 Berlin، ألمانيا، info@carobara.de. تسري هذه الشروط على خدمات الطباعة والتصميم والتقنيات الإعلانية والتركيب المتفق عليها مع المستهلكين والشركات، متى أُدرجت بصورة صحيحة قبل إبرام العقد. تكون الأولوية للاتفاقات الفردية والحقوق القانونية الإلزامية."
        ],
        [
          "الاستفسارات غير الملزمة وإبرام العقد",
          "إرسال استفسار أو مجموعة خدمات من السلة أو طلب موعد عبر الموقع غير ملزم ولا ينشئ التزامًا بالدفع. تأكيد الاستلام التلقائي ليس قبولًا لتنفيذ الطلب. بعد المراجعة تتلقى عرضًا خاصًا. يُبرم العقد بقبولك الصريح لعرضنا الملزم أو باتفاق صريح منفصل. إرسال استفسار عبر الموقع وحده لا يعني تكليفنا بخدمة مدفوعة."
        ],
        [
          "الخدمة والأسعار والدفع",
          "يحدد العرض الخاص نطاق الخدمة والخامة والمقاسات والكمية والتنفيذ وشروط التسليم أو الاستلام والمواعيد والدفع. تُعرض للمستهلك الأسعار الإجمالية شاملة ضريبة القيمة المضافة القانونية والتكاليف الإضافية المعروفة. يُبيّن صراحةً عندما تكون الأسعار الموجهة للشركات صافية قبل الضريبة. يُتفق على الدفعات المقدمة والجزئية قبل إبرام العقد. لا يشمل العرض التركيب إلا إذا عُرض واتُّفق عليه صراحةً."
        ],
        [
          "ملفات الطباعة واعتماد الإنتاج",
          "يرجى إرسال محتوى يحق لك قانونًا السماح باستخدامه. قبل الإنتاج تُؤخذ الموافقات المتفق عليها للتصميم والمواصفات المعنية. السكوت وحده لا يُعد موافقة على الطباعة. قد تتطلب التغييرات بعد الموافقة الصريحة عرضًا جديدًا. تبقى واجباتنا القانونية في الفحص والتنبيه وتنفيذ الخدمة قائمة؛ ولا تُلغي موافقتك حقوقك القانونية المتعلقة بالعيوب بصورة عامة."
        ],
        [
          "حقوق المحتوى",
          "يُتفق في العرض على نطاق حقوق استخدام التصاميم التي ننشئها. يجب احترام علامات الغير وصورهم وحقوقهم الشخصية. لا ننشر أعمال العملاء كأمثلة مرجعية إلا بوجود الإذن المناسب. لا تُنقل جميع مخاطر المسؤولية إلى العميل بصورة شاملة."
        ],
        [
          "التسليم والتركيب",
          "يُتفق لكل طلب على موعد التسليم والتركيب ووسائل الدخول اللازمة وموافقات المالك والمتطلبات الفنية. الأعمال الإضافية المدفوعة تحتاج اتفاقًا. تبقى الأحكام القانونية المتعلقة بتحمل المخاطر والحماية سارية."
        ],
        [
          "حق التراجع عن العقد",
          "تسري على المستهلك حقوق التراجع القانونية في عقود البيع عن بُعد والعقود المبرمة خارج مقر العمل. قد ينطبق الاستثناء القانوني الوارد في المادة 312g، الفقرة 2، البند 1 من القانون المدني الألماني على السلع غير المصنّعة مسبقًا التي يعتمد تصنيعها على اختيار فردي أساسي أو تخصيص واضح. ليس هذا استثناءً عامًا لجميع خدمات التصميم أو التركيب. تُقدّم التعليمات والنموذج المناسبان للعقد المحدد قبل إبرامه ومع تأكيده. عند الحاجة يُتفق صراحةً وبصورة منفصلة على بدء الخدمات مبكرًا وعلى شروط انقضاء حق التراجع."
        ],
        [
          "العيوب والمسؤولية",
          "تسري الحقوق القانونية المتعلقة بالعيوب والمسؤولية القانونية. لا تحد هذه الشروط من المطالبات المحمية قانونًا. يرجى إبلاغنا بالمشكلات في أقرب وقت ممكن عبر info@carobara.de؛ ولا يختصر ذلك الحقوق أو المهل القانونية. تُحدَّد حدود التفاوت الفنية في العرض بصورة ملموسة، ولا تُعد استبعادًا عامًا للشكاوى المستحقة."
        ],
        [
          "حماية البيانات ومستندات الطلب",
          "تجد معلومات معالجة بياناتك في سياسة الخصوصية بالموقع. الموافقة على الإعلانات ليست شرطًا لإرسال الاستفسار. تبقى التزامات حفظ المستندات القانونية قائمة؛ أما حفظ ملفات الإنتاج بصورة دائمة فيحتاج اتفاقًا منفصلًا."
        ],
        [
          "التواصل والقانون المطبق",
          "تُحدَّد لغة العقد في العرض. هذه ترجمة للنص الألماني للشروط. يُطبّق القانون الألماني دون حرمان المستهلك من حماية الأحكام الإلزامية في بلد إقامته المعتادة متى كانت هذه الحماية مقررة قانونًا. لا تُحدَّد للمستهلك محكمة اختصاص حصرية."
        ]
      ]
    },
    "en": {
      "title": "Terms and conditions",
      "summary": "Website inquiries are non-binding. Individual orders and production approval are agreed separately.",
      "sections": [
        [
          "Provider and scope",
          "The provider is Mohammad Refat Alyoussef, Caro Bara Werbeagentur, Fanningerstraße 20, 10365 Berlin, Germany, info@carobara.de. These terms apply to agreed printing, design, advertising technology and installation services for consumers and businesses, insofar as they were validly incorporated before the contract was concluded. Individual agreements and mandatory statutory rights take precedence."
        ],
        [
          "Non-binding inquiries and contract formation",
          "Submitting an inquiry, a collection of services in the cart or an appointment inquiry through this website is non-binding and creates no payment obligation. An automatic receipt confirmation is not acceptance of an order. After review, you receive an individual offer. A contract is concluded through your express acceptance of our binding offer or a separate express agreement. A website inquiry alone does not commission paid services."
        ],
        [
          "Services, prices and payment",
          "The individual offer specifies the scope, material, dimensions, quantity, execution, delivery or collection conditions, dates and payment. Consumers are shown total prices including statutory VAT and known additional costs. Net prices for businesses are expressly identified as such. Advance and partial payments are agreed before contract formation. Installation is included only where expressly offered and agreed."
        ],
        [
          "Print files and approval",
          "Please submit only content whose use you are legally entitled to authorize. The agreed approvals for the relevant design and specifications are obtained before production. Silence alone is not print approval. Changes after express approval may require a new offer. Our statutory duties to inspect, advise and perform remain unaffected; your approval does not generally waive statutory rights concerning defects."
        ],
        [
          "Content rights",
          "The offer specifies the scope of usage rights for designs we create. Third-party trademarks, images and personality rights must be respected. Customer work is published as a reference only with appropriate permission. There is no blanket transfer of all liability risks to the customer."
        ],
        [
          "Delivery and installation",
          "Delivery and installation dates, necessary access, owner approvals and technical requirements are agreed for each order. Additional paid work requires agreement. Statutory rules on risk and protection remain unaffected."
        ],
        [
          "Withdrawal",
          "Consumers have statutory withdrawal rights for distance contracts and contracts concluded away from business premises. The exception under section 312g(2), point 1 of the German Civil Code may apply to goods that are not prefabricated and depend on a significant individual choice or clear personalization. This is not a general exclusion for all design or installation services. The instructions and model form applicable to the specific contract are provided before conclusion and with the contract confirmation. Where relevant, an early start of services and the conditions for expiry of the withdrawal right are expressly agreed separately."
        ],
        [
          "Defects and liability",
          "Statutory rights concerning defects and statutory liability apply. These terms do not restrict legally protected claims. Please report problems promptly to info@carobara.de; this does not shorten statutory rights or time limits. Technical tolerances are specifically agreed in the offer and do not constitute a blanket exclusion of justified complaints."
        ],
        [
          "Privacy and order documents",
          "Information on the processing of your data is available in the website privacy notice. Consent to advertising is not required to submit an inquiry. Statutory retention obligations remain; permanent storage of production files requires a separate agreement."
        ],
        [
          "Communication and applicable law",
          "The offer specifies the contract language. This is a translation of the German terms. German law applies without depriving consumers of the protection of mandatory provisions in their country of habitual residence where legally applicable. No exclusive place of jurisdiction is specified for consumers."
        ]
      ]
    }
  },
  "widerruf": {
    "de": {
      "title": "Widerruf und Verbraucherrechte",
      "sections": [
        [
          "Anfrage und Vertrag",
          "Das Absenden einer Website-Anfrage ist kein kostenpflichtiger Vertrag. Für einen später geschlossenen Verbrauchervertrag hängt das Widerrufsrecht vom konkreten Vertragsgegenstand und dem Abschlussweg ab. Vor Vertragsschluss erhalten Sie die für Ihren Vertrag geltenden Informationen und gegebenenfalls die Widerrufsbelehrung und das Musterformular auf einem dauerhaften Datenträger."
        ],
        [
          "Personalisierte Waren und Dienstleistungen",
          "Bei nicht vorgefertigten Waren, für deren Herstellung eine individuelle Auswahl maßgeblich ist oder die eindeutig personalisiert sind, kann § 312g Abs. 2 Nr. 1 BGB das Widerrufsrecht ausschließen. Design, Beratung oder Montage werden dadurch nicht pauschal ausgenommen. Für Dienstleistungen gelten die jeweiligen gesetzlichen Voraussetzungen, insbesondere bei einem ausdrücklich gewünschten Beginn vor Ablauf der Widerrufsfrist."
        ],
        [
          "Widerruf erklären",
          "Eine eindeutige Widerrufserklärung kann an Mohammad Refat Alyoussef, Caro Bara Werbeagentur, Fanningerstraße 20, 10365 Berlin, oder info@carobara.de gesendet werden. Bitte nennen Sie Ihren Namen, den betroffenen Vertrag oder Auftrag und eine E-Mail-Adresse für die Bestätigung. Eine Begründung ist nicht erforderlich. Diese allgemeinen Hinweise ersetzen nicht die vor Vertragsschluss bereitzustellende, konkret passende Belehrung."
        ],
        [
          "Formular zum Kopieren",
          "An: Mohammad Refat Alyoussef, Caro Bara Werbeagentur, Fanningerstraße 20, 10365 Berlin, info@carobara.de\nHiermit widerrufe ich den von mir abgeschlossenen Vertrag über folgende Waren / Dienstleistungen:\nAuftragsnummer / Beschreibung:\nBestellt am / erhalten am:\nName:\nAnschrift:\nDatum:\nUnterschrift (nur bei Mitteilung auf Papier):"
        ]
      ],
      "summary": "Ein kostenpflichtiger Vertrag entsteht nicht allein durch Absenden einer Anfrage. Das Widerrufsrecht hängt vom konkreten Vertrag ab."
    },
    "ar": {
      "title": "حق التراجع وحقوق المستهلك",
      "summary": "لا ينشأ عقد مدفوع بمجرد إرسال الاستفسار. يتحدد حق التراجع بحسب العقد المعني.",
      "sections": [
        [
          "الاستفسار والعقد",
          "إرسال استفسار عبر الموقع ليس عقدًا مدفوعًا. في أي عقد لاحق مع مستهلك يتوقف حق التراجع على موضوع العقد وطريقة إبرامه. قبل إبرام العقد تتلقى المعلومات المنطبقة عليه، وتعليمات التراجع والنموذج عند انطباقهما، على وسيط دائم."
        ],
        [
          "السلع المخصصة والخدمات",
          "قد تستثني المادة 312g، الفقرة 2، البند 1 من القانون المدني الألماني السلع غير المصنّعة مسبقًا التي يعتمد تصنيعها على اختيار فردي أساسي أو تخصيص واضح. لا يشمل ذلك تلقائيًا جميع خدمات التصميم أو الاستشارة أو التركيب. تسري على الخدمات الشروط القانونية الخاصة بها، ولا سيما عند طلب بدء الخدمة صراحةً قبل انتهاء مهلة التراجع."
        ],
        [
          "إعلان التراجع",
          "يمكن إرسال إعلان واضح بالتراجع إلى Mohammad Refat Alyoussef، Caro Bara Werbeagentur، Fanningerstraße 20، 10365 Berlin، أو info@carobara.de. يرجى ذكر اسمك والعقد أو الطلب المعني وبريد إلكتروني لتأكيد الاستلام. لا يلزم ذكر سبب. لا تحل هذه المعلومات العامة محل التعليمات المناسبة للعقد المحدد التي يجب تقديمها قبل إبرامه."
        ],
        [
          "نموذج قابل للنسخ",
          "إلى: Mohammad Refat Alyoussef، Caro Bara Werbeagentur، Fanningerstraße 20، 10365 Berlin، info@carobara.de\nأُعلن تراجعي عن العقد الذي أبرمته بشأن السلع أو الخدمات التالية:\nرقم الطلب أو الوصف:\nتاريخ الطلب أو الاستلام:\nالاسم:\nالعنوان:\nالتاريخ:\nالتوقيع، عند الإرسال على الورق فقط:"
        ]
      ]
    },
    "en": {
      "title": "Withdrawal and consumer rights",
      "summary": "Submitting an inquiry alone does not create a paid contract. Withdrawal rights depend on the specific contract.",
      "sections": [
        [
          "Inquiry and contract",
          "Submitting a website inquiry is not a paid contract. For any later consumer contract, withdrawal rights depend on its subject and how it is concluded. Before contract formation, you receive the applicable information and, where relevant, the withdrawal instructions and model form on a durable medium."
        ],
        [
          "Personalized goods and services",
          "Section 312g(2), point 1 of the German Civil Code may exclude withdrawal rights for goods that are not prefabricated and depend on a significant individual choice or clear personalization. This does not automatically exclude all design, advice or installation services. Services are subject to their applicable statutory conditions, particularly where an early start before the end of the withdrawal period is expressly requested."
        ],
        [
          "Declaring withdrawal",
          "A clear withdrawal declaration can be sent to Mohammad Refat Alyoussef, Caro Bara Werbeagentur, Fanningerstraße 20, 10365 Berlin, or info@carobara.de. Please state your name, the relevant contract or order and an email address for confirmation. No reason is required. These general notes do not replace the specific instructions that must be provided before the contract is concluded."
        ],
        [
          "Form to copy",
          "To: Mohammad Refat Alyoussef, Caro Bara Werbeagentur, Fanningerstraße 20, 10365 Berlin, info@carobara.de\nI hereby withdraw from the contract I concluded for the following goods / services:\nOrder number / description:\nOrdered on / received on:\nName:\nAddress:\nDate:\nSignature (only for a paper declaration):"
        ]
      ]
    }
  },
  "rechtliches": {
    "de": {
      "title": "Anfragen, Freigaben und Kontakt",
      "sections": [
        [
          "Anfragen und Freigaben",
          "Die Plattform organisiert unverbindliche Anfragen. Ein individuelles Angebot legt Preis, Leistung und Termine fest. Die spätere Beauftragung und eine nötige Druck- oder Produktionsfreigabe werden ausdrücklich vereinbart. Schweigen ist keine pauschale Freigabe."
        ],
        [
          "Bilder und Darstellung",
          "Servicebilder sind illustrative, zum Teil KI-generierte Darstellungen von Leistungen und Materialien. Sie sind kein Nachweis tatsächlich ausgeführter Kundenprojekte oder einer bestimmten Maschine. Konkrete Materialien, Farben und Ergebnisse werden für Ihren Auftrag vereinbart."
        ],
        [
          "Beschwerden und Datenschutz",
          "Allgemeine Anfragen und Datenschutz: info@carobara.de. Beschwerden zu Leistungen: info@carobara.com. Telefon: +49 30 43021132. Gesetzliche Rechte bleiben unberührt."
        ],
        [
          "Barrieren melden",
          "Wenn Sie eine Seite oder ein Formular nicht nutzen können, kontaktieren Sie uns telefonisch oder per E-Mail für einen alternativen Anfrageweg. Eine Zertifizierung oder uneingeschränkte Barrierefreiheit wird nicht behauptet."
        ]
      ],
      "summary": "Informationen zu unverbindlichen Anfragen, ausdrücklichen Freigaben, Beispielbildern und Kontaktmöglichkeiten."
    },
    "ar": {
      "title": "الاستفسارات والموافقات والتواصل",
      "summary": "معلومات عن الاستفسارات غير الملزمة والموافقات الصريحة والصور التوضيحية ووسائل التواصل.",
      "sections": [
        [
          "الاستفسارات والموافقات",
          "تنظم المنصة استفسارات غير ملزمة. يحدد العرض الخاص السعر والخدمة والمواعيد. يجري الاتفاق صراحةً على التكليف اللاحق وعلى موافقة الطباعة أو الإنتاج اللازمة. السكوت ليس موافقة شاملة."
        ],
        [
          "الصور والعرض البصري",
          "صور الخدمات أمثلة توضيحية للخدمات والخامات، وبعضها مولّد بالذكاء الاصطناعي. لا تثبت تنفيذ مشاريع فعلية لعملاء أو امتلاك آلة محددة. تُحدَّد الخامات والألوان والنتائج المطلوبة لطلبك بالاتفاق."
        ],
        [
          "الشكاوى والخصوصية",
          "للاستفسارات العامة وحماية البيانات: info@carobara.de. للشكاوى المتعلقة بالخدمات: info@carobara.com. الهاتف: ‎+49 30 43021132. تبقى الحقوق القانونية محفوظة."
        ],
        [
          "الإبلاغ عن عوائق الاستخدام",
          "إذا تعذر عليك استخدام صفحة أو نموذج، تواصل معنا هاتفيًا أو بالبريد الإلكتروني للحصول على وسيلة بديلة لإرسال استفسارك. لا ندّعي وجود شهادة مطابقة أو خلو الموقع من جميع عوائق الاستخدام."
        ]
      ]
    },
    "en": {
      "title": "Inquiries, approvals and contact",
      "summary": "Information on non-binding inquiries, express approvals, illustrative images and contact options.",
      "sections": [
        [
          "Inquiries and approvals",
          "The platform organizes non-binding inquiries. An individual offer specifies price, services and dates. Any subsequent commission and necessary print or production approval are expressly agreed. Silence is not blanket approval."
        ],
        [
          "Images and presentation",
          "Service images illustrate services and materials and are partly AI-generated. They do not prove that actual customer projects were completed or that a particular machine is owned. Specific materials, colors and results are agreed for your order."
        ],
        [
          "Complaints and privacy",
          "General inquiries and privacy: info@carobara.de. Complaints about services: info@carobara.com. Telephone: +49 30 43021132. Statutory rights remain unaffected."
        ],
        [
          "Reporting accessibility barriers",
          "If you cannot use a page or form, please contact us by telephone or email for an alternative inquiry channel. No certification or unrestricted accessibility is claimed."
        ]
      ]
    }
  }
} as const satisfies Record<LegalPageId, Record<Language, LegalContent>>;
export const legalLabels = {
 ar: {updated:"آخر تحديث",home:"الرئيسية",notice:"بيانات المشغّل",privacy:"الخصوصية"},
 de: {updated:"Stand",home:"Startseite",notice:"Impressum",privacy:"Datenschutz"},
 en: {updated:"Last updated",home:"Home",notice:"Legal notice",privacy:"Privacy"},
} as const;
