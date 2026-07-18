# Wait Time Alert

病院・役所・民間施設の待ち時間通知

## Repository

Recommended repository name: `wait-time-alert`

## Domain candidates

Confirmed domain: `waittimealert.jp`

Other candidates:

- `waittimealert.jp`
- `machijikan.jp`
- `queuealert.jp`
- `neconomeplus.jp`

## Concept

病院、役所、民間施設、整理券、QR待ち時間を通知し、施設向けSaaSと広告へつなげる。

## Technical Selection

- Frontend: Vite + React 19
- Styling: Plain CSS
- Initial data: Static alert seed records in `src/App.jsx`
- Local state: localStorage for MVP saved alerts and UGC requests
- Notification integrations: LINE Messaging API, X API, transactional email provider, Slack Incoming Webhooks
- Future data layer: Supabase or Cloudflare D1
- SEO/AIO/LLMO: structured data, answer block, FAQ, sitemap, robots and `llms.txt`

## Revenue Paths

- 施設SaaS
- 予約送客
- 広告
- 法人契約
- レポート

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
