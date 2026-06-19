# Image Tools Redesign for Modutools

## Goal

Rebuild the standalone `사진 정리 도구` app as a first-class `modutools-app` category that fits the existing service model at `modutools.kr`: practical browser-only tools for file cleanup, submission, and small business workflows.

## Product Direction

The photo tools should not feel like a separate image editor or AI Studio export. They should feel like another Modutools utility category: calm, direct, local-first, and optimized for common upload problems.

The new category should be:

- Category path: `/image`
- Category name: `이미지 정리 도구`
- Short name: `이미지 정리`
- Core message: `사진 용량, 픽셀 크기, 증명사진 규격, JPG 변환, 자르기/여백까지 브라우저에서 바로 정리`
- Trust message: images are processed in the browser, without account creation or server upload.

## Tools

The standalone app has five useful tools. They should move into `modutools-app` under one category:

| Source tool | Modutools name | Route |
| --- | --- | --- |
| `image-compress` | `이미지 압축` | `/image/compress` |
| `image-resize` | `이미지 크기 변경` | `/image/resize` |
| `id-photo-resize` | `증명사진 규격 맞추기` | `/image/id-photo` |
| `jpg-converter` | `JPG 변환` | `/image/jpg-converter` |
| `image-crop-padding` | `자르기 / 여백 넣기` | `/image/crop-padding` |

The existing `/submit/image-compress` route should remain compatible during the transition. It can either reuse the image compression component or redirect to `/image/compress`.

## Architecture

The implementation should follow existing `modutools-app` patterns:

- Add image category metadata to `src/data/categories.tsx`.
- Add guide metadata for the new tools in `src/data/toolGuides.ts`.
- Add `/image` route wiring in `src/App.tsx`.
- Create `src/routes/image/ImageHome.tsx` using the shared `CategoryHome`.
- Create `src/routes/image/ImageToolPage.tsx` modeled after the existing category tool pages.
- Move or adapt tool components into `src/tools/image/<tool-id>/`.
- Move reusable image helpers into `src/lib/image/` only when shared by two or more tools.
- Keep UI consistent with existing common components, privacy badges, SEO head handling, and lazy-loaded tool pages.

## UX Principles

Each tool should follow the same workflow:

1. Upload image files.
2. Choose the relevant option or preset.
3. Preview the result.
4. Download a single file or ZIP for batch output.

Copy should be short and practical. Avoid inflated marketing language, AI Studio wording, and claims that sound too technical for users. The strongest use cases are submission portals, resumes, ID photos, public forms, shopping platforms, blogs, and file upload size limits.

## SEO Direction

The SEO focus should be utility search intent:

- `이미지 압축`
- `사진 용량 줄이기`
- `사진 사이즈 변경`
- `증명사진 크기 맞추기`
- `JPG 변환`
- `사진 자르기`
- `사진 여백 넣기`

Each tool guide should explain when to use the tool, a concrete example, and what to check before submission.

## Non-Goals

- Do not preserve the standalone app shell.
- Do not keep Gemini or AI Studio dependencies unless a tool truly needs them.
- Do not introduce accounts, uploads, cloud processing, or server-side image storage.
- Do not redesign the whole Modutools navigation system.
- Do not remove existing submit or thumbnail tools unless a route replacement is intentionally handled.

## Success Criteria

- `/image` appears as a normal Modutools category.
- All five image tools are reachable from the sidebar, mobile tabs, category page, and direct routes.
- Existing `/submit/image-compress` users are not broken.
- The app builds with `npm run build`.
- Core image workflows work locally in the browser.
- New category and tools are included in generated sitemap/prerender output.
