
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate ,useParams} from 'react-router-dom';
import { 
  Users,
  BookOpen,
  MessageCircle,
  Award,
  Home,
  Info,
  Newspaper,
  HelpCircle,
  LogIn,
  LogOut,
  User,
  Plus,
  Edit2,
  Trash2,
  Heart,
  Mail,
  Instagram,
  Facebook,
  GraduationCap, MessagesSquare,HeartHandshake,Sparkles 

} from 'lucide-react';

import { motion ,AnimatePresence } from 'framer-motion';
// Using local SQLite database via API routes

// Types
interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
  published: boolean;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface Question {
  id: number;
  user_id: string;
  user_name: string;
  title: string;
  content: string;
  created_at: string;
  answered: boolean;
}

type User = {
  id: string;
  email: string;
  role: string;

  first_name?: string;
  last_name?: string;

  birthday?: string;
  university?: string;
  major?: string;
  phone?: string;
};

// Categories
const CATEGORIES = [
  'قرارات وزارة التربية',
  'معادلة الشهادات',
  'التحويل المتماثل',
  'أخبار الطلاب'
];

// Guides Data (Structured)
// const GUIDES = [
//     {
//     id: 1,
//     title: "دليل معادلة الشهادة في سوريا",
//     steps: [
//       "تقديم طلب خطي أو كتاب رسمي يوضح الغرض من التعادل (وظيفي أو أكاديمي)",
//       "تجهيز الشهادة الجامعية الأصلية مع 3 نسخ مصورة عنها",
//       "إرفاق كشف علامات مفصل لكامل سنوات الدراسة مع 3 نسخ مصورة",
//       "إرفاق وثيقة شهادة المرحلة الثانوية العامة",
//       "تقديم إثباتات الإقامة القانونية في بلد الدراسة (جواز السفر وسجل الدخول والخروج)",
//       "تصديق جميع الوثائق من وزارة خارجية بلد الإصدار ثم من السفارة السورية",
//       "تصديق الوثائق داخل سوريا من وزارة الخارجية والمغتربين السورية",
//       "تقديم الملف إلى وزارة التعليم العالي السورية وانتظار المعالجة"
//     ],
//     requirements: [
//       "طلب خطي رسمي",
//       "الشهادة الجامعية الأصلية",
//       "3 نسخ مصورة عن الشهادة",
//       "كشف علامات مفصل",
//       "3 نسخ عن كشف العلامات",
//       "وثيقة الثانوية العامة",
//       "جواز السفر",
//       "سجل الدخول والخروج",
//       "تصديقات خارجية وداخلية"
//     ],
//     additionalConditions: [
//       "الشهادات الطبية (بشري، أسنان، صيدلة) تتطلب اجتياز الامتحان الوطني الموحد بعد التقييم والتسجيل الإلكتروني",
//       "شهادات الماجستير والدكتوراه تتطلب وثيقة توضح طريقة مناقشة الرسالة أو الأطروحة والتقييم النهائي"
//     ]
//   },
//   {
//     id: 2,
//     title: "شروط النقل والتحويل بين الجامعات",
//     steps: [
//       "الحصول على موافقة الجامعة الحالية",
//       "تقديم طلب تحويل إلى الجامعة المستهدفة",
//       "تقديم كشف درجات وشهادات معتمدة",
//       "اجتياز اختبار القبول إن وجد"
//     ],
//     requirements: "معدل تراكمي لا يقل عن 2.5، سنة دراسية كاملة"
//   },
//   {
//     id: 3,
//     title: "إرشادات للطلاب العائدين إلى سوريا",
//     steps: [
//       "التأكد من صحة الوثائق المعادلة",
//       "التسجيل في الجامعات السورية عبر المنصة الإلكترونية",
//       "التواصل مع مكتب الطلاب السوريين في دمشق",
//       "متابعة التحديثات عبر الملتقى"
//     ],
//     requirements: "شهادة معادلة، سجل أكاديمي، تأشيرة خروج"
//   }
// ];
// Guides Data (Structured)
const GUIDES = [
  {
    id: 1,
    title: "دليل معادلة الشهادة في سوريا",
    steps: [
      "تقديم طلب خطي أو كتاب رسمي يوضح الغرض من التعادل سواء كان وظيفياً أو أكاديمياً",
      "تجهيز الشهادة الجامعية الأصلية مع 3 نسخ مصورة عنها",
      "إرفاق كشف علامات مفصل لكامل سنوات الدراسة الجامعية مع 3 نسخ مصورة",
      "إرفاق وثيقة شهادة المرحلة الثانوية العامة",
      "تقديم إثباتات الإقامة القانونية في بلد الدراسة مثل جواز السفر وسجل الدخول والخروج",
      "تصديق جميع الوثائق من وزارة خارجية بلد الإصدار",
      "تصديق الوثائق من السفارة السورية في بلد الدراسة",
      "تصديق الوثائق داخل سوريا من وزارة الخارجية والمغتربين السورية",
      "تقديم الملف الكامل إلى وزارة التعليم العالي السورية وانتظار المعالجة"
    ],
    requirements: [
      "طلب خطي رسمي",
      "الشهادة الجامعية الأصلية",
      "3 نسخ مصورة عن الشهادة",
      "كشف علامات مفصل",
      "3 نسخ عن كشف العلامات",
      "وثيقة الثانوية العامة",
      "جواز السفر",
      "سجل الدخول والخروج",
      "تصديقات خارجية وداخلية"
    ],
    additionalConditions: [
      "الشهادات الطبية (بشري، أسنان، صيدلة) تتطلب اجتياز الامتحان الوطني الموحد بعد التقييم والتسجيل الإلكتروني",
      "شهادات الماجستير والدكتوراه تتطلب وثيقة توضح طريقة مناقشة الرسالة أو الأطروحة والتقييم النهائي"
    ]
  },
  {
  id: 2,
  title: "التحويل المماثل من الجامعات خارج سوريا",
  steps: [
    "التأكد من أن الجامعة خارج سوريا معتمدة لدى وزارة التعليم العالي السورية",
    "تحقيق شرط الإقامة القانونية لمدة لا تقل عن 8 أشهر في بلد الدراسة",
    "إنجاز سنة دراسية جامعية واحدة على الأقل بنجاح",
    "تحقيق المعدلات المطلوبة للكليات المطلوبة مثل الطب والهندسة",
    "التأكد من عدم وجود فصل تأديبي أو مشاكل أكاديمية في الجامعة السابقة",
    "امتلاك شهادة ثانوية سورية أو ما يعادلها بالفرع المطلوب",
    "تجهيز كشف العلامات المصدق أصولاً من الجامعة ووزارة الخارجية والسفارة السورية",
    "إرفاق توصيف كامل للمقررات الدراسية والخطة الدرسية",
    "إرفاق بيان حالة دراسية يوضح الوضع الأكاديمي الحالي",
    "تقديم صورة عن الشهادة الثانوية المعادلة",
    "إرفاق صور شخصية ونسخة عن جواز السفر لإثبات مدة الإقامة",
    "التقديم إلكترونياً ضمن مفاضلة التحويل المماثل الصادرة عن وزارة التعليم العالي السورية",
    "متابعة نتائج المفاضلة واستكمال إجراءات المعادلة والتسجيل"
  ],
  requirements: [
    "أن تكون الجامعة معترف بها لدى وزارة التعليم العالي السورية",
    "مدة إقامة لا تقل عن 8 أشهر في بلد الدراسة",
    "إنجاز سنة جامعية واحدة على الأقل",
    "ألا يكون الطالب مفصولاً تأديبياً",
    "امتلاك شهادة ثانوية مناسبة للتخصص المطلوب",
    "تحقيق المعدلات المطلوبة لبعض الكليات",
    "كشف علامات مصدق أصولاً",
    "توصيف مقررات دراسية",
    "بيان حالة جامعية",
    "جواز سفر يثبت الإقامة"
  ],
  additionalConditions: [
    "يشترط معدل لا يقل عن 80% لكليات الطب البشري وطب الأسنان والصيدلة",
    "يشترط معدل لا يقل عن 75% لكليات الهندسة",
    "تتم إجراءات التحويل حصراً عبر مفاضلة التحويل المماثل السنوية",
    "غالباً ما يتم فتح باب التسجيل في شهري أيلول أو تشرين الأول"
  ]
},
  {
  id: 3,
  title: "الجامعات اللبنانية المعترف بها في سوريا",
  steps: [
    "الجامعة اللبنانية (الجامعة الحكومية الرسمية)",
    "الجامعة الأمريكية في بيروت (AUB)",
    "الجامعة اللبنانية الأمريكية (LAU)",
    "جامعة القديس يوسف (USJ - اليسوعية)",
    "جامعة البلمند",
    "جامعة بيروت العربية",
    "الجامعة اللبنانية الدولية (LIU)",
    "جامعة الروح القدس الكسليك (USEK)",
    "جامعة سيدة اللويزة (NDU)",
    "جامعة الحكمة",
    "جامعة الجنان",
    "جامعة الآداب والعلوم والتكنولوجيا في لبنان (AUL)",
    "الجامعة الإسلامية في لبنان",
    "جامعة هايكازيان",
    "الجامعة الحديثة للإدارة والعلوم (MUBS)"
  ],
  requirements: [
    "التأكد من أن الجامعة معترف بها لدى وزارة التعليم العالي السورية قبل التسجيل",
    "الاحتفاظ بجميع الوثائق الأكاديمية الأصلية والمصدقة أثناء فترة الدراسة",
    "متابعة أي تحديثات أو تغييرات تطرأ على قوائم الاعتراف الجامعي بشكل دوري",
    "التأكد من اعتماد الاختصاص والبرنامج المطلوب وليس فقط اعتماد اسم الجامعة العام",
    "الاستفسار المباشر من وزارة التعليم العالي السورية قبل اختيار أي اختصاص حساس وحرج مثل الطب أو الصيدلة"
  ],
  additionalConditions: [
    "اختصاص الصيدلة في جامعة الجنان غير معتمد في سوريا",
    "قد تختلف شروط ومعايير المعادلة بحسب الاختصاص والجامعة والشهادة الثانوية للطالب",
    "يُنصح دائماً بالتحقق من أحدث قرارات وزارة التعليم العالي السورية قبل المباشرة بالتسجيل الفعلي"
  ]
},
{
    id: 6,
    title: "نظام التعليم العام والموازي في سوريا",
    steps: [
      "الحصول على الشهادة الثانوية العامة (البكالوريا) للعام الدراسي الحالي حصراً",
      "التقديم الإلكتروني عبر تطبيق المفاضلة الموحد الصادر عن وزارة التعليم العالي",
      "ترتيب الرغبات في بطاقة المفاضلة بين خياري (التعليم العام المجاني) أو (التعليم الموازي المأجور)",
      "انتظار صدور نتائج الحدود الدنيا للقبول ومعرفة الكلية أو المعهد المخصص للمجموع",
      "توجه الطالب فيزيائياً إلى شؤون الطلاب في الكلية المقبول بها لاستكمال أوراق التسجيل والبطاقة الجامعية",
      "الالتزام بالدوام النظامي اليومي طيلة أيام الأسبوع (من الأحد إلى الخميس) مع طلاب الدفعة"
    ],
    requirements: [
      "وثيقة الشهادة الثانوية الأصلية وحديثة الصنع",
      "صورة عن الهوية الشخصية أو القيد المدني",
      "صور شخصية ملونة وحديثة (عدد 4 أو 6 حسب الكلية)",
      "دفع رسوم التسجيل السنوية (رمزية للعام، ومحددة وثابتة للموازي)",
      "البطاقة الاكتتابية للمفاضلة الإلكترونية"
    ],
    additionalConditions: [
      "يقبل التعليم الموازي بمعدلات أقل بنسب معينة (2% إلى 5%) مقارنة بالتعليم العام",
      "الشهادة الصادرة في نظام الموازي هي شهادة حكومية موحدة لا يُذكر فيها كلمة (موازي)",
      "يسمح نظام التعليم العام للخريجين الأوائل بالترشح للمعيدية والإيفاد والدراسات العليا مجاناً"
    ]
  },
  {
    id: 7,
    title: "نظام التعليم المفتوح في سوريا (تحديث المفاضلة المركزية)",
    steps: [
      "حيازة شهادة ثانوية عامة (قديمة أو حديثة) تتوافق مع شروط الفرع المطلوب",
      "التقديم عبر المنصة الإلكترونية المركزية الموحدة للتعليم المفتوح (تتم لمرة واحدة سنوياً)",
      "اختيار أحد البرامج المتاحة (حقوق، إعلام، ترجمة، محاسبة، إدارة مشاريع، رياض أطفال)",
      "تسديد الرسوم المقررة عن كل مادة يتم التسجيل عليها بعد صدور نتائج القبول الإداري",
      "حضور المحاضرات واللقاءات الصفية الفيزيائية المقررة حصراً يومي (الجمعة والسبت) من كل أسبوع",
      "التقدم للامتحانات الفصلية المحددة في المراكز الامتحانية التابعة للجامعة الحكومية"
    ],
    requirements: [
      "صورة مصدقة عن الشهادة الثانوية (لا يشترط سنة تخرج حديثة)",
      "صورة عن البطاقة الشخصية (الهوية)",
      "استمارة المفاضلة الإلكترونية المطبوعة",
      "إيصال دفع الرسوم الجامعية لكل مقرر مشحون في الفصل الدراسي"
    ],
    additionalConditions: [
      "لا يشترط الدوام اليومي، مما يجعله مناسباً للموظفين وأصحاب الأعمال",
      "الشهادة تتيح التسجيل في دبلوم التأهيل التربوي أو ماجستيرات التأهيل والتخصص ولا تتيح الماجستير الأكاديمي مباشرة",
      "يُسمح قانوناً بالجمع بين التعليم المفتوح وأي نظام تعليمي نظامي آخر (عام أو خاص)"
    ]
  },
  {
    id: 8,
    title: "نظام التعليم الافتراضي (الجامعة الافتراضية السورية SVU)",
    steps: [
      "التأكد من مواعيد مفاضلة الجامعة الافتراضية (تصدر غالباً في فصلي الربيع والخريف)",
      "التقديم عبر الموقع الرسمي للجامعة (SVU) واختيار البرنامج (معلوماتية، اتصالات، حقوق، إعلام، إدارة أعمال)",
      "تسديد رسوم المفاضلة والتحقق من القبول عبر الحساب الإلكتروني للطالب",
      "متابعة المحاضرات والدروس التفاعلية بالكامل عن بُعد (Online) عبر الإنترنت من أي مكان",
      "حضور الامتحانات الفصلية والنهائية (فيزيائياً) داخل مراكز النفاذ المعتمدة (داخل سوريا أو مراكزها الدولية خارجها)"
    ],
    requirements: [
      "الشهادة الثانوية العامة أو الشهادة الجامعية (للمتقدمين لبرامج الماجستير)",
      "صورة عن الهوية الشخصية أو جواز السفر",
      "حساب بنكي أو وسيلة دفع إلكترونية معتمدة لسداد رسوم المقررات",
      "الحضور الفيزيائي الإلزامي في مراكز النفاذ أثناء تقديم الامتحانات فقط"
    ],
    additionalConditions: [
      "تعتبر نمطاً تعليمياً حكومياً قائماً بحد ذاته يعتمد على التعليم الإلكتروني الذاتي والمدمج",
      "تتيح الجامعة برامج ماجستير أكاديمية (بحثية) بالإضافة إلى ماجستيرات التأهيل والتخصص",
      "تقبل الشهادات الثانوية القديمة والحديثة وتستقطب الطلاب المقيمين خارج سوريا لوجود مراكز امتحانية دولية (كلبنان والإمارات وغيرها)"
    ]
  },
  {
    id: 9,
    title: "نظام التعليم الخاص في سوريا",
    steps: [
      "الاطلاع على شرائح المعدلات والحدود الدنيا المقررة من وزارة التعليم العالي للكليات الخاصة سنوياً",
      "التقدم عبر مفاضلة الجامعات الخاصة المركزية واختيار الرغبات والجامعة المطلوبة",
      "تثبيت التسجيل في مقر الجامعة الخاصة بعد صدور القبول وتسديد القسط الدراسي الأول",
      "الالتزام بخطة الساعات المعتمدة (Credit Hours) المقررة للتخصص الدراسي ونظام الإرشاد الأكاديمي"
    ],
    requirements: [
      "وثيقة الشهادة الثانوية الأصلية (سورية أو ما يعادلها)",
      "وثائق إثبات الشخصية والصور الشخصية الحديثة",
      "تسديد الأقساط والرسوم الدراسية المحتسبة على أساس سعر الساعة المعتمدة في الكلية"
    ],
    additionalConditions: [
      "تخضع الجامعات الخاصة لإشراف أكاديمي مباشر من وزارة التعليم العالي السورية",
      "تتطلب الكليات الطبية والهندسية معدلات مرتفعة نسبياً تحددها الوزارة لمنع التكسب التجاري على حساب الكفاءة",
      "تعتمد أغلب الجامعات الخاصة نظام الفصول الدراسية الثلاثة (خريفي، ربيعي، وصيفي اختياري)"
    ]
  },
  {
    id: 10,
    title: "سلسلة تصديق الشهادات والأوراق الرسمية بين لبنان وسوريا",
    steps: [
      "تصدير الوثيقة الأصلية (شهادة، كشف علامات، إخراج قيد) وتصديقها من إدارة المدرسة أو عمادة الجامعة",
      "تصديق الوثيقة من وزارة التربية والتعليم العالي اللبنانية (الأونيسكو - بيروت)",
      "الانتقال بالوثيقة إلى وزارة الخارجية والمغتربين اللبنانية لتصديقها رسميّاً",
      "زيارة السفارة السورية في لبنان (منطقة اليرزة - بعبدا) للمصادقة على الأختام اللبنانية",
      "بعد العودة إلى سوريا، يجب تصديق الوثيقة من وزارة الخارجية والمغتربين السورية بدمشق أو أحد مكاتبها بالمحافظات",
      "ترجمة الوثيقة إلى اللغة العربية وتصديقها من وزارة العدل السورية (إذا كانت صادرة بلغة أجنبية كالإنكليزية أو الفرنسية)"
    ],
    requirements: [
      "الوثائق الدراسية الأصلية",
      "ختم وزارة التربية اللبنانية",
      "ختم الخارجية اللبنانية",
      "ختم السفارة السورية في بعبدا",
      "ختم الخارجية السورية بدمشق"
    ],
    additionalConditions: [
      "يُشترط حجز موعد مسبق في بعض الأحيان لمعاملات السفارة السورية في لبنان عبر منصاتهم الرسمية",
      "الشهادات الصادرة عن المدارس الخاصة في لبنان تتطلب تصديقاً إضافياً من مصلحة التعليم الخاص بالوزارة قبل الخارجية"
    ]
  },
  {
    id: 11,
    title: "شروط وضوابط الجمع بين دراسة تخصصين جامعيين في آن واحد",
    steps: [
      "التأكد من عدم الجمع بين نظامين متماثلين يمنع القانون دمجهم (مثل الجمع بين كليتين في التعليم العام معاً)",
      "اختيار التخصص الأول في أحد الأنظمة النظامية المقيدة (تعليم عام، أو موازي، أو جامعات خاصة)",
      "التسجيل في التخصص الثاني عبر الأنظمة المرنة المسموحة (التعليم المفتوح أو الجامعة الافتراضية السورية SVU)",
      "تنسيق المواعيد الامتحانية بشكل شخصي، حيث لا تلتزم الجامعات بتعديل جداولها في حال تضارب امتحانات التخصصين"
    ],
    requirements: [
      "شهادة ثانوية عامة متوافقة مع شروط كلا الفرعين (أو استخدام شهادتين ثانوية من عامين مختلفين)",
      "الحصول على موافقة خطية من شؤون الطلاب في حال تطلب الأمر سحب وثيقة أصلية مؤقتاً لإتمام التسجيل الآخر"
    ],
    additionalConditions: [
      "يُمنع منعاً باتاً الجمع بين كليتين طبيتين في أي من الأنظمة الدراسية",
      "يحق للطالب المسجل في جامعة حكومية (عام أو موازي) التسجيل في الجامعة الافتراضية والتعليم المفتوح معاً ليصبح دارساً لثلاثة تخصصات قانونياً"
    ]
  },
  {
    id: 12,
    title: "دليل الامتحان الوطني الموحد للخريجين من خارج سوريا (مركز القياس والتقويم)",
    steps: [
      "إتمام التعادل الإداري الأولي للشهادة غير السورية لدى وزارة التعليم العالي بدمشق",
      "انتظار إحالة الملف من مديرية تعادل الشهادات إلى مركز القياس والتقويم السوري",
      "التسجيل الإلكتروني على دورة الامتحان الوطني فور إعلان المركز عنها عبر موقعه الرسمي",
      "سداد الرسوم المالية المقررة للامتحان في المصارف المعتمدة",
      "خوض الامتحان الوطني الموحد (الذي يقام في مراكز الجامعات الحكومية) والنجاح بمعدل لا يقل عن 50% أو 60% حسب التخصص للترخيص"
    ],
    requirements: [
      "وثيقة الإحالة الصادرة عن لجنة تعادل الشهادات بوزارة التعليم العالي",
      "صورة عن الهوية الشخصية",
      "إيصال سداد رسوم الامتحان الوطني الموحد",
      "بطاقة الاكتتاب الخاصة بالمركز"
    ],
    additionalConditions: [
      "يعد النجاح في هذا الامتحان شرطاً أساسياً وحتمياً للحصول على ترخيص ممارسة المهنة من وزارة الصحة والانتساب للنقابات",
      "يخضع للامتحان خريجو كليات: الطب البشري، طب الأسنان، الصيدلة، الهندسة المعمارية، الهندسة المعلوماتية، والتمريض",
      "علامة الامتحان الموحد تُعتمد أيضاً كمعيار تفاضلي رئيسي للقبول في مفاضلات الدراسات العليا (الماجستير)"
    ]
  },
  {
    id: 13,
    title: "دليل دراسة البكالوريوس في لبنان للطلاب القادمين من سوريا",
    steps: [
      "تصديق شهادة الثانوية العامة السورية (البكالوريا) وكشف العلامات من وزارة التربية والخارجية في سوريا أصولاً.",
      "تقديم الأوراق لمديرية التعليم العالي في وزارة التربية والتعليم العالي اللبنانية (الأونيسكو - بيروت) للحصول على المعادلة اللبنانية للثانوية العامة.",
      "اختيار الجامعة المستهدفة والتأكد من اعترافها المتبادل والاطلاع على اختبارات الكفاءة المطلوبة (مثل اختبارات اللغة أو المقابلة الشخصية).",
      "تقديم مستندات الإقامة القانونية في لبنان أو تأشيرة الدخول المخصصة للدراسة لتسجيل الملف الإداري.",
      "سداد رسوم التسجيل للفصل الدراسي الأول وتثبيت المقعد الجامعي في شؤون الطلاب للجامعة المحددة."
    ],
    requirements: [
      "شهادة الثانوية العامة السورية الأصلية مصدقة أصولاً",
      "كشف علامات الثانوية العامة مصدق",
      "وثيقة المعادلة الصادرة عن وزارة التربية والتعليم العالي اللبنانية",
      "جواز سفر ساري المفعول مع إقامة قانونية أو وثيقة دخول رسمية",
      "صور شخصية حديثة ملونة (عدد 4)"
    ],
    additionalConditions: [
      "تشترط بعض الجامعات الخاصة والجامعة اللبنانية الحكومية معدلات دنيا محددة للقبول في كليات الهندسة والعلوم الطبية.",
      "يُطلب من الطالب أحياناً الخضوع لبرنامج دراسة اللغة (اللغة الإنكليزية أو الفرنسية) في حال عدم امتلاك شهادة كفاءة دولية (مثل TOEFL أو IELTS)."
    ]
  },
  {
    id: 14,
    title: "دليل دراسة الماجستير في لبنان للطلاب القادمين من سوريا",
    steps: [
      "تجهيز المصدقة الجامعية الأصلية (البكالوريوس) مع كشف علامات تفصيلي لسنوات الدراسة الأربع أو الخمس ومصادقتها من الخارجية السورية.",
      "إجراء معاملة معادلة الشهادة الجامعية السورية لدى اللجنة الفنية لمعادلة الشهادات في وزارة التعليم العالي اللبنانية (بيروت).",
      "تأمين رسائل توصية أكاديمية (Recommendation Letters) من دكاترة الجامعة السابقة (تطلبها أغلب الجامعات اللبنانية).",
      "صياغة رسالة الدافع (Motivation Letter) توضح الأهداف البحثية واختيار التخصص المطلوب.",
      "اجتياز اختبارات اللغة المعتمدة بالجامعة اللبنانية المعنية أو تقديم ما يثبت الكفاءة اللغوية المطلوبة لبدء المقررات.",
      "التسجيل النهائي ودفع رسوم الساعات الدراسية المعتمدة بعد صدور القبول الأكاديمي من عمادة الدراسات العليا."
    ],
    requirements: [
      "مصدقة التخرج لشهادة البكالوريوس الأصلية مصدقة من الخارجية السورية",
      "كشف علامات جامعي تفصيلي مصدق",
      "وثيقة المعادلة الجامعية الصادرة من وزارة التعليم العالي اللبنانية",
      "سيرة ذاتية محدثة ورسالة دافع",
      "رسائل توصية أكاديمية (عدد 2 على الأقل)",
      "إثبات هوية (جواز سفر وإقامة قانونية في لبنان)"
    ],
    additionalConditions: [
      "يشترط لمرحلة الماجستير ألا يقل التقدير العام للطالب في مرحلة البكالوريوس عن درجة (جيد) في أغلب الأنظمة الجامعية المعتمدة بـلبنان.",
      "قد تطلب بعض الكليات (مثل إدارة الأعمال والعلوم الإنسانية) تقديم بحث أولي أو الخضوع لمقابلة شفهية أمام لجنة علمية قبل منح القبول."
    ]
  },
  {
    id: 15,
    title: "دليل دراسة الدكتوراه في لبنان للطلاب القادمين من سوريا",
    steps: [
      "تصديق شهادتي البكالوريوس والماجستير مع كشوف العلامات التفصيلية لكلا المرحلتين من وزارة الخارجية السورية.",
      "الحصول على المعادلة الرسمية لشهادة الماجستير من وزارة التربية والتعليم العالي اللبنانية (قسم تعادل الشهادات الجامعية).",
      "إعداد مقترح بحثي متكامل وطموح (Research Proposal) يتوافق مع الأبحاث العلمية المتاحة في الكلية المستهدفة.",
      "التواصل المباشر مع أحد الأساتذة الدكاترة (Professors) في الجامعة اللبنانية للحصول على موافقة خطية بالإشراف على الأطروحة.",
      "تقديم الملف الكامل إلى مجلس الشؤون العلمية وعمادة المعهد العالي للدكتوراه في الجامعة والانتظار حتى صدور قرار القبول الرسمي.",
      "تثبيت التسجيل السنوي وتنسيق اللقاءات الدورية مع المشرف الأكاديمي لبدء العمل على الرسالة والبحث."
    ],
    requirements: [
      "شهادة الماجستير ومصدقة البكالوريوس مصدقتين أصولاً من سوريا",
      "كشوف علامات تفصيلية للمرحلتين الجامعيتين (الأولى والعليا)",
      "المعادلة اللبنانية الصادرة لشهادة الماجستير",
      "المقترح البحثي المعتمد للأطروحة باللغة الأجنبية المعتمدة للدراسة",
      "موافقة الأستاذ المشرف على الرسالة",
      "جواز سفر ساري ومستندات إقامة قانونية بـلبنان"
    ],
    additionalConditions: [
      "تتطلب دراسة الدكتوراه في لبنان تفرغاً علمياً وبحثياً واضحاً، والتزاماً بنشر أبحاث في مجلات علمية محكمة كشرط للتخرج.",
      "تعطى الأولوية في القبول للطلاب الذين يملكون خلفية بحثية قوية وإتقاناً تاماً للغة الدراسة (الإنكليزية أو الفرنسية) مع سجل أكاديمي ممتاز."
    ]
  }
];


