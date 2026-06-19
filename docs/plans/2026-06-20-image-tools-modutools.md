# Image Tools Modutools Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate the standalone photo cleanup tools into `modutools-app` as a native `/image` category.

**Architecture:** Keep the existing Modutools category architecture and add image tools as another category with lazy-loaded tool pages. Reuse the standalone tool logic where valuable, but adapt route structure, metadata, SEO, shared components, and styling to the existing app instead of embedding the standalone app shell.

**Tech Stack:** React 19, React Router 7, TypeScript, Vite, Tailwind CSS, lucide-react, browser Canvas APIs, JSZip.

---

### Task 1: Add Image Category Metadata

**Files:**
- Modify: `modutools-app/src/data/categories.tsx`
- Modify: `modutools-app/src/data/toolGuides.ts`

**Step 1: Add category icons**

Import suitable lucide icons:

```tsx
import {
  Images,
  Minimize2,
  Maximize,
  BadgeCheck,
  FileType,
  Crop,
} from 'lucide-react';
```

If any imported name conflicts with existing imports, alias it locally.

**Step 2: Add the `/image` category**

Add a new `CategoryMeta` entry:

```tsx
{
  id: 'image',
  path: '/image',
  name: '이미지 정리 도구',
  shortName: '이미지 정리',
  desc: '사진 용량, 픽셀 크기, 증명사진 규격, JPG 변환, 자르기와 여백까지 브라우저에서 바로 정리',
  tagline: '이미지는 브라우저에서만 처리',
  accent: 'text-indigo-700',
  accentBg: 'bg-indigo-50 border-indigo-100',
  icon: <Images className="w-5 h-5" />,
  tools: [
    {
      id: 'compress',
      path: '/image/compress',
      name: '이미지 압축',
      desc: '업로드 용량 제한에 맞춰 사진 파일 크기 줄이기',
      icon: <Minimize2 className="w-4 h-4" />,
    },
    {
      id: 'resize',
      path: '/image/resize',
      name: '이미지 크기 변경',
      desc: '가로·세로 픽셀 크기를 원하는 규격으로 조정',
      icon: <Maximize className="w-4 h-4" />,
    },
    {
      id: 'id-photo',
      path: '/image/id-photo',
      name: '증명사진 규격 맞추기',
      desc: '이력서·자격증·접수용 증명사진 규격 정리',
      icon: <BadgeCheck className="w-4 h-4" />,
    },
    {
      id: 'jpg-converter',
      path: '/image/jpg-converter',
      name: 'JPG 변환',
      desc: 'PNG·WEBP 이미지를 호환성 높은 JPG로 변환',
      icon: <FileType className="w-4 h-4" />,
    },
    {
      id: 'crop-padding',
      path: '/image/crop-padding',
      name: '자르기 / 여백 넣기',
      desc: '정사각형·비율 크롭 또는 흰 여백 추가',
      icon: <Crop className="w-4 h-4" />,
    },
  ],
}
```

**Step 3: Add guide entries**

Add `toolGuides` entries for `compress`, `resize`, `id-photo`, `jpg-converter`, and `crop-padding`. Use practical Korean copy with `when`, `example`, `beforeUse`, and `relatedToolIds`.

**Step 4: Verify typechecking**

Run:

```bash
npm run lint
```

Expected: no TypeScript errors from category or guide metadata.

**Step 5: Commit**

```bash
git add modutools-app/src/data/categories.tsx modutools-app/src/data/toolGuides.ts
git commit -m "feat: add image tools category metadata"
```

### Task 2: Add Image Routes

**Files:**
- Create: `modutools-app/src/routes/image/ImageHome.tsx`
- Create: `modutools-app/src/routes/image/ImageToolPage.tsx`
- Modify: `modutools-app/src/App.tsx`

**Step 1: Create category home**

```tsx
import React from 'react';
import CategoryHome from '../_CategoryHome';
import { categoryById } from '../../data/categories';

export default function ImageHome() {
  return <CategoryHome category={categoryById['image']} />;
}
```

**Step 2: Create tool page shell**

Start with placeholder lazy imports if components have not been moved yet:

