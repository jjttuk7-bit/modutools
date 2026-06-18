# AdSense 준비 가이드 — 모두의 도구

> AdSense 승인 신청 전·후에 무엇을 해야 하는지 모아 둔 운영 매뉴얼.
> 최종 갱신: 2026-06-11.

---

## 1. 준비 완료 체크리스트

코드 측면의 AdSense 대비는 거의 끝났습니다. 남은 건 Cloudflare Pages 배포 설정과 AdSense 콘솔 확인입니다.

| # | 항목 | 상태 | 근거 / 위치 |
|---|---|---|---|
| 1 | SEO 본문 5개 카테고리 (합계 68,983자) | ✅ | `src/components/seo/*.tsx` |
| 2 | `/about` · `/terms` 신규 페이지 | ✅ | `src/routes/AboutPage.tsx`, `TermsPage.tsx` |
| 3 | 사장님 계산기 면책 문구 (5개 도구 variant) | ✅ | `src/components/business/DisclaimerBox.tsx` |
| 4 | `robots.txt` · `sitemap.xml`(자동 생성, 35개 URL) · `ads.txt` 슬롯 | ✅ | `public/*.txt`, `scripts/generate-sitemap.mjs` |
| 5 | 라우트별 메타 · OG · Twitter · JSON-LD 동적 주입 | ✅ | `src/components/seo/SeoHead.tsx`, `ToolSeoHead.tsx` |
| 6 | OG 이미지 (`og-image.png`, 1200×630) | ✅ | `public/og-image.png`, `scripts/og-image.svg` |
| 7 | AdSlot 환경변수 게이트 (승인 전 빈 광고 영역 비표시) | ✅ | `src/components/common/AdSlot.tsx` |
| 8 | **Cloudflare Pages 자체 도메인 연결** | ⬜ | [§2](#2-cloudflare-pages-도메인-연결) |
| 9 | **AdSense 신청 및 승인** | ⬜ | [§3](#3-adsense-신청-직전-점검) |
| 10 | **실제 AdSense 코드 통합** (승인 후) | ⬜ | [§4](#4-승인-후-활성화-절차) |

---

## 2. Cloudflare Pages 도메인 연결

현재 배포 및 AdSense 신청 기준 도메인: `modutools.kr`.

> 중요: AdSense 신청 URL, canonical, sitemap, robots.txt는 모두 같은 호스트를 가리켜야 합니다.
> 현재 신청 URL은 `https://modutools.kr`이므로 코드와 사이트맵도 apex 도메인 기준으로 통일합니다.

### 2-1. 도메인 구입처

| 업체 | 비고 |
|---|---|
| **가비아 (gabia.com)** | 국내 1위, .kr 도메인 강점, KISA 인증 안내 한국어 |
| **호스팅케이알 (hosting.kr)** | .kr 저렴 (연 2~3만 원대), DNS 관리 UI 단순 |
| **Cloudflare** | 글로벌 표준, 다만 .kr 직판 안 함 |

### 2-2. Cloudflare Pages에 도메인 연결

1. Cloudflare Dashboard → **Workers & Pages** → 해당 Pages 프로젝트 선택
2. **Custom domains** → **Set up a custom domain**
3. `modutools.kr` 입력 → Cloudflare가 안내하는 DNS 레코드 확인
4. 도메인 네임서버가 Cloudflare를 사용 중이면 DNS 레코드가 자동 또는 간단 승인으로 연결됩니다.
5. SSL/TLS는 **Full** 또는 Cloudflare Pages 기본 HTTPS 상태로 두고, `https://modutools.kr`가 정상 접속되는지 확인합니다.

### 2-3. Cloudflare Pages 빌드 설정

Cloudflare Pages 프로젝트의 빌드 설정은 다음 기준을 사용합니다.

```
Build command: npm run build
Build output directory: dist
Root directory: modutools-app
Node.js version: 20
```

환경변수는 Cloudflare Pages → **Settings** → **Environment variables** 에서 설정합니다.

```
SITE_URL=https://modutools.kr
VITE_SITE_URL=https://modutools.kr
VITE_ADSENSE_CLIENT_ID=ca-pub-7737972525635703
```

`SITE_URL`은 `sitemap.xml`과 정적 프리렌더 HTML 생성에 사용되고, `VITE_SITE_URL`은 React 런타임의 canonical/OG URL에 사용됩니다.

### 2-4. 코드 갱신

도메인이 바뀌면 다음 위치를 같은 호스트로 맞춥니다.

```
1. scripts/generate-sitemap.mjs 의 SITE_URL 기본값
2. scripts/prerender-static.mjs 의 SITE_URL 기본값
3. src/components/seo/SeoHead.tsx 의 SITE_URL 기본값
4. public/robots.txt 의 Sitemap: 라인
5. index.html 의 canonical, og:url, og:image
```

`index.html`의 절대 URL(canonical, og:url, og:image)도 실제 신청 도메인과 동일해야 합니다.

---

## 3. AdSense 신청 직전 점검

### 3-1. 사이트 기본 점검

- [ ] 자체 도메인이 HTTPS로 정상 접속됨 (`https://modutools.kr`)
- [ ] `https://modutools.kr` apex 도메인을 쓸 계획이라면 DNS/SSL/리다이렉트가 정상 동작함
- [ ] 모든 카테고리 페이지가 정상 렌더 (`/business`, `/qr`, `/submit`, `/thumbnail`, `/excel`)
- [ ] 도구 25개 중 임의 표본 5개를 클릭해 정상 동작 확인
- [ ] `/about`, `/terms`, `/privacy`, `/guide` 4개 정적 페이지 정상 노출
- [ ] 푸터에 운영자 이메일 노출 (`monglesb@gmail.com`)
- [ ] 다크모드 토글 정상

### 3-2. 색인·SEO 점검

- [ ] `https://modutools.kr/sitemap.xml` 직접 접근 → 35개 URL 정상 XML
- [ ] `https://modutools.kr/robots.txt` 정상
- [ ] `https://modutools.kr/og-image.png` 이미지 표시
- [ ] [Google Search Console](https://search.google.com/search-console) 사이트 등록 + sitemap 제출
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 에서 OG 미리보기 확인
- [ ] [카카오톡 공유 미리보기](https://developers.kakao.com/tool/clear/og)로 확인

### 3-3. 운영 점검 (정성적)

- 가능하면 **신청 전 사이트 운영 1~2개월** + 일일 방문자 30명 이상 누적이면 승인률 ↑
- AdSense 신청 시 입력하는 이메일 = 결제 받을 Google 계정 = `monglesb@gmail.com`

### 3-4. AdSense 신청

1. [adsense.google.com](https://adsense.google.com) 접속
2. 사이트 URL `https://modutools.kr` 입력, 국가 `대한민국` 선택
3. 결제 수단 정보(주소·계좌)는 신청 시점이 아니라 승인 후에 등록 가능
4. 사이트 검토 시작 → 일반적으로 1~14일 소요
5. 승인 또는 거절 메일 수신

---

## 4. 승인 후 활성화 절차

### 4-1. 환경변수 추가 (가장 먼저)

Cloudflare Pages → **Settings** → **Environment variables**:

```
VITE_ADSENSE_CLIENT_ID = ca-pub-XXXXXXXXXXXXXXXX
```

(승인 메일에 적힌 펍 ID, `ca-pub-`로 시작하는 16자리 숫자)

추가 후 **Retry deployment** 또는 새 커밋 배포 → `AdSlot` 컴포넌트가 모든 페이지에서 다시 노출되기 시작.

### 4-2. ads.txt 활성 라인 추가

`public/ads.txt` 파일에서 주석 처리된 예시를 풀어 활성 라인으로 교체:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

커밋 + 푸시. Cloudflare Pages가 자동 재배포.

### 4-3. AdSense 스크립트 + 실제 광고 코드 통합

현재 `AdSlot` 내부는 placeholder 박스입니다. 실제 광고가 나오려면 다음 두 가지를 적용해야 합니다.

#### (a) `index.html`에 AdSense 비동기 스크립트 추가

```html
<!-- index.html <head> 안 -->
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"
></script>
```

(`client=` 뒤를 빌드 시 환경변수로 치환하는 방법도 가능 — `vite-plugin-html-config` 사용)

#### (b) `AdSlot` 내부 placeholder 박스를 `<ins>` 태그로 교체

```tsx
// src/components/common/AdSlot.tsx
return (
  <ins
    className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client={clientId}
    data-ad-slot={slotId}
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
);

// 그리고 마운트 후 useEffect 에서
useEffect(() => {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
}, []);
```

이 통합 작업은 AdSense 펍 ID + 슬롯 ID가 손에 들어온 후 한 번에 진행하면 됩니다.

### 4-4. 광고 슬롯 ID 받기 & 페이지별 매핑

AdSense 콘솔에서 **광고 단위**를 만들면 각 단위마다 `data-ad-slot="1234567890"` 형식의 슬롯 ID가 나옵니다. 카테고리·도구별로 슬롯을 나누면 수익 분석이 쉬워집니다. 권장 분리:

| 슬롯 위치 | 단위 |
|---|---|
| 사장님 계산기 결과 하단 | `vat-mid`, `supply-mid`, `freelancer-mid`, `quote-mid`, `margin-mid` |
| Submit/QR/Excel SEO 본문 중간 | `seo-mid-responsive` |
| 카테고리 페이지 하단 | `category-bottom` |

`AdSlot` 컴포넌트의 `slotId` prop으로 전달하면 됩니다.

---

## 5. 환경변수 정리

전체 환경변수 목록 (`.env.example` 참고):

| 변수 | 용도 | 기본값 |
|---|---|---|
| `SITE_URL` | sitemap.xml 생성 시 사용 (빌드 타임 Node) | `https://modutools.kr` |
| `VITE_SITE_URL` | 브라우저 런타임에서 SeoHead가 참조 | `https://modutools.kr` |
| `VITE_ADSENSE_CLIENT_ID` | AdSlot 활성화 게이트. 미설정 시 광고 영역 비표시 | (미설정) |

Cloudflare Pages → **Settings** → **Environment variables** 에서 추가.

---

## 6. 운영 중 주의사항

### 6-1. 광고 배치 정책

- 도구의 **입력/결과 영역 안에는** 광고를 배치하지 않음 (현재 모든 AdSlot 호출이 이 원칙을 따르고 있음)
- 광고와 도구 버튼이 시각적으로 헷갈리지 않게 둘 사이 최소 80px 여백
- 광고 클릭을 유도하는 안내 문구(`"여기 클릭"`, `"광고 보기"` 등) 절대 금지

### 6-2. 자기 클릭 금지

- 본인이 광고를 클릭하면 즉시 계정 정지. 절대 금지.
- 가족·지인에게 클릭 요청도 금지 (IP가 같으면 어차피 추적됨).

### 6-3. 정책 변경 모니터링

- AdSense 정책 페이지: <https://support.google.com/adsense/answer/48182>
- 정책 위반 메일이 오면 즉시 해당 페이지 수정 후 재심사 요청

---

## 7. 빠른 참고 — 파일 위치 요약

```
docs/
  ADSENSE_SETUP.md       # 이 문서
modutools-app/
  .env.example           # 환경변수 안내 템플릿
  index.html             # 정적 OG 메타 (소셜 봇 fallback)
  public/
    robots.txt
    ads.txt              # 승인 후 활성 라인 추가
    og-image.png         # 1200x630 OG 이미지
    sitemap.xml          # 자동 생성 (빌드 시점)
  scripts/
    generate-sitemap.mjs # SITE_URL 환경변수 기반
    prerender-static.mjs # 35개 라우트 정적 HTML 생성
    generate-og.mjs      # SVG → PNG 변환 (수동)
    og-image.svg         # OG 디자인 원본
  src/
    components/
      common/AdSlot.tsx           # 환경변수 게이트
      seo/SeoHead.tsx             # 라우트별 메타·OG·JSON-LD
      seo/ToolSeoHead.tsx         # 도구 페이지 자동 메타
      business/DisclaimerBox.tsx  # 사장님 계산기 면책
    routes/
      AboutPage.tsx
      TermsPage.tsx
      PrivacyPage.tsx
      GuidePage.tsx
      HomePage.tsx
```

---

## 8. 진행 시점 다시 알리기

이 문서의 ⬜ 항목을 완료할 때마다 본 문서의 체크박스를 `[x]`로 갱신하세요. 최종 활성화 단계(§4-3)는 펍 ID 확보 후 한 번 더 통합 작업이 필요하므로, 그때 알려주시면 함께 마무리합니다.