// FAQ Data
const FAQS = [
  {
    q: "كيف يمكنني التسجيل في الملتقى؟",
    a: "يمكنك إنشاء حساب جديد باستخدام البريد الإلكتروني وكلمة مرور، أو تسجيل الدخول إذا كان لديك حساب بالفعل."
  },
  {
    q: "هل المعلومات في الموقع موثوقة؟",
    a: "نعم، جميع الأخبار والإرشادات يتم التحقق منها من مصادر رسمية مثل وزارة التربية اللبنانية ووزارة التعليم العالي السورية."
  },
  {
    q: "كيف يمكنني طرح سؤال في قسم المجتمع؟",
    a: "بعد تسجيل الدخول، انتقل إلى صفحة المجتمع واضغط على 'طرح سؤال' لمشاركة استفسارك مع الطلاب الآخرين."
  },
  {
    q: "هل يوجد رسوم للاستفادة من خدمات الملتقى؟",
    a: "الملتقى مجاني تماماً لجميع الطلاب السوريين في لبنان."
  },

  // إضافات قوية

  {
    q: "هل يمكنني نشر إعلان أو فرصة تعليمية؟",
    a: "نعم، يمكن للطلاب مشاركة الفرص التعليمية والمنح والدورات بعد مراجعتها من الإدارة لضمان الموثوقية."
  },
  {
    q: "كيف يمكنني التواصل مع إدارة الملتقى؟",
    a: "يمكنك التواصل معنا عبر صفحة التواصل أو من خلال حساباتنا الرسمية على وسائل التواصل الاجتماعي."
  },
  {
    q: "هل يدعم الموقع الهواتف المحمولة؟",
    a: "نعم، تم تصميم المنصة لتعمل بشكل كامل على الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر."
  },
  {
    q: "ما نوع الأخبار التي يتم نشرها؟",
    a: "يتم نشر الأخبار المتعلقة بالجامعات، القرارات الرسمية، المنح الدراسية، التسجيل، والإجراءات التعليمية الخاصة بالطلاب السوريين."
  },
  {
    q: "هل يمكن للطلاب من خارج لبنان الاستفادة من المنصة؟",
    a: "حالياً تركز المنصة على الطلاب السوريين في لبنان، لكن بعض المحتوى والخدمات قد تكون مفيدة للطلاب السوريين في دول أخرى."
  },
  {
    q: "هل يتم حفظ بياناتي بشكل آمن؟",
    a: "نعم، نحرص على حماية بيانات المستخدمين وعدم مشاركتها مع أي جهة خارجية."
  }
];