```tsx
import React, { lazy } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categoryById } from '../../data/categories';
import ToolSeoHead from '../../components/seo/ToolSeoHead';

const ImageCompressTool = lazy(() => import('../../tools/image/compress/ImageCompressTool'));
const ImageResizeTool = lazy(() => import('../../tools/image/resize/ImageResizeTool'));
const IdPhotoTool = lazy(() => import('../../tools/image/id-photo/IdPhotoTool'));
const JpgConverterTool = lazy(() => import('../../tools/image/jpg-converter/JpgConverterTool'));
const CropPaddingTool = lazy(() => import('../../tools/image/crop-padding/CropPaddingTool'));

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  compress: ImageCompressTool,
  resize: ImageResizeTool,
  'id-photo': IdPhotoTool,
  'jpg-converter': JpgConverterTool,
  'crop-padding': CropPaddingTool,
};

export default function ImageToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const category = categoryById['image'];
  const ToolComponent = toolId ? toolComponents[toolId] : undefined;

  if (!ToolComponent) {
    return <Navigate to={category.path} replace />;
  }

  return (
    <div className="space-y-4">
      <ToolSeoHead categoryId="image" toolId={toolId!} />
      <Link
        to={category.path}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {category.shortName}로 돌아가기
      </Link>
      <ToolComponent />
    </div>
  );
}
```

**Step 3: Wire App routes**

Add imports and route:

```tsx
import ImageHome from './routes/image/ImageHome';
import ImageToolPage from './routes/image/ImageToolPage';
```

```tsx
<Route path="image">
  <Route index element={<ImageHome />} />
  <Route path=":toolId" element={<ImageToolPage />} />
</Route>
```

**Step 4: Keep compression compatibility**

After the new image compression component exists, either keep `/submit/image-compress` as a wrapper around it or redirect:

```tsx
<Route path="submit/image-compress" element={<Navigate to="/image/compress" replace />} />
```

Only add this if it does not conflict with the nested submit route behavior.

**Step 5: Commit**

```bash
git add modutools-app/src/App.tsx modutools-app/src/routes/image
git commit -m "feat: add image tool routes"
```

### Task 3: Move Shared Image Types and Utilities

**Files:**
- Create or modify: `modutools-app/src/lib/image/canvas.ts`
- Create or modify: `modutools-app/src/lib/image/compression.ts`
- Create or modify: `modutools-app/src/lib/image/fileSize.ts`
- Create or modify: `modutools-app/src/lib/image/image.ts`
- Modify as needed: `modutools-app/src/types/image.ts`
- Source reference: `사진 정리 도구/src/utils/*`
- Source reference: `사진 정리 도구/src/types/*`

**Step 1: Compare existing utilities**

Check whether `modutools-app/src/types/image.ts` and existing submit or thumbnail tools already define equivalent image types.

**Step 2: Move only shared utilities**

Copy reusable browser-only helpers from the standalone app when they are used by at least two image tools:

- canvas loading and drawing helpers
- file size formatting
- download helpers only if existing `src/lib/download.ts` is not enough
- ZIP helpers only if existing `src/lib/zip.ts` is not enough
- compression routines

**Step 3: Remove standalone-only assumptions**

Do not copy Gemini-related code, AI Studio metadata, or app shell logic.

**Step 4: Verify imports**

Run:

```bash
npm run lint
```

Expected: TypeScript resolves all shared utility imports.

**Step 5: Commit**

```bash
git add modutools-app/src/lib/image modutools-app/src/types/image.ts
git commit -m "feat: add shared image processing utilities"
```

### Task 4: Integrate Image Tool Components

**Files:**
- Create: `modutools-app/src/tools/image/compress/ImageCompressTool.tsx`
- Create: `modutools-app/src/tools/image/resize/ImageResizeTool.tsx`
- Create: `modutools-app/src/tools/image/id-photo/IdPhotoTool.tsx`
- Create: `modutools-app/src/tools/image/id-photo/idPhotoPresets.ts`
- Create: `modutools-app/src/tools/image/jpg-converter/JpgConverterTool.tsx`
- Create: `modutools-app/src/tools/image/crop-padding/CropPaddingTool.tsx`
- Source reference: `사진 정리 도구/src/tools/*`

