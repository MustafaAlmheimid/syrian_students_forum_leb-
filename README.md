
# 1. set this in command 
set DATABASE_URL=postgresql://neondb_owner:npg_m8WsXAHK3Fzn@ep-plain-bar-aphlvr38.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
الطريقة الصحيحة:
# 2. اعمل Build للواجهة الأمامية
npm run build

# 3. شغّل السيرفر
npm start
# React + TypeScript + Vite

# Git Command :
git add .
git commit -m "Add logo to navbar and update UI"
git pull origin main --rebase
git push origin main





This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```



# forgot password steps
```js
1) Frontend
إنشاء صفحة ForgotPasswordPage
إنشاء صفحة ResetPasswordPage
إضافة Routes:
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password/:token" element={<ResetPasswordPage />} />
إضافة:
import { useParams } from 'react-router-dom';
إضافة زر:
<Link to="/forgot-password">
  نسيت كلمة المرور؟
</Link>
2) Database

إضافة أعمدة داخل جدول users:

ALTER TABLE users
ADD COLUMN reset_token TEXT,
ADD COLUMN reset_token_expiry TIMESTAMP;
3) Backend Packages

تثبيت:

npm install nodemailer crypto
4) Environment Variables (.env)
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
5) Gmail App Password
تفعيل 2FA على Gmail
إنشاء App Password
وضعه داخل EMAIL_PASS
6) Backend Routes
Forgot Password
POST /api/forgot-password

المهام:

البحث عن المستخدم
إنشاء token
حفظ token + expiry
إرسال رابط للإيميل
Reset Password
POST /api/reset-password

المهام:

التحقق من token
تحديث password
حذف token بعد الاستخدام
7) Email Link

الرابط المرسل:

https://your-domain.com/reset-password/TOKEN
8) Important

بدون إعداد nodemailer + Gmail App Password
to get app password : 
https://myaccount.google.com/apppasswords?utm_source=chatgpt.com&pli=1&rapt=AEjHL4M3Ir5LTjWH5atDCOaMCmnhlIvX1FRP04ys9PFT94cRXocAvUT73Q-32ghKzP2PNiz7huuIf2_Lp1LbYyTChZs1bxxm289JmpkPT0HYmq9VVn42OX0
لن يتم إرسال أي إيميل حتى لو ظهرت رسالة:

تم إرسال رابط إعادة التعيين
```

in .env : BASE_URL=http://localhost:3000 
eza sar 3ende domain name , b7ot l domain name mahal hal link 'localhost' b 'render envirenoment variable'