// Main App Component
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);
  

  // Local auth state (SQLite)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role || 'user');
      setIsAdmin(parsedUser.role === 'admin');
    }
    setLoading(false);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <Navbar user={user} isAdmin={isAdmin} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage user={user} isAdmin={isAdmin} />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/community" element={<CommunityPage user={user} />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/admin" element={<AdminPage user={user} isAdmin={isAdmin} userRole={userRole} />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

// Navbar Component
// function Navbar({ user, isAdmin }: { user: User | null; isAdmin: boolean }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     localStorage.removeItem('currentUser');
//     window.location.href = '/';
//   };

//   const navLinks = [
//     { to: '/', label: 'الرئيسية', icon: Home },
//     { to: '/about', label: 'عن الملتقى', icon: Info },
//     { to: '/news', label: 'الأخبار والتحديثات', icon: Newspaper },
//     { to: '/guides', label: 'الأدلة الإرشادية', icon: BookOpen },
//     { to: '/community', label: 'المجتمع', icon: MessageCircle },
//     { to: '/faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
//   ];

//   return (
//     <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-20 items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-emerald-700 rounded-full flex items-center justify-center">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <div className="font-bold text-2xl text-emerald-900">ملتقى الطلاب السوريين</div>
//               <div className="text-xs text-gray-500 -mt-1">في لبنان</div>
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-8 text-sm font-medium">
//             {navLinks.map(link => (
//               <Link key={link.to} to={link.to} className="text-gray-700 hover:text-emerald-700 transition-colors flex items-center gap-1.5">
//                 <link.icon className="w-4 h-4" /> {link.label}
//               </Link>
//             ))}
//             {isAdmin && (
//               <Link to="/admin" className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 font-semibold">
//                 <Award className="w-4 h-4" /> لوحة الإدارة
//               </Link>
//             )}
//           </div>

//           {/* Auth Buttons */}
//           <div className="flex items-center gap-4">
//             {user ? (
//               <div className="flex items-center gap-3">
//                 <div className="hidden md:flex items-center gap-2 text-sm bg-gray-100 px-3 py-1.5 rounded-full">
//                   <User className="w-4 h-4" />
//                   <span>{user.user_metadata?.name || user.email}</span>
//                 </div>
//                 <button 
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
//                 >
//                   <LogOut className="w-4 h-4" /> تسجيل الخروج
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 to="/login" 
//                 className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-full text-sm font-medium transition"
//               >
//                 <LogIn className="w-4 h-4" /> تسجيل الدخول
//               </Link>
//             )}
            
//             {/* Mobile Menu Button */}
//             <button 
//               onClick={() => setIsOpen(!isOpen)} 
//               className="md:hidden p-2"
//             >
//               <div className="space-y-1">
//                 <div className={`h-0.5 w-6 bg-gray-800 transition ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
//                 <div className={`h-0.5 w-6 bg-gray-800 transition ${isOpen ? 'opacity-0' : ''}`} />
//                 <div className={`h-0.5 w-6 bg-gray-800 transition ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden border-t bg-white px-4 py-4 space-y-1 text-sm">
//           {navLinks.map(link => (
//             <Link key={link.to} to={link.to} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl" onClick={() => setIsOpen(false)}>
//               <link.icon className="w-4 h-4" /> {link.label}
//             </Link>
//           ))}
//           {isAdmin && <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-emerald-700" onClick={() => setIsOpen(false)}>لوحة الإدارة</Link>}
//         </div>
//       )}
//     </nav>
//   );
// }

// Navbar Component
function Navbar({ user, isAdmin }: { user: User | null; isAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

    const navLinks = [
      { to: '/', label: 'الرئيسية', icon: Home },
      { to: '/about', label: 'عن الملتقى', icon: Info },
      { to: '/news', label: 'الأخبار والتحديثات', icon: Newspaper },
      { to: '/guides', label: 'الأدلة الإرشادية', icon: BookOpen },
      { to: '/community', label: 'المجتمع', icon: MessageCircle },
      { to: '/faq', label: 'الأسئلة الشائعة', icon: HelpCircle },

      ...(user ? [
        { to: '/profile', label: 'الملف الشخصي', icon: User }
      ] : [])
    ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 group">
          
          {/* Logo Image */}
          <img
            src="/images/logo1.png"
            alt="ملتقى الطلاب السوريين"
            className="w-14 h-14 object-cover rounded-full border border-emerald-100 shadow-sm group-hover:scale-105 transition"
          />

          {/* Title */}
          <div>
            <div className="font-bold text-2xl text-emerald-900 group-hover:text-emerald-700 transition">
              ملتقى الطلاب السوريين
            </div>

            <div className="text-xs text-gray-500 -mt-1">
              في لبنان
            </div>
          </div>
        </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 font-semibold"
              >
                <Award className="w-4 h-4" />
                لوحة الإدارة
              </Link>
            )}
          </div>
              {/* Auth Buttons */}
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">

                    <Link
                      to="/profile"
                      className="hidden md:flex items-center gap-2 text-sm bg-gray-100 px-3 py-1.5 rounded-full hover:bg-emerald-50 transition"
                    >
                      <User className="w-4 h-4" />

                      <span>
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.email}
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>

                  </div>
                ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-full text-sm font-medium transition"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              <div className="space-y-1">
                <div className={`h-0.5 w-6 bg-gray-800 transition ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <div className={`h-0.5 w-6 bg-gray-800 transition ${isOpen ? 'opacity-0' : ''}`} />
                <div className={`h-0.5 w-6 bg-gray-800 transition ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-1 text-sm">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 text-emerald-700"
              onClick={() => setIsOpen(false)}
            >
              لوحة الإدارة
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

// Homepage
// function HomePage() {
//   const [latestPosts, setLatestPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('/api/posts')
//       .then(res => res.json())
//       .then(data => {
//         setLatestPosts(data.slice(0, 3));
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   return (
//     <div>
//       {/* Hero Section */}
//         <div className="relative min-h-[720px] md:h-[620px] bg-emerald-950 text-white overflow-hidden">        <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: "url('/images/hero3.png')" }}
//         />

//         <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/90 to-emerald-950/70" />

//         <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          
//           <div className="inline-block mb-5 px-4 py-1 bg-white/10 backdrop-blur rounded-full text-sm tracking-wider">
//             منصة رسمية للطلاب السوريين
//           </div>

//           <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
//             ملتقى الطلاب السوريين في لبنان
//           </h1>

//           <div className="mt-4 text-emerald-200 text-lg sm:text-xl md:text-2xl tracking-[2px] sm:tracking-[4px] font-light uppercase">
//             Syrian Students Forum
//           </div>

//           <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-emerald-100 mt-8 mb-10 leading-relaxed px-2">
//             منصة معتمدة توفر أحدث المعلومات والفرص التفاعلية لدعم الطلاب السوريين
//             في مسيرتهم التعليمية داخل لبنان
//           </p>

//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//             <Link
//               to="/news"
//               className="px-10 py-4 bg-white text-emerald-950 font-semibold rounded-2xl hover:bg-white/90 transition flex items-center gap-2"
//             >
//               <Newspaper className="w-5 h-5" />
//               تصفح الأخبار
//             </Link>

//             <Link
//               to="/community"
//               className="px-10 py-4 border-2 border-white/70 hover:bg-white/10 rounded-2xl font-semibold transition flex items-center gap-2"
//             >
//               <MessageCircle className="w-5 h-5" />
//               انضم إلى المجتمع
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Mission Section */}
//       <div className="max-w-5xl mx-auto px-6 py-20">
//         <div className="grid md:grid-cols-2 gap-16 items-center">
//           <div>
//             <div className="uppercase text-emerald-700 tracking-[3px] text-sm mb-3">رسالتنا</div>
//             <h2 className="text-5xl font-semibold tracking-tighter leading-none mb-6">نحن هنا لدعمكم</h2>
//             <p className="text-xl text-gray-600 leading-relaxed">
//               يهدف ملتقى الطلاب السوريين في لبنان إلى تمكين الطلاب السوريين من الوصول إلى المعلومات الدقيقة والخدمات التعليمية، وتوفير منصة آمنة للتفاعل والتبادل.
//             </p>
//           </div>
//           <div className="space-y-5 text-lg">
//             <div className="flex gap-4"><div className="font-semibold text-emerald-700 min-w-[120px]">الرؤية:</div> <div>تمكين جيل متعلم وقادر على المساهمة في بناء مستقبل سوريا.</div></div>
//             <div className="flex gap-4"><div className="font-semibold text-emerald-700 min-w-[120px]">الهدف:</div> <div>تقديم دعم شامل وموثوق لأكثر من ١٢ ألف طالب سوري في لبنان.</div></div>
//           </div>
//         </div>
//       </div>

//       {/* Latest News */}
//       <div className="bg-white py-16 border-t">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="flex justify-between items-end mb-8">
//             <div>
//               <div className="text-emerald-700 text-sm tracking-widest">آخر التحديثات</div>
//               <div className="text-4xl font-semibold">أحدث الأخبار</div>
//             </div>
//             <Link to="/news" className="text-emerald-700 hover:underline flex items-center gap-1">عرض الكل ←</Link>
//           </div>

//           {loading ? (
//             <div className="text-center py-10">جاري التحميل...</div>
//           ) : (
//             <div className="grid md:grid-cols-3 gap-6">
//               {latestPosts.map((post, index) => (
//                 <motion.div whileHover={{ y: -4 }} key={index} className="border bg-white rounded-3xl p-7 group">
//                   <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded mb-4">{post.category}</div>
//                   <h3 className="font-semibold text-xl mb-3 leading-tight group-hover:text-emerald-700 transition">{post.title}</h3>
//                   <p className="text-gray-600 line-clamp-3 mb-4 text-[15px]">{post.content}</p>
//                   <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('ar-EG')}</div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Navigation */}
//       <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-4">
//         {[
//           { icon: BookOpen, title: "الأدلة الإرشادية", desc: "خطوات واضحة لمعادلة الشهادات", link: "/guides" },
//           { icon: MessageCircle, title: "المجتمع التفاعلي", desc: "اسأل وشارك مع الطلاب", link: "/community" },
//           { icon: Newspaper, title: "الأخبار والقرارات", desc: "متابعة التحديثات الرسمية", link: "/news" },
//           { icon: HelpCircle, title: "الأسئلة الشائعة", desc: "إجابات سريعة لاستفساراتكم", link: "/faq" },
//         ].map((item, idx) => (
//           <Link to={item.link} key={idx} className="group bg-white border hover:border-emerald-200 p-8 rounded-3xl transition">
//             <item.icon className="w-9 h-9 text-emerald-700 mb-6 group-hover:scale-110 transition" />
//             <div className="font-semibold text-xl mb-1.5">{item.title}</div>
//             <p className="text-sm text-gray-600">{item.desc}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// Homepage
function HomePage() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setLatestPosts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">

      {/* Hero Section */}
      <div className="relative min-h-[720px] md:h-[620px] bg-emerald-950 text-white overflow-hidden">

        {/* Background */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero3.png')" }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/90 to-emerald-950/70" />

        {/* Floating Blur */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 blur-3xl rounded-full" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-5 px-4 py-1 bg-white/10 backdrop-blur rounded-full text-sm tracking-wider border border-white/10"
          >
            منصة رسمية للطلاب السوريين
          </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-tight"
        >
          ملتقى الطلاب السوريين
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl font-medium mt-2 inline-block text-emerald-200">
            في لبنان
          </span>
        </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 text-emerald-200 text-lg sm:text-xl md:text-2xl tracking-[2px] sm:tracking-[4px] font-light uppercase"
          >
            Syrian Students Forum
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-emerald-100 mt-8 mb-10 leading-relaxed px-2"
          >
            منصة معتمدة توفر أحدث المعلومات والفرص التفاعلية لدعم الطلاب السوريين
            في مسيرتهم التعليمية داخل لبنان
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >

            <Link
              to="/news"
              className="px-10 py-4 bg-white text-emerald-950 font-semibold rounded-2xl hover:bg-white/90 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Newspaper className="w-5 h-5" />
              تصفح الأخبار
            </Link>

            <Link
              to="/community"
              className="px-10 py-4 border-2 border-white/70 hover:bg-white/10 hover:scale-105 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
            >
              <MessageCircle className="w-5 h-5" />
              انضم إلى المجتمع
            </Link>

          </motion.div>

        </div>
      </div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-20"
      >

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div>

            <div className="uppercase text-emerald-700 tracking-[3px] text-sm mb-3">
              رسالتنا
            </div>

            <h2 className="text-5xl font-semibold tracking-tighter leading-none mb-6">
              نحن هنا لدعمكم
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              يهدف ملتقى الطلاب السوريين في لبنان إلى تمكين الطلاب السوريين من الوصول إلى المعلومات الدقيقة والخدمات التعليمية، وتوفير منصة آمنة للتفاعل والتبادل.
            </p>

          </div>

          <div className="space-y-5 text-lg">

            <motion.div
              whileHover={{ x: -5 }}
              className="flex gap-4 bg-white border rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="font-semibold text-emerald-700 min-w-[120px]">
                الرؤية:
              </div>

              <div>
                تمكين جيل متعلم وقادر على المساهمة في بناء مستقبل سوريا.
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: -5 }}
              className="flex gap-4 bg-white border rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="font-semibold text-emerald-700 min-w-[120px]">
                الهدف:
              </div>

              <div>
                تقديم دعم شامل وموثوق لأكثر من ١٢ ألف طالب سوري في لبنان.
              </div>
            </motion.div>

          </div>

        </div>

      </motion.div>

      {/* Latest News */}
      <div className="bg-white py-16 border-t">

        <div className="max-w-6xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-8"
          >

            <div>

              <div className="text-emerald-700 text-sm tracking-widest">
                آخر التحديثات
              </div>

              <div className="text-4xl font-semibold">
                أحدث الأخبار
              </div>

            </div>

            <Link
              to="/news"
              className="text-emerald-700 hover:underline flex items-center gap-1"
            >
              عرض الكل ←
            </Link>

          </motion.div>

          {loading ? (
            <div className="text-center py-10">
              جاري التحميل...
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">

              {latestPosts.map((post, index) => (

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -8,
                    scale: 1.02
                  }}
                  key={index}
                  className="border bg-white rounded-3xl p-7 group shadow-sm hover:shadow-2xl transition-all duration-500"
                >

                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded mb-4">
                    {post.category}
                  </div>

                  <h3 className="font-semibold text-xl mb-3 leading-tight group-hover:text-emerald-700 transition">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 line-clamp-3 mb-4 text-[15px]">
                    {post.content}
                  </p>

                  <div className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('ar-EG')}
                  </div>

                </motion.div>

              ))}

            </div>
          )}

        </div>

      </div>

      {/* Quick Navigation */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-4">

        {[
          {
            icon: BookOpen,
            title: "الأدلة الإرشادية",
            desc: "خطوات واضحة لمعادلة الشهادات",
            link: "/guides"
          },
          {
            icon: MessageCircle,
            title: "المجتمع التفاعلي",
            desc: "اسأل وشارك مع الطلاب",
            link: "/community"
          },
          {
            icon: Newspaper,
            title: "الأخبار والقرارات",
            desc: "متابعة التحديثات الرسمية",
            link: "/news"
          },
          {
            icon: HelpCircle,
            title: "الأسئلة الشائعة",
            desc: "إجابات سريعة لاستفساراتكم",
            link: "/faq"
          },
        ].map((item, idx) => (

          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{
              y: -10,
              scale: 1.02
            }}
          >

            <Link
              to={item.link}
              className="group bg-white border hover:border-emerald-200 p-8 rounded-3xl transition-all duration-500 block shadow-sm hover:shadow-2xl"
            >

              <item.icon className="w-9 h-9 text-emerald-700 mb-6 group-hover:scale-110 transition duration-300" />

              <div className="font-semibold text-xl mb-1.5">
                {item.title}
              </div>

              <p className="text-sm text-gray-600">
                {item.desc}
              </p>

            </Link>

          </motion.div>

        ))}

      </div>

    </div>
  );
}