**Step 1: Port one tool at a time**

Start with `compress`, because Modutools already has a submit image compressor and this is the compatibility-sensitive path.

**Step 2: Adapt component names**

Use route-friendly names:

- `ImageCompressTool`
- `ImageResizeTool`
- `IdPhotoTool`
- `JpgConverterTool`
- `CropPaddingTool`

**Step 3: Replace standalone layout pieces**

Remove imports from standalone `layout`, `routes`, or AI Studio shell. Use Modutools common primitives where available:

- `PrivacyNotice`
- `PrivacyBadges`
- `DownloadButton`
- existing button/card classes from nearby tools

**Step 4: Keep browser-local processing**

Ensure image files are handled with `FileReader`, `createImageBitmap`, `HTMLCanvasElement`, and object URLs in the browser. Do not add server calls.

**Step 5: Run lint after each tool**

```bash
npm run lint
```

Expected: no TypeScript errors after each ported tool.

**Step 6: Commit each tool**

Example:

```bash
git add modutools-app/src/tools/image/compress
git commit -m "feat: add image compression tool"
```

Repeat for each tool.

### Task 5: Update Navigation, Sitemap, and Prerendering

**Files:**
- Modify if needed: `modutools-app/scripts/generate-sitemap.mjs`
- Modify if needed: `modutools-app/scripts/prerender-static.mjs`
- Modify if needed: `modutools-app/src/layout/Sidebar.tsx`
- Modify if needed: `modutools-app/src/layout/MobileToolTabs.tsx`

**Step 1: Check existing category-driven rendering**

If navigation and sitemap already read from `categories`, no changes should be needed.

**Step 2: Add image paths only where static lists exist**

If any script has hard-coded categories or route paths, add `/image` and all five tool routes.

**Step 3: Build sitemap**

Run:

```bash
npm run generate:sitemap
```

Expected: sitemap includes `/image`, `/image/compress`, `/image/resize`, `/image/id-photo`, `/image/jpg-converter`, and `/image/crop-padding`.

**Step 4: Commit**

```bash
git add modutools-app/scripts modutools-app/public/sitemap.xml modutools-app/src/layout
git commit -m "feat: include image tools in navigation and sitemap"
```

### Task 6: End-to-End Verification

**Files:**
- No expected source changes unless verification reveals defects.

**Step 1: Run full build**

```bash
npm run build
```

Expected: Vite build succeeds and prerender output includes image routes.

**Step 2: Start dev server**

```bash
npm run dev -- --host 127.0.0.1
```

Expected: dev server starts on `http://127.0.0.1:3000` or the configured fallback port.

**Step 3: Browser smoke test**

Open:

- `http://127.0.0.1:3000/image`
- `http://127.0.0.1:3000/image/compress`
- `http://127.0.0.1:3000/image/resize`
- `http://127.0.0.1:3000/image/id-photo`
- `http://127.0.0.1:3000/image/jpg-converter`
- `http://127.0.0.1:3000/image/crop-padding`

Expected:

- Category page renders.
- Each tool page renders without console errors.
- Sidebar and mobile navigation do not overlap.
- Tool UI fits mobile and desktop widths.

**Step 4: Functional smoke test**

Use a small sample PNG or JPG in each tool:

- compress downloads a smaller or target-sized file
- resize downloads expected pixel dimensions
- id-photo exports selected preset dimensions
- jpg-converter exports `.jpg`
- crop-padding exports selected ratio or padded output

**Step 5: Commit fixes if needed**

```bash
git add modutools-app
git commit -m "fix: polish image tools integration"
```

### Task 7: Cleanup Standalone App Decision

**Files:**
- Modify or delete only after user approval: `사진 정리 도구/`
- Modify: `docs/plans/2026-06-20-image-tools-design.md` if the decision changes

**Step 1: Confirm whether to keep source folder**

Ask whether `사진 정리 도구` should remain as a source reference or be removed after the integration is complete.

**Step 2: If kept**

Add a short note in the final report that it is retained as migration source material.

**Step 3: If removed**

Delete only after explicit approval.

**Step 4: Commit cleanup**

```bash
git add -A
git commit -m "chore: clean up migrated standalone image app"
```