// About Page
function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        {/* <div className="text-emerald-700 tracking-[2px] text-sm">
          من نحن
        </div> */}

        <h1 className="text-6xl font-bold tracking-tighter mt-3">
          عن ملتقى الطلاب السوريين
        </h1>
      </div>

      {/* Intro */}
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">

        <img
          src="/images/team.jpeg"
          alt="طلاب سوريون"
          className="w-full rounded-3xl mb-12 shadow transition duration-500 hover:scale-[1.02] hover:shadow-2xl"
        />

        <p className="text-2xl font-light mb-12">
          تأسس ملتقى الطلاب السوريين في لبنان كمبادرة تطوعية تهدف إلى دعم الطلاب السوريين الذين يواجهون تحديات تعليمية وإدارية في لبنان.
        </p>

        {/* GOALS */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-24"
        >

          <div className="text-center mb-14">

            <h2 className="
              text-4xl
              md:text-5xl
              font-bold
              text-gray-900
            ">
              أهداف الملتقى
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {[
              'توفير معلومات موثوقة ومحدثة',
              'تسهيل الإجراءات الجامعية',
              'بناء مجتمع طلابي داعم',
              'مساعدة الطلاب أكاديمياً وإدارياً'
            ].map((goal, index) => (

              <motion.div
                key={index}
                whileHover={{
                  y: -6
                }}
                className="
                  bg-white
                  border
                  rounded-3xl
                  p-8
                  shadow-sm
                  hover:shadow-xl
                  transition-all
                  duration-500
                  flex
                  items-center
                  gap-5
                "
              >

                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-emerald-100
                  flex
                  items-center
                  justify-center
                  text-emerald-700
                  font-bold
                  text-xl
                ">
                  ✓
                </div>

                <div className="
                  text-lg
                  font-medium
                  text-gray-800
                ">
                  {goal}
                </div>

              </motion.div>

            ))}

          </div>

        </motion.div>
        <div><br /></div>
                {/* Achievements */}
        <h3 className="text-3xl font-semibold mt-16 mb-8 border-r-4 border-emerald-700 pr-4">
          أبرز أعمالنا وإنجازاتنا
        </h3>

        <div className="grid md:grid-cols-3 gap-6 not-prose mb-16">

          {/* Achievement 1 */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white group">

            <div className="bg-emerald-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Users className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold mb-2 text-emerald-950">
              متابعة ديبلوماسية
            </h4>

            <p className="text-gray-600 text-sm leading-relaxed">
              عقد اجتماعات مستمرة مع سفارة الجمهورية العربية السورية في بيروت لمتابعة وحل مشاكل الطلاب، لا سيما أزمات الإقامة والتسجيل الجامعي.
            </p>

          </div>

          {/* Achievement 2 */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white group">

            <div className="bg-emerald-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition duration-300 group-hover:scale-110 group-hover:rotate-6">
              <GraduationCap className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold mb-2 text-emerald-950">
              حفل التخرج الأول 2025
            </h4>

            <p className="text-gray-600 text-sm leading-relaxed">
              تنظيم وإقامة أول حفل تخرج رسمي مخصص للطلاب السوريين في لبنان عام 2025، تقديراً لجهودهم وتفوقهم رغم كل التحديات.
            </p>

          </div>

          {/* Achievement 3 */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white group">

            <div className="bg-emerald-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition duration-300 group-hover:scale-110 group-hover:rotate-6">
              <MessagesSquare className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold mb-2 text-emerald-950">
              الدعم الاستشاري الرقمي
            </h4>

            <p className="text-gray-600 text-sm leading-relaxed">
              المتابعة اليومية الفورية لكافة استفسارات وأسئلة الطلاب عبر منصات التواصل الاجتماعي ومجموعات الدعم لتوجيههم دراسياً وقانونياً.
            </p>

          </div>

          {/* Achievement 4 */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white group">

            <div className="bg-emerald-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition duration-300 group-hover:scale-110 group-hover:rotate-6">
              <BookOpen className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold mb-2 text-emerald-950">
              التطوير والتمكين المعرفي
            </h4>

            <p className="text-gray-600 text-sm leading-relaxed">
              تقديم دورات تدريبية وورش عمل مجانية بالكامل في مجالات علمية وتكنولوجية وتوعوية مختلفة، لبناء قدرات الطلاب وتأهيلهم الأكاديمي والمهني.
            </p>

          </div>

        </div>
        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">

          {[
            {
              number: "500+",
              label: "طالب وطالبة"
            },
            {
              number: "20+",
              label: "جامعة ومعهد"
            },
            {
              number: "1000+",
              label: "استشارة ودعم"
            }
          ].map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                scale: 1.02
              }}
              className="
                bg-white/70
                backdrop-blur-xl
                border
                border-white/20
                rounded-3xl
                p-10
                text-center
                shadow-lg
                hover:shadow-2xl
                transition-all
                duration-500
              "
            >

              <div className="
                text-5xl
                font-black
                text-emerald-700
              ">
                {item.number}
              </div>

              <div className="
                mt-4
                text-gray-600
                text-lg
              ">
                {item.label}
              </div>

            </motion.div>

          ))}

        </div>


        {/* Beneficiaries */}
        <h3 className="text-3xl font-semibold mt-14 mb-6">
          من المستفيدون؟
        </h3>

        <p className="mb-16">
          جميع الطلاب السوريين في لبنان من مرحلة الثانوية حتى الدراسات العليا، بالإضافة إلى العائلات السورية الباحثة عن فرص تعليمية لأبنائها.
        </p>

      </div>

              {/* TEAM */}
        <div className="mb-24">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >

            <h2 className="
              text-5xl
              font-black
              text-gray-900
            ">
              أعضاء الملتقى
            </h2>

          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
                {
                name: 'وئام الشاكوش',
                role: 'رئيسة الملتقى',
                image: '/images/team/weam.jpeg',
                desc: 'تنظم المبادرات واللقاءات والأنشطة التعليمية للطلاب.'
              },
              {
                name: 'عبد القادر عودة',
                role: 'مستشار أكاديمي',
                image: '/images/team/abedelkader.jpeg',
                desc: 'نائب الرئيس مسؤول عن الجامعات الخاصة'
              },
                {name: 'مصطفى المحيميد',
                role: 'مطور ومشرف تقني',
                image: '/images/team/mustafa.jpeg',
                desc: 'يهتم بتطوير المنصة وإدارة الأنظمة التقنية ودعم الطلاب رقمياً.'
              },
              {
                name: 'وليد ريحاوي',
                role: 'منسق شؤون جامعية',
                image: '/images/team/walid.jpeg',
                desc: 'مساعدة الطلاب في الجامعة وخصوصا الكليات الطبية'
              },
              {
                name: 'عبدالبديع دشق',
                role: 'مشرف دعم طلابي',
                image: '/images/team/abedbadih.jpeg',
                desc: 'يعمل على متابعة استفسارات الطلاب وتقديم الدعم المباشر بالاضافة لاختصاص الصيدلة.'
              },
              {
                name: 'زاهدة العابد',
                role: 'مسؤولة الإعلام والتواصل',
                image: '/images/team/zahida1.jpeg',
                desc: 'علاقات مباشرة مع الطلاب بالاضافة منسق في سوريا'
              },

              {
                name: 'عمر سمعو',
                role: 'مستشار أكاديمي ومطور تقني',
                image: '/images/team/omar.jpeg',
                desc: 'يقدم إرشادات أكاديمية حول الاختصاصات والجامعات خصوصا كلية الادارة والاقتصاد.'
              }
            ].map((member, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -12,
                  scale: 1.02
                }}
                transition={{
                  duration: 0.5
                }}
                viewport={{ once: true }}
                className="
                  bg-white/70
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-3xl
                  overflow-hidden
                  shadow-lg
                  hover:shadow-2xl
                  transition-all
                  duration-500
                "
              >

                <div className="overflow-hidden">

                  <img
                    src={member.image}
                    alt={member.name}
                    className="
                      w-full
                      h-80
                      object-cover
                      hover:scale-110
                      transition-transform
                      duration-700
                    "
                  />

                </div>

                <div className="p-7">

                  <h3 className="
                    text-2xl
                    font-bold
                    text-gray-900
                  ">
                    {member.name}
                  </h3>

                  <div className="
                    text-emerald-700
                    mt-2
                    text-sm
                    font-medium
                  ">
                    {member.role}
                  </div>

                  <p className="
                    text-gray-600
                    mt-5
                    leading-relaxed
                    text-sm
                  ">
                    {member.desc}
                  </p>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      {/* Notice */}
      <div className="bg-amber-50/60 border border-amber-200/70 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right mt-16 shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-1">

        <div className="bg-amber-600 text-white p-3 rounded-2xl shadow-sm shrink-0">
          <HeartHandshake className="w-6 h-6" />
        </div>

        <div>

          <h4 className="text-lg font-bold text-amber-950 mb-1">
            تنويه وعهد شفافية
          </h4>

          <p className="text-amber-900 text-sm leading-relaxed m-0">
            نحن في ملتقى الطلاب السوريين نسعى جاهدين وبشكل تطوعي كامل لخدمتكم ولتسهيل الإجراءات الأكاديمية والإدارية لكافة الطلاب، ونؤكد أننا <strong>لا نتلقى أي دعم مادي من أي جهة أو أحد</strong>، وغايتنا الأولى والأخيرة هي مصلحة الطالب ومساندته.
          </p>

        </div>

      </div>

    </div>
  );
}


// News & Updates Page with CRUD for Admin
function NewsPage({ user, isAdmin }: { user: User | null; isAdmin: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [newPost, setNewPost] = useState({ title: '', content: '', category: CATEGORIES[0] });

  const fetchPosts = () => {
    fetch('/api/posts').then(r => r.json()).then(setPosts);
  };

  useEffect(() => { fetchPosts(); }, []);

  const filteredPosts = posts.filter(p => 
    (selectedCategory === 'الكل' || p.category === selectedCategory) &&
    (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddOrEdit = async () => {
    const method = editingPost ? 'PUT' : 'POST';
    const body = editingPost ? { id: editingPost.id, ...newPost } : newPost;

    const res = await fetch('/api/posts', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (res.ok) {
      fetchPosts();
      setShowAddModal(false);
      setEditingPost(null);
      setNewPost({ title: '', content: '', category: CATEGORIES[0] });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchPosts();
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content, category: post.category });
    setShowAddModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">الأخبار والتحديثات</h1>
          <p className="mt-2 text-gray-600">آخر التطورات والقرارات الرسمية</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setEditingPost(null); setNewPost({ title: '', content: '', category: CATEGORIES[0] }); setShowAddModal(true); }}
            className="flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-2xl text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> إضافة خبر جديد
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        <input 
          type="text" 
          placeholder="ابحث في الأخبار..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-5 py-3 rounded-2xl flex-1 max-w-xs focus:outline-none focus:border-emerald-400"
        />
        {['الكل', ...CATEGORIES].map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm transition ${selectedCategory === cat ? 'bg-emerald-700 text-white' : 'bg-white border hover:bg-gray-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="space-y-6">
        {filteredPosts.length === 0 && <div className="text-center py-20 text-gray-500">لا توجد أخبار مطابقة للبحث</div>}
        
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white p-9 border border-gray-100 rounded-3xl">
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">{post.category}</span>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {new Date(post.created_at).toLocaleDateString('ar-EG')}
                {isAdmin && (
                  <div className="flex gap-1 ml-3">
                    <button onClick={() => openEdit(post)} className="p-1 hover:text-emerald-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(post.id)} className="p-1 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
            <h2 className="font-semibold text-3xl tracking-tight mb-4">{post.title}</h2>
            <p className="text-[17px] text-gray-700 whitespace-pre-line leading-relaxed">{post.content}</p>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-9">
            <h3 className="font-semibold text-2xl mb-6">{editingPost ? 'تعديل الخبر' : 'إضافة خبر جديد'}</h3>
            
            <input value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} placeholder="عنوان الخبر" className="w-full border p-4 rounded-2xl mb-4 text-lg" />
            
            <select value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})} className="w-full border p-4 rounded-2xl mb-4">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <textarea value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} placeholder="المحتوى..." rows={7} className="w-full border p-4 rounded-3xl mb-6 resize-y" />
            
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowAddModal(false); setEditingPost(null); }} className="px-7 py-3 rounded-2xl">إلغاء</button>
              <button onClick={handleAddOrEdit} className="px-8 py-3 bg-emerald-700 text-white rounded-2xl">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function GuidesPage() {
  // تخزين الـ id الخاص بالدليل المفتوح حالياً (افتراضياً يفتح الأول)
  const [activeGuideId, setActiveGuideId] = useState<number | null>(1);

  const toggleGuide = (id: number) => {
    setActiveGuideId(activeGuideId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16" dir="rtl">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="text-emerald-600 text-sm tracking-[3px] font-medium uppercase">
          معلومات موثوقة
        </div>
        <h1 className="font-bold text-5xl md:text-6xl tracking-tighter mt-3 text-slate-900">
          الأدلة الإرشادية
        </h1>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {GUIDES.map((guide, idx) => {
          const isOpen = activeGuideId === guide.id;

          return (
            <div
              key={guide.id}
              className={`border rounded-3xl bg-white transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? "shadow-md border-emerald-500/30 ring-1 ring-emerald-500/10" 
                  : "shadow-sm hover:shadow-md border-slate-200/80"
              }`}
            >
              {/* Trigger Button */}
              <button
                onClick={() => toggleGuide(guide.id)}
                className="w-full flex justify-between items-center px-8 py-6 md:px-10 md:py-8 text-right focus:outline-none group"
              >
                <div className="flex items-center gap-5">
                  {/* Index Number */}
                  <div className={`text-3xl md:text-4xl font-bold transition-colors duration-300 ${
                    isOpen ? "text-emerald-500" : "text-slate-200 group-hover:text-slate-300"
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  {/* Title */}
                  <h2 className={`font-semibold text-xl md:text-2xl tracking-tight transition-colors ${
                    isOpen ? "text-emerald-900" : "text-slate-800 group-hover:text-emerald-700"
                  }`}>
                    {guide.title}
                  </h2>
                </div>

                {/* Status Indicator Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isOpen 
                    ? "bg-emerald-500 border-emerald-500 text-white rotate-185" 
                    : "bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-slate-100"
                }`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2.5} 
                    stroke="currentColor" 
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {/* Animated Content Expansion */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-10 md:px-10 md:pb-12 border-t border-slate-100 pt-8 bg-slate-50/40">
                      <div className="grid md:grid-cols-5 gap-10">
                        
                        {/* Steps (Col: 3) */}
                        <div className="md:col-span-3">
                          <div className="font-bold mb-6 text-xs uppercase tracking-wider text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-md">
                            الخطوات بالتفصيل
                          </div>

                          <ol className="space-y-4 text-[15px] leading-relaxed text-slate-700">
                            {guide.steps.map((step, i) => (
                              <li
                                key={i}
                                className="pr-9 relative before:absolute before:right-0 before:top-0.5 before:w-6 before:h-6 before:bg-emerald-50 before:rounded-full before:content-['✓'] before:flex before:items-center before:justify-center before:text-emerald-600 before:text-xs before:font-bold"
                              >
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Requirements & Extra Conditions (Col: 2) */}
                        <div className="md:col-span-2 space-y-6">
                          {/* Requirements */}
                          <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
                            <div className="font-bold mb-4 text-base text-slate-900 flex items-center gap-2">
                              <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block"></span>
                              الشروط والمتطلبات
                            </div>

                            <ul className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
                              {Array.isArray(guide.requirements) ? (
                                guide.requirements.map((req, i) => (
                                  <li key={i} className="flex gap-2 items-start">
                                    <span className="text-emerald-500 mt-0.5">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="flex gap-2 items-start">
                                  <span className="text-emerald-500 mt-0.5">•</span>
                                  <span>{guide.requirements}</span>
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Additional Conditions */}
                          {"additionalConditions" in guide && guide.additionalConditions && (
                            <div className="bg-amber-50/60 border border-amber-100 p-6 rounded-2xl">
                              <div className="font-bold mb-4 text-base text-amber-800 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block"></span>
                                تنويهات وشروط إضافية
                              </div>

                              <ul className="space-y-3 text-sm text-amber-900/80 leading-relaxed">
                                {guide.additionalConditions.map((condition, i) => (
                                  <li key={i} className="flex gap-2 items-start">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{condition}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Community Page: Questions + Comments on posts
function CommunityPage({ user }: { user: User | null }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'questions' | 'discussions'>('questions');
  
  // Replies for questions
  const [questionReplies, setQuestionReplies] = useState<Record<number, any[]>>({});
  const [replyContent, setReplyContent] = useState<Record<number, string>>({});

  const fetchQuestions = () => fetch('/api/questions').then(r => r.json()).then(setQuestions);
  const fetchPosts = () => fetch('/api/posts').then(r => r.json()).then(setPosts);

  const loadReplies = async (questionId: number) => {
    const res = await fetch(`/api/question-replies?question_id=${questionId}`);
    const data = await res.json();
    setQuestionReplies(prev => ({ ...prev, [questionId]: data }));
  };

  useEffect(() => {
    fetchQuestions();
    fetchPosts();
  }, []);

  const loadComments = async (postId: number) => {
    const res = await fetch(`/api/comments?post_id=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  const openPostDiscussion = (post: Post) => {
    setSelectedPost(post);
    loadComments(post.id);
    setActiveTab('discussions');
  };

  const submitQuestion = async () => {
    if (!user || !newQuestion.title) return alert('يجب تسجيل الدخول لإضافة سؤال');
    
    await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        user_name: `${user.first_name} ${user.last_name}` || user.email,
        ...newQuestion
      })
    });
    setNewQuestion({ title: '', content: '' });
    fetchQuestions();
  };

  const submitReply = async (questionId: number) => {
    if (!user || !replyContent[questionId]) return;
    
    await fetch('/api/question-replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: questionId,
        user_id: user.id,
        user_name: `${user.first_name} ${user.last_name}` || user.email,
        content: replyContent[questionId]
      })
    });
    
    setReplyContent(prev => ({ ...prev, [questionId]: '' }));
    loadReplies(questionId);
  };

  const submitComment = async () => {
    if (!user || !selectedPost || !newComment) return;
    
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: selectedPost.id,
        user_id: user.id,
        user_name: `${user.first_name} ${user.last_name}` || user.email,
        content: newComment
      })
    });
    setNewComment('');
    loadComments(selectedPost.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="font-bold text-5xl tracking-tighter">المجتمع التفاعلي</h1>
          <p className="text-gray-600 mt-1">شارك وتفاعل مع الطلاب السوريين</p>
        </div>
        {!user && <Link to="/login" className="text-emerald-700 underline">سجّل الدخول للمشاركة</Link>}
      </div>

      <div className="flex border-b mb-8">
        <button onClick={() => setActiveTab('questions')} className={`px-6 py-4 font-medium border-b-2 ${activeTab === 'questions' ? 'border-emerald-700 text-emerald-700' : 'border-transparent'}`}>الأسئلة والاستفسارات</button>
        <button onClick={() => setActiveTab('discussions')} className={`px-6 py-4 font-medium border-b-2 ${activeTab === 'discussions' ? 'border-emerald-700 text-emerald-700' : 'border-transparent'}`}>نقاشات على الأخبار</button>
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div>
          {user && (
            <div className="bg-white p-8 mb-8 border rounded-3xl">
              <h3 className="font-semibold mb-4 text-xl">اطرح سؤالاً جديداً</h3>
              <input value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} placeholder="عنوان السؤال" className="w-full border p-3.5 rounded-2xl mb-3" />
              <textarea value={newQuestion.content} onChange={e => setNewQuestion({...newQuestion, content: e.target.value})} placeholder="التفاصيل..." rows={3} className="w-full border p-3.5 rounded-2xl mb-3" />
              <button onClick={submitQuestion} className="bg-emerald-700 text-white px-7 py-3 rounded-full text-sm">نشر السؤال</button>
            </div>
          )}

          <div className="space-y-4">
            {questions.map(q => (
              <div key={q.id} className="bg-white border p-8 rounded-3xl">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-medium">{q.user_name}</span>
                  <span className="text-gray-400">{new Date(q.created_at).toLocaleDateString('ar')}</span>
                </div>
                <div className="font-semibold text-2xl mb-3">{q.title}</div>
                <p className="text-gray-700 mb-4">{q.content}</p>

                {/* Replies Section */}
                <div className="mt-6 border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-medium text-emerald-700">الإجابات والردود ({(questionReplies[q.id] || []).length})</div>
                    <button 
                      onClick={() => loadReplies(q.id)} 
                      className="text-xs text-emerald-700 hover:underline"
                    >
                      تحديث الردود
                    </button>
                  </div>

                  {/* Display Replies */}
                  <div className="space-y-3 mb-4">
                    {(questionReplies[q.id] || []).map((reply: any) => (
                      <div key={reply.id} className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-emerald-800">{reply.user_name}</span>
                          <span className="text-xs text-gray-400">{new Date(reply.created_at).toLocaleDateString('ar')}</span>
                        </div>
                        <div className="text-gray-700">{reply.content}</div>
                      </div>
                    ))}
                    {(!questionReplies[q.id] || questionReplies[q.id].length === 0) && (
                      <div className="text-sm text-gray-500">لا توجد إجابات بعد. كن أول من يجيب!</div>
                    )}
                  </div>

                  {/* Reply Input */}
                  {user && (
                    <div className="flex gap-3">
                      <input 
                        value={replyContent[q.id] || ''} 
                        onChange={e => setReplyContent(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="اكتب إجابتك أو ردك هنا..." 
                        className="flex-1 border px-5 py-3 rounded-2xl text-sm" 
                      />
                      <button 
                        onClick={() => submitReply(q.id)} 
                        className="px-6 py-3 bg-emerald-700 text-white rounded-2xl text-sm font-medium"
                      >
                        إرسال الرد
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discussions Tab */}
      {activeTab === 'discussions' && (
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="font-medium mb-4 px-1">اختر خبراً للمشاركة</div>
            {posts.map(post => (
              <button key={post.id} onClick={() => openPostDiscussion(post)} className={`w-full text-right p-5 mb-2 border rounded-2xl text-sm hover:bg-gray-50 ${selectedPost?.id === post.id ? 'border-emerald-700' : ''}`}>
                {post.title}
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            {selectedPost ? (
              <div>
                <div className="font-semibold text-2xl mb-6 border-b pb-4">{selectedPost.title}</div>
                
                {user && (
                  <div className="flex mb-7 gap-3">
                    <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="اكتب تعليقك..." className="flex-1 border px-5 py-3 rounded-full" />
                    <button onClick={submitComment} className="px-7 bg-emerald-700 text-white rounded-full">إرسال</button>
                  </div>
                )}
                
                <div className="space-y-4">
                  {comments.length === 0 && <div className="text-gray-500">لا توجد تعليقات بعد. كن أول المعلقين!</div>}
                  {comments.map(c => (
                    <div key={c.id} className="bg-white p-6 border rounded-2xl">
                      <div className="flex justify-between text-sm mb-2"><span className="font-medium">{c.user_name}</span> <span className="text-gray-400">{new Date(c.created_at).toLocaleDateString('ar')}</span></div>
                      <div>{c.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="text-gray-500 py-8">اختر خبراً من القائمة لعرض التعليقات والمشاركة</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// FAQ Page
function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="font-bold text-6xl tracking-tighter">الأسئلة الشائعة</h1>
      </div>
      <div className="space-y-3">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="border rounded-3xl overflow-hidden bg-white">
            <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex justify-between items-center px-9 py-7 text-lg font-medium text-right">
              {faq.q}
              <span className="text-2xl text-emerald-600">{openIndex === idx ? '−' : '+'}</span>
            </button>
            {openIndex === idx && (
              <div className="px-9 pb-8 text-gray-600 text-[15px] leading-relaxed border-t pt-5">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Dashboard - Full Role-Based Management
function AdminPage({ user, isAdmin, userRole }: { user: User | null; isAdmin: boolean; userRole: string }) {
  
  //const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'questions' | 'users'>('posts');
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'questions' | 'users' | 'announcements'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: CATEGORIES[0] });

    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementMessage, setAnnouncementMessage] = useState('');
    const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

    const [userSearch, setUserSearch] = useState('');

    //const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const getAuthHeaders = () => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return {
        'Content-Type': 'application/json',
        'x-user-id': user.id || ''
      };
    };

  const fetchAllData = async () => {
    setLoadingData(true);
    const headers = getAuthHeaders();

    try {
      const postsRes = await fetch('/api/admin/posts', { headers });
      if (postsRes.ok) setPosts(await postsRes.json());

      const commentsRes = await fetch('/api/admin/comments', { headers });
      if (commentsRes.ok) setComments(await commentsRes.json());

      const questionsRes = await fetch('/api/admin/questions', { headers });
      if (questionsRes.ok) setQuestions(await questionsRes.json());

      const usersRes = await fetch('/api/admin/users', { headers });
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (e) {
      console.error('Admin data fetch error');
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (isAdmin) fetchAllData();
  }, [isAdmin]);

  // Protected API Calls
const adminApiCall = async (endpoint: string, method: string, body?: any) => {
  const res = await fetch(endpoint, {
    method,
    headers: getAuthHeaders(),           // ← هون التعديل
    body: body ? JSON.stringify(body) : undefined
  });
  return res.ok;
};

  // Posts Management
  const handleSavePost = async () => {
    const success = await adminApiCall(
      editingPost ? '/api/admin/posts' : '/api/admin/posts',
      editingPost ? 'PUT' : 'POST',
      editingPost ? { id: editingPost.id, ...newPost } : newPost
    );
    if (success) {
      setShowPostModal(false);
      setEditingPost(null);
      setNewPost({ title: '', content: '', category: CATEGORIES[0] });
      fetchAllData();
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('حذف الخبر؟')) return;
    const success = await adminApiCall('/api/admin/posts', 'DELETE', { id });
    if (success) fetchAllData();
  };

  const openEditPost = (post: Post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content, category: post.category });
    setShowPostModal(true);
  };

  // Comments Management
  const handleDeleteComment = async (id: number) => {
    if (!confirm('حذف التعليق؟')) return;
    const success = await adminApiCall('/api/admin/comments', 'DELETE', { id });
    if (success) fetchAllData();
  };

  // Questions Management
  const handleToggleAnswered = async (q: Question) => {
    const success = await adminApiCall('/api/admin/questions', 'PUT', { id: q.id, answered: !q.answered });
    if (success) fetchAllData();
  };
  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('حذف السؤال؟')) return;
    const success = await adminApiCall('/api/admin/questions', 'DELETE', { id });
    if (success) fetchAllData();
  };

  // Users Management
  const handleChangeRole = async (id: string, newRole: string) => {
    const success = await adminApiCall('/api/admin/users', 'PUT', { id, role: newRole });
    if (success) fetchAllData();
  };
  const handleDeleteUser = async (id: string) => {
    if (!confirm('حذف المستخدم نهائياً؟')) return;
    const success = await adminApiCall('/api/admin/users', 'DELETE', { id });
    if (success) fetchAllData();
  };

      // Filter users based on search
          const filteredUsers = users.filter((u) => {

          const fullName =
            `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();

          return (
            fullName.includes(userSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.university?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.major?.toLowerCase().includes(userSearch.toLowerCase())
          );
        });
// Export users to Excel
    //     const exportUsersExcel = () => {

    //   const data = users.map((u) => ({
    //     'الاسم الأول': u.first_name,
    //     'الاسم الأخير': u.last_name,
    //     'تاريخ الميلاد': u.birthday,
    //     'الجامعة': u.university,
    //     'التخصص': u.major,
    //     'البريد الإلكتروني': u.email,
    //     'الدور': u.role,
    //     'تاريخ التسجيل': new Date(u.created_at).toLocaleDateString('ar')
    //   }));

    //   const worksheet = XLSX.utils.json_to_sheet(data);

    //   const workbook = XLSX.utils.book_new();

    //   XLSX.utils.book_append_sheet(
    //     workbook,
    //     worksheet,
    //     'Users'
    //   );

    //   const excelBuffer = XLSX.write(workbook, {
    //     bookType: 'xlsx',
    //     type: 'array'
    //   });

    //   const fileData = new Blob(
    //     [excelBuffer],
    //     {
    //       type:
    //         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //     }
    //   );

    //   saveAs(
    //     fileData,
    //     `users-${Date.now()}.xlsx`
    //   );
    // };



  //Annoncement 
  
        const exportUsersCSV = () => {

        const headers = [
          'First Name',
          'Last Name',
          'Email',
          'University',
          'Major',
          'Birthday',
          'Role',
          'Created At',
          'phone'
        ];

        const rows = filteredUsers.map((u) => [
          u.first_name || '',
          u.last_name || '',
          u.email || '',
          u.university || '',
          u.major || '',
          u.birthday || '',
          u.role || '',
          u.created_at || '',
          u.phone || ''
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map(row =>
            row.map(field => `"${field}"`).join(',')
          )
        ].join('\n');

          const blob = new Blob(
            ['\uFEFF' + csvContent],
            { type: 'text/csv;charset=utf-8;' }
          );

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.download = 'users.csv';

        link.click();

        URL.revokeObjectURL(url);
      };
  
  const handleSendAnnouncement = async () => {

      if (!announcementTitle || !announcementMessage) {
        alert('يرجى تعبئة جميع الحقول');
        return;
      }

      setSendingAnnouncement(true);

      try {

        const res = await fetch('/api/admin/send-announcement', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title: announcementTitle,
            message: announcementMessage
          })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'فشل الإرسال');
        }

        alert('تم إرسال الإشعار لجميع المستخدمين');

        setAnnouncementTitle('');
        setAnnouncementMessage('');

      } catch (err: any) {

        alert(err.message);

      }

      setSendingAnnouncement(false);
    };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-3xl font-bold">وصول مقيد</h2>
        <p className="mt-3 text-gray-600">هذه الصفحة مخصصة للمشرفين فقط.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex justify-between items-end mb-9">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">لوحة الإدارة</h1>
          <p className="text-gray-600 mt-1">إدارة المحتوى والمستخدمين</p>
        </div>
        <button onClick={fetchAllData} disabled={loadingData} className="px-6 py-3 text-sm border rounded-2xl">تحديث البيانات</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-9 text-sm">
        {[
            { id: 'posts', label: 'إدارة الأخبار', count: posts.length },
            { id: 'comments', label: 'التعليقات', count: comments.length },
            { id: 'questions', label: 'الأسئلة', count: questions.length },
            { id: 'users', label: 'المستخدمين', count: users.length },
            { id: 'announcements', label: 'الإشعارات البريدية', count: users.length }
          ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`px-8 py-4 font-medium border-b-2 transition ${activeTab === tab.id ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-gray-500'}`}
          >
            {tab.label} <span className="text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {loadingData && <div className="py-12 text-center text-gray-400">جاري تحميل البيانات...</div>}

      {/* POSTS TAB */}
      {activeTab === 'posts' && (
        <div>
          <div className="flex justify-between mb-6">
            <div className="text-xl font-semibold">جميع الأخبار ({posts.length})</div>
            <button 
              onClick={() => { setEditingPost(null); setNewPost({ title: '', content: '', category: CATEGORIES[0] }); setShowPostModal(true); }} 
              className="flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-2xl text-sm"
            >
              <Plus className="w-4 h-4"/> إضافة خبر جديد
            </button>
          </div>
          <div className="bg-white border rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b text-sm">
                <tr><th className="p-6 text-right">العنوان</th><th className="p-6 text-right">الفئة</th><th className="p-6">التاريخ</th><th className="p-6 w-40"></th></tr>
              </thead>
              <tbody className="divide-y text-sm">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="p-6 font-medium">{post.title}</td>
                    <td className="p-6"><span className="bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full text-xs">{post.category}</span></td>
                    <td className="p-6 text-center text-gray-500">{new Date(post.created_at).toLocaleDateString('ar')}</td>
                    <td className="p-6 text-center">
                      <button onClick={() => openEditPost(post)} className="mx-1 text-emerald-600 hover:underline"><Edit2 className="inline w-4 h-4" /></button>
                      <button onClick={() => handleDeletePost(post.id)} className="mx-1 text-red-600 hover:underline"><Trash2 className="inline w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMMENTS TAB */}
      {activeTab === 'comments' && (
        <div>
          <div className="text-xl font-semibold mb-6">جميع التعليقات ({comments.length})</div>
          <div className="bg-white border rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b text-sm">
                <tr><th className="p-6 text-right">التعليق</th><th className="p-6">الكاتب</th><th className="p-6">التاريخ</th><th></th></tr>
              </thead>
              <tbody className="divide-y text-sm">
                {comments.map(c => (
                  <tr key={c.id}>
                    <td className="p-6 max-w-md text-gray-700">{c.content}</td>
                    <td className="p-6 text-gray-500">{c.user_name}</td>
                    <td className="p-6 text-center text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString('ar')}</td>
                    <td className="p-6"><button onClick={() => handleDeleteComment(c.id)} className="text-red-600"><Trash2 className="w-4 h-4"/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <div>
          <div className="text-xl font-semibold mb-6">جميع الأسئلة ({questions.length})</div>
          <div className="space-y-4">
            {questions.map(q => (
              <div key={q.id} className="bg-white border p-8 rounded-3xl flex justify-between">
                <div>
                  <div className="font-medium text-xl">{q.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{q.user_name} • {new Date(q.created_at).toLocaleDateString('ar')}</div>
                  <div className="mt-4 text-gray-700">{q.content}</div>
                </div>
                <div className="flex flex-col gap-2 items-end w-48">
                  <button onClick={() => handleToggleAnswered(q)} className={`text-xs px-4 py-1 rounded-full ${q.answered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {q.answered ? 'تمت الإجابة' : 'لم تُجب'}
                  </button>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="text-xs text-red-600 flex items-center gap-1"><Trash2 className="w-3 h-3"/> حذف</button>

                  {/* Admin Reply Input */}
                  <div className="w-full mt-3">
                    <input 
                      placeholder="اكتب إجابة رسمية..." 
                      className="w-full text-xs border px-3 py-2 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          // Submit admin reply
                          fetch('/api/question-replies', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              question_id: q.id,
                              user_id: user?.id,
                              user_name: "المشرف",
                              content: e.currentTarget.value.trim()
                            })
                          }).then(() => {
                            e.currentTarget.value = '';
                            alert('تم إرسال الإجابة');
                          });
                        }
                      }}
                    />
                    <div className="text-[10px] text-gray-400 mt-1 text-center">اضغط Enter للإرسال</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {/* USERS TAB */}
      {/* {activeTab === 'users' && (

        <div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <div className="text-2xl font-bold">
                إدارة المستخدمين
              </div>

              <div className="text-gray-500 text-sm mt-1">
                عدد المستخدمين: {users.length}
              </div>
            </div>

            <div className="flex gap-3">

              <input
                type="text"
                placeholder="بحث عن مستخدم..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="border px-4 py-3 rounded-2xl w-full md:w-72"
              />

              <button
                onClick={exportUsersExcel}
                className="bg-emerald-700 hover:bg-emerald-800 transition text-white px-6 py-3 rounded-2xl whitespace-nowrap"
              >
                Export Excel
              </button>

            </div>
          </div>

          <div className="bg-white border rounded-3xl overflow-x-auto">

            <table className="w-full min-w-[1200px]">

              <thead className="bg-gray-50 border-b text-sm">

                <tr>
                  <th className="p-5 text-right">الاسم الكامل</th>
                  <th className="p-5 text-right">البريد الإلكتروني</th>
                  <th className="p-5 text-right">الجامعة</th>
                  <th className="p-5 text-right">التخصص</th>
                  <th className="p-5 text-right">تاريخ الميلاد</th>
                  <th className="p-5 text-center">الدور</th>
                  <th className="p-5 text-center">تاريخ التسجيل</th>
                  <th className="p-5 text-center">الإجراءات</th>
                </tr>

              </thead>

              <tbody className="divide-y text-sm">

                {filteredUsers.map((u) => (

                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 transition"
                  >

                    <td className="p-5">

                      <div className="font-semibold text-gray-900">
                        {u.first_name || '—'} {u.last_name || ''}
                      </div>

                    </td>

                    <td className="p-5 text-gray-600">
                      {u.email}
                    </td>

                    <td className="p-5">
                      {u.university || '—'}
                    </td>

                    <td className="p-5">
                      {u.major || '—'}
                    </td>

                          <td className="p-5">
                            {u.birthday
                              ? u.birthday.split('T')[0]
                              : '—'}
                          </td>

                    <td className="p-5 text-center">

                      {userRole === 'admin' ? (

                        <select
                          value={u.role}
                          onChange={e =>
                            handleChangeRole(
                              u.id,
                              e.target.value
                            )
                          }
                          className="border px-3 py-2 rounded-xl text-sm"
                        >
                          <option value="user">مستخدم</option>
                          <option value="moderator">مشرف</option>
                          <option value="admin">مدير</option>
                        </select>

                      ) : (

                        <span className="px-3 py-1 bg-gray-100 rounded-xl text-sm">
                          {u.role}
                        </span>

                      )}

                    </td>

                    <td className="p-5 text-center text-gray-500 text-xs">
                      {new Date(u.created_at).toLocaleDateString('ar')}
                    </td>

                    <td className="p-5 text-center">

                      {userRole === 'admin' &&
                        u.email !== 'admin@syrian-students.lb' && (

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-4 py-2 text-red-600 hover:text-red-700 text-sm"
                        >
                          حذف
                        </button>

                      )}

                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            ملاحظة: يمكنك ترقية أي مستخدم إلى مشرف أو مدير.
          </div>

        </div>
      )} */}
      {/* USERS TAB */}
{activeTab === 'users' && (

  <div>

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <div>
        <div className="text-3xl font-bold">
          إدارة المستخدمين
        </div>

        <div className="text-gray-500 text-sm mt-1">
          عدد المستخدمين: {users.length}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">

        <input
          type="text"
          placeholder="بحث عن مستخدم..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="border px-4 py-3 rounded-2xl w-full md:w-72 outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={exportUsersCSV}
          className="bg-emerald-700 hover:bg-emerald-800 transition text-white px-6 py-3 rounded-2xl whitespace-nowrap"
        >
          Export CSV
        </button>

      </div>

    </div>

    {/* Table */}
    <div className="bg-white border rounded-3xl overflow-x-auto shadow-sm">

      <table className="w-full min-w-[1400px]">

        <thead className="bg-gray-50 border-b text-sm">

          <tr>

            <th className="p-5 text-right">
              المستخدم
            </th>

            <th className="p-5 text-right">
              البريد الإلكتروني
            </th>
            <th className="p-5 text-right">
             رقم الهاتف
            </th>

            <th className="p-5 text-right">
              الجامعة
            </th>

            <th className="p-5 text-right">
              التخصص
            </th>

            <th className="p-5 text-right">
              تاريخ الميلاد
            </th>

            <th className="p-5 text-center">
              الدور
            </th>

            <th className="p-5 text-center">
              تاريخ التسجيل
            </th>

            <th className="p-5 text-center">
              الإجراءات
            </th>

          </tr>

        </thead>

        <tbody className="divide-y text-sm">

          {filteredUsers.map((u) => (

            <tr
              key={u.id}
              className="hover:bg-gray-50 transition"
            >

              {/* User */}
              <td className="p-5">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                    {u.first_name?.charAt(0) || 'U'}
                  </div>

                  <div>

                    <div className="font-semibold text-gray-900">
                      {u.first_name || '—'} {u.last_name || ''}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      ID: {u.id}
                    </div>

                  </div>

                </div>

              </td>

              {/* Email */}
              <td className="p-5 text-gray-600">
                {u.email}
              </td>
              {/* Phone */}
              <td className="p-5 text-gray-600">
                {u.phone}
              </td>

              {/* University */}
              <td className="p-5">
                {u.university || '—'}
              </td>

              {/* Major */}
              <td className="p-5">
                {u.major || '—'}
              </td>

              {/* Birthday */}
              <td className="p-5">

                {u.birthday ? (

                  <>
                    <div>
                      {u.birthday.split('T')[0]}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {new Date().getFullYear() - parseInt(u.birthday.split('-')[0])} سنة
                    </div>
                  </>

                ) : '—'}

              </td>

              {/* Role */}
              <td className="p-5 text-center">

                {userRole === 'admin' ? (

                  <select
                    value={u.role}
                    onChange={e =>
                      handleChangeRole(
                        u.id,
                        e.target.value
                      )
                    }
                    className={`px-3 py-2 rounded-xl text-sm border outline-none

                      ${u.role === 'admin'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : u.role === 'moderator'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                      }
                    `}
                  >

                    <option value="user">
                      مستخدم
                    </option>

                    <option value="moderator">
                      مشرف
                    </option>

                    <option value="admin">
                      مدير
                    </option>

                  </select>

                ) : (

                  <span className="px-3 py-1 bg-gray-100 rounded-xl text-sm">
                    {u.role}
                  </span>

                )}

              </td>

              {/* Created At */}
              <td className="p-5 text-center text-gray-500 text-xs">

                {new Date(u.created_at).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}

              </td>

              {/* Actions */}
              <td className="p-5 text-center">

                {userRole === 'admin' &&
                  u.email !== 'admin@syrian-students.lb' && (

                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm transition"
                  >
                    حذف
                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    {/* Footer Note */}
    <div className="mt-4 text-xs text-gray-500">
      ملاحظة: يمكنك ترقية أي مستخدم إلى مشرف أو مدير.
    </div>

  </div>
)}

      
      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (

        <div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              إرسال إشعار بريدي جماعي
            </h2>

            <p className="text-gray-600">
              سيتم إرسال هذا الإشعار إلى جميع المستخدمين المسجلين في المنصة.
            </p>
          </div>

          <div className="bg-white border rounded-3xl p-8 max-w-3xl">

            <input
              type="text"
              placeholder="عنوان الإشعار"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full border p-4 rounded-2xl mb-5"
            />

            <textarea
              rows={8}
              placeholder="اكتب محتوى الرسالة هنا..."
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              className="w-full border p-4 rounded-3xl mb-6"
            />

            <button
              onClick={handleSendAnnouncement}
              disabled={sendingAnnouncement}
              className="bg-emerald-700 hover:bg-emerald-800 transition text-white px-8 py-4 rounded-2xl font-semibold"
            >
              {sendingAnnouncement
                ? 'جاري الإرسال...'
                : 'إرسال الإشعار لجميع المستخدمين'}
            </button>

          </div>

        </div>
      )}
      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-10">
            <h3 className="font-bold text-2xl mb-7">{editingPost ? 'تعديل الخبر' : 'خبر جديد'}</h3>
            <input value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} placeholder="عنوان الخبر" className="w-full border p-4 rounded-2xl mb-4 text-lg" />
            <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })} className="w-full border p-4 rounded-2xl mb-4">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={7} placeholder="المحتوى الكامل..." className="w-full border p-4 rounded-3xl mb-7" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowPostModal(false); setEditingPost(null); }} className="px-8 py-3.5 rounded-2xl border">إلغاء</button>
              <button onClick={handleSavePost} className="px-8 py-3.5 bg-emerald-700 text-white rounded-2xl">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Authentication Page (Email/Password)
function AuthPage() {

  const [isLogin, setIsLogin] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {

    e.preventDefault();
    setError('');

    try {

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          action: isLogin ? 'login' : 'signup',

          first_name: firstName,
          last_name: lastName,
          birthday,
          university,
          major,
          email,
          password,
          phone
        })
      });

      const data = await response.json();

      if (!response.ok) {

        throw new Error(data.error || 'حدث خطأ');
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify(data.user)
      );

      window.location.href = '/';

    } catch (err: any) {

      setError(
        err.message || 'حدث خطأ. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  return (

    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white w-full max-w-md p-10 rounded-3xl border">

        <div className="flex justify-center mb-8">
          <div className="px-4 py-1 bg-emerald-50 text-emerald-700 text-xs tracking-[2px] rounded">
            ملتقى الطلاب السوريين
          </div>
        </div>

        <h2 className="text-center font-bold text-3xl tracking-tight mb-8">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h2>

        <form
          onSubmit={handleAuth}
          className="space-y-4"
        >

          {!isLogin && (
            <>

              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="الاسم الأول"
                className="w-full px-5 py-4 border rounded-2xl"
                required
              />

              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="اسم العائلة"
                className="w-full px-5 py-4 border rounded-2xl"
                required
              />

              <input
                type="date"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                className="w-full px-5 py-4 border rounded-2xl"
                required
              />

              <input
                type="text"
                value={university}
                onChange={e => setUniversity(e.target.value)}
                placeholder="اسم الجامعة"
                className="w-full px-5 py-4 border rounded-2xl"
                required
              />

              <input
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                placeholder="الاختصاص"
                className="w-full px-5 py-4 border rounded-2xl"
                required
              />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="رقم الهاتف"
              className="w-full px-5 py-4 border rounded-2xl"
              required
            />
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="w-full px-5 py-4 border rounded-2xl"
            required
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full px-5 py-4 border rounded-2xl"
            required
          />

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 w-full py-4 bg-emerald-700 text-white font-semibold rounded-2xl"
          >
            {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>

        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm w-full mt-7 text-center text-gray-600 hover:text-emerald-700"
        >
          {isLogin
            ? 'ليس لديك حساب؟ أنشئ حساباً جديداً'
            : 'لديك حساب بالفعل؟ سجّل الدخول'}
        </button>
        <Link
          to="/forgot-password"
          className="text-sm text-emerald-700 hover:underline"
        >
          نسيت كلمة المرور؟
        </Link>
        {/* <div className="text-center text-xs text-gray-400 mt-9">
          تجربة تجريبية:
          admin@syrian-students.lb / password123
        </div> */}

      </div>

    </div>
  );
}


// User Profile Page
function ProfilePage() {

  const currentUser = JSON.parse(
    localStorage.getItem('currentUser') || '{}'
  );

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    birthday: '',
    university: '',
    major: '',
    phone: ''
  });

  useEffect(() => {

    fetch(`/api/profile/${currentUser.id}`)
      .then(res => res.json())
      .then(data => {

        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          birthday: data.birthday
          ? data.birthday.split('T')[0]
          : '',
          university: data.university || '',
          major: data.major || '',
          phone: data.phone || ''
        });
      });

  }, []);

  const handleSave = async () => {

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: currentUser.id,
        ...form
      })
    });

    const updatedUser = await res.json();

    localStorage.setItem(
      'currentUser',
      JSON.stringify(updatedUser)
    );

    alert('تم حفظ التعديلات');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">

      <h1 className="text-4xl font-bold mb-10">
        الملف الشخصي
      </h1>

      <div className="space-y-4 bg-white border p-8 rounded-3xl">

        <input
          value={form.first_name}
          onChange={e =>
            setForm({
              ...form,
              first_name: e.target.value
            })
          }
          placeholder="الاسم الأول"
          className="w-full border p-4 rounded-2xl"
        />

        <input
          value={form.last_name}
          onChange={e =>
            setForm({
              ...form,
              last_name: e.target.value
            })
          }
          placeholder="اسم العائلة"
          className="w-full border p-4 rounded-2xl"
        />

        <input
          type="date"
          value={form.birthday}
          onChange={e =>
            setForm({
              ...form,
              birthday: e.target.value
            })
          }
          className="w-full border p-4 rounded-2xl"
        />

        <input
          value={form.university}
          onChange={e =>
            setForm({
              ...form,
              university: e.target.value
            })
          }
          placeholder="الجامعة"
          className="w-full border p-4 rounded-2xl"
        />

        <input
          value={form.major}
          onChange={e =>
            setForm({
              ...form,
              major: e.target.value
            })
          }
          placeholder="التخصص"
          className="w-full border p-4 rounded-2xl"
        />
        <input
        value={form.phone || ''}
        onChange={e =>
          setForm({
            ...form,
            phone: e.target.value
          })
        }
        placeholder="رقم الهاتف"
        className="w-full border p-4 rounded-2xl"
      />

        <button
          onClick={handleSave}
          className="w-full bg-emerald-700 text-white py-4 rounded-2xl"
        >
          حفظ التعديلات
        </button>

      </div>
    </div>
  );
}

//forgot password page
// function ForgotPasswordPage() {

//   const [email, setEmail] = useState('');
//   const [done, setDone] = useState(false);

//   const handleSubmit = async () => {

//     await fetch('/api/forgot-password', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ email })
//     });

//     setDone(true);
//   };

//   return (
//     <div className="max-w-md mx-auto py-20 px-6">

//       <div className="bg-white border p-8 rounded-3xl">

//         <h1 className="text-3xl font-bold mb-6">
//           نسيت كلمة المرور
//         </h1>

//         {done ? (

//           <div className="text-green-700">
//             تم إرسال رابط إعادة التعيين
//           </div>

//         ) : (

//           <>
//             <input
//               type="email"
//               placeholder="البريد الإلكتروني"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               className="w-full border p-4 rounded-2xl mb-4"
//             />

//             <button
//               onClick={handleSubmit}
//               className="w-full bg-emerald-700 text-white py-4 rounded-2xl"
//             >
//               إرسال الرابط
//             </button>
//           </>
//         )}

//       </div>
//     </div>
//   );
// }
// Forgot Password Page
function ForgotPasswordPage() {

  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {

    setError('');

    try {

      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      // إذا في خطأ
      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ');
      }

      // نجاح
      setDone(true);

    } catch (err: any) {

      setError(err.message || 'حدث خطأ');

    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6">

      <div className="bg-white border p-8 rounded-3xl">

        <h1 className="text-3xl font-bold mb-6">
          نسيت كلمة المرور
        </h1>

        {done ? (

          <div className="text-green-700">
            تم إرسال رابط إعادة التعيين
          </div>

        ) : (

          <>

            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border p-4 rounded-2xl mb-4"
            />

            {error && (
              <div className="text-red-600 text-sm mb-4 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-700 text-white py-4 rounded-2xl"
            >
              إرسال الرابط
            </button>

          </>
        )}

      </div>
    </div>
  );
}

//Reset Password Page
function ResetPasswordPage() {

  const { token } = useParams();

  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  const handleReset = async () => {

    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        password
      })
    });

    if (res.ok) {
      setDone(true);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6">

      <div className="bg-white border p-8 rounded-3xl">

        <h1 className="text-3xl font-bold mb-6">
          تعيين كلمة مرور جديدة
        </h1>

        {done ? (

          <div className="text-green-700">
            تم تغيير كلمة المرور
          </div>

        ) : (

          <>
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border p-4 rounded-2xl mb-4"
            />

            <button
              onClick={handleReset}
              className="w-full bg-emerald-700 text-white py-4 rounded-2xl"
            >
              حفظ كلمة المرور
            </button>
          </>
        )}

      </div>
    </div>
  );
}

// function Footer() {
//   return (
//     <footer className="border-t mt-16 py-12 bg-white text-sm text-gray-600">
//       <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-y-3 justify-between">
//         <div>© ملتقى الطلاب السوريين في لبنان — منصة رسمية بالتعاون مع سفارة الجمهورية العربية السورية في بيروت</div>
//         <div>جميع الحقوق محفوظة 2026</div>
//       </div>
//     </footer>
//   );
// }

// function Footer() {
//   return (
//     <footer className="mt-20 bg-emerald-950 text-white">
      
//       {/* Top Section */}
//       <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-12">

//         {/* About */}
//         <div>
//           <h3 className="text-2xl font-bold mb-4 tracking-tight">
//             ملتقى الطلاب السوريين
//           </h3>

//           <p className="text-emerald-100 leading-relaxed text-sm">
//             منصة طلابية تهدف إلى دعم الطلاب السوريين في لبنان عبر توفير
//             المعلومات الرسمية، الأخبار الجامعية، الأدلة الإرشادية،
//             والفرص التعليمية الحديثة.
//           </p>
//         </div>

//         {/* Quick Links */}
//         <div>
//           <h4 className="font-semibold text-lg mb-5">
//             روابط سريعة
//           </h4>

//           <div className="space-y-3 text-sm">
//             <Link
//               to="/news"
//               className="block text-emerald-100 hover:text-white transition"
//             >
//               الأخبار والتحديثات
//             </Link>

//             <Link
//               to="/guides"
//               className="block text-emerald-100 hover:text-white transition"
//             >
//               الأدلة الإرشادية
//             </Link>

//             <Link
//               to="/community"
//               className="block text-emerald-100 hover:text-white transition"
//             >
//               المجتمع الطلابي
//             </Link>

//             <Link
//               to="/faq"
//               className="block text-emerald-100 hover:text-white transition"
//             >
//               الأسئلة الشائعة
//             </Link>
//           </div>
//         </div>

//         {/* Contact */}
//         <div>
//           <h4 className="font-semibold text-lg mb-5">
//             تواصل معنا
//           </h4>

//           <div className="space-y-4">

//             {/* Email */}
//             <a
//               href="mailto:syrianstudentsforum@gmail.com"
//               className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition px-4 py-3 rounded-2xl"
//             >
//               <Mail className="w-5 h-5 text-emerald-300" />

//               <div>
//                 <div className="text-xs text-emerald-200">
//                   البريد الإلكتروني
//                 </div>

//                 <div className="text-sm">
//                   syrianstudentsforum@gmail.com
//                 </div>
//               </div>
//             </a>

//             {/* Instagram */}
//             <a
//               href="https://www.instagram.com/syrian_students_forum"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-3 bg-white/5 hover:bg-pink-500/20 transition px-4 py-3 rounded-2xl"
//             >
//               <Instagram className="w-5 h-5 text-pink-300" />

//               <div>
//                 <div className="text-xs text-emerald-200">
//                   Instagram
//                 </div>

//                 <div className="text-sm">
//                   @syrian_students_forum
//                 </div>
//               </div>
//             </a>

//             {/* Facebook */}
//             <a
//               href="https://www.facebook.com/share/1JMcAqhnNX/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-3 bg-white/5 hover:bg-blue-500/20 transition px-4 py-3 rounded-2xl"
//             >
//               <Facebook className="w-5 h-5 text-blue-300" />

//               <div>
//                 <div className="text-xs text-emerald-200">
//                   Facebook
//                 </div>

//                 <div className="text-sm">
//                   Syrian Students Forum
//                 </div>
//               </div>
//             </a>

//           </div>
//         </div>
//       </div>

//       {/* Bottom */}
//       <div className="border-t border-white/10">
//         <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-emerald-200">

//           <div>
//             © 2026 ملتقى الطلاب السوريين في لبنان
//           </div>

//           <div>
//             Developed with dedication for Syrian students in Lebanon
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

function Footer() {
  return (
    <footer className="mt-20 bg-emerald-950 text-white">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-12">

        {/* About */}
        <div>
          <h3 className="text-2xl font-bold mb-4 tracking-tight">
            ملتقى الطلاب السوريين
          </h3>

          <p className="text-emerald-100 leading-relaxed text-sm">
            منصة طلابية تهدف إلى دعم الطلاب السوريين في لبنان عبر توفير
            المعلومات الرسمية، الأخبار الجامعية، الأدلة الإرشادية،
            والفرص التعليمية الحديثة.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-5">
            روابط سريعة
          </h4>

          <div className="space-y-3 text-sm">
            <Link
              to="/news"
              className="block text-emerald-100 hover:text-white transition"
            >
              الأخبار والتحديثات
            </Link>

            <Link
              to="/guides"
              className="block text-emerald-100 hover:text-white transition"
            >
              الأدلة الإرشادية
            </Link>

            <Link
              to="/community"
              className="block text-emerald-100 hover:text-white transition"
            >
              المجتمع الطلابي
            </Link>

            <Link
              to="/faq"
              className="block text-emerald-100 hover:text-white transition"
            >
              الأسئلة الشائعة
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg mb-5">
            تواصل معنا
          </h4>

          <div className="space-y-4">

            {/* WhatsApp Community */}
            <a
              href="https://chat.whatsapp.com/C3iDIO4F9RYDQjqRgFIn42" // ضع رابط مجتمع أو مجموعة الواتساب هنا
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/5 hover:bg-green-500/20 transition px-4 py-3 rounded-2xl border border-green-500/10"
            >
              <MessageCircle className="w-5 h-5 text-green-400" />

              <div>
                <div className="text-xs text-green-300 font-medium">
                  مجتمع WhatsApp
                </div>

                <div className="text-sm">
                  انضم إلى المجموعة الطلابية
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:syrianstudentsforum@gmail.com"
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition px-4 py-3 rounded-2xl"
            >
              <Mail className="w-5 h-5 text-emerald-300" />

              <div>
                <div className="text-xs text-emerald-200">
                  البريد الإلكتروني
                </div>

                <div className="text-sm">
                  syrianstudentsforum@gmail.com
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/syrian_students_forum"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/5 hover:bg-pink-500/20 transition px-4 py-3 rounded-2xl"
            >
              <Instagram className="w-5 h-5 text-pink-300" />

              <div>
                <div className="text-xs text-emerald-200">
                  Instagram
                </div>

                <div className="text-sm">
                  @syrian_students_forum
                </div>
              </div>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1JMcAqhnNX/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/5 hover:bg-blue-500/20 transition px-4 py-3 rounded-2xl"
            >
              <Facebook className="w-5 h-5 text-blue-300" />

              <div>
                <div className="text-xs text-emerald-200">
                  Facebook
                </div>

                <div className="text-sm">
                  Syrian Students Forum
                </div>
              </div>
            </a>

          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-emerald-200">

          <div>
            © 2026 ملتقى الطلاب السوريين في لبنان
          </div>

          <div>
            Developed with dedication for Syrian students in Lebanon
          </div>
        </div>
      </div>
    </footer>
  );
}



export default App;
