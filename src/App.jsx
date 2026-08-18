import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'wait-time-alert.saved'
const postKey = 'wait-time-alert.posts'

// 掲載しているのは表示例。実際の待ち時間データはまだ接続していないため、
// 読者が実データと誤解しないよう、タイトルと画面上の注記で「例」と明示する。
const alerts = [
  {
    "id": "wait-time-alert-1",
    "title": "名古屋 病院の順番待ち（表示例）",
    "area": "名古屋",
    "category": "病院",
    "score": 95,
    "summary": "診察の順番があと何人かを通知します。院内で待ち続けなくても、近くで用事を済ませてから戻れます。",
    "channels": [
      "LINE",
      "X"
    ],
    "tags": [
      "病院",
      "順番待ち",
      "みんなの投稿"
    ]
  },
  {
    "id": "wait-time-alert-2",
    "title": "東京 役所の窓口待ち（表示例）",
    "area": "東京",
    "category": "役所",
    "score": 92,
    "summary": "窓口の待ち人数が減ったときに知らせます。混む時間帯を避けて行きたいときに使えます。",
    "channels": [
      "LINE",
      "X",
      "メール"
    ],
    "tags": [
      "役所",
      "窓口",
      "みんなの投稿"
    ]
  },
  {
    "id": "wait-time-alert-3",
    "title": "大阪 整理券の呼び出し（表示例）",
    "area": "大阪",
    "category": "整理券",
    "score": 89,
    "summary": "整理券の番号が近づいたら通知します。列に並ばず、呼ばれる少し前に戻れます。",
    "channels": [
      "LINE",
      "X",
      "メール",
      "Slack"
    ],
    "tags": [
      "整理券",
      "呼び出し",
      "みんなの投稿"
    ]
  },
  {
    "id": "wait-time-alert-4",
    "title": "静岡 QR受付の順番（表示例）",
    "area": "静岡",
    "category": "QR",
    "score": 86,
    "summary": "QRコードで受け付けた順番の進み具合を通知します。スマホを開き直さなくても状況が分かります。",
    "channels": [
      "LINE",
      "X"
    ],
    "tags": [
      "QR受付",
      "順番待ち",
      "みんなの投稿"
    ]
  }
]

const channels = [
  "LINE",
  "X",
  "メール",
  "Slack"
]

const faqs = [
  ['どんな場所に対応していますか？', 'いまは表示例として、病院、役所、整理券、QR受付の4つを載せています。対応する場所はこれから増やしていきます。'],
  ['通知はどこに届きますか？', 'LINE、X、メール、Slackを予定しています。普段使っているものを選べるようにします。'],
  ['待ち時間の情報はどこから来ますか？', '施設が公開している情報と、利用した方からの投稿をもとにします。実際の状況とずれることがあるため、大切な予定の前には施設の公式情報もご確認ください。'],
]

function readArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('すべて')
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const [posts, setPosts] = useState(() => readArray(postKey))
  const [form, setForm] = useState({ title: '', channel: 'LINE', memo: '' })
  const categories = ['すべて', ...new Set(alerts.map((item) => item.category))]

  const filtered = useMemo(() => alerts.filter((item) => {
    const text = [item.title, item.area, item.category, item.summary, item.channels.join(' '), item.tags.join(' ')].join(' ')
    return text.includes(query) && (category === 'すべて' || item.category === category)
  }), [query, category])

  function toggleSave(id) {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }

  function addPost(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.memo.trim()) return
    const next = [{ ...form, id: crypto.randomUUID(), date: new Date().toLocaleDateString('ja-JP') }, ...posts]
    setPosts(next)
    localStorage.setItem(postKey, JSON.stringify(next))
    setForm({ title: '', channel: 'LINE', memo: '' })
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">病院・役所・民間施設の順番待ち通知</p>
          <h1>待ち時間アラート</h1>
          <p className="lead">病院や役所の順番待ちを、スマホの通知でお知らせします。呼ばれる前に気づけるので、待合室に張りついたまま時間を使わずに済みます。</p>
        </div>
        <aside className="hero-panel">
          <span>waittimealert.jp</span>
          <strong>あと何人か分かれば、外で待てる。</strong>
          <p>LINE、X、メール、Slackのうち、普段使っているところに通知が届きます。いまは表示例を公開している段階です。</p>
        </aside>
      </section>
      <section className="controls" aria-label="検索条件">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="地域や施設の種類で探す" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </section>
      <section className="metrics">
        <article><span>掲載中の例</span><strong>{alerts.length}</strong></article>
        <article><span>通知の届け先</span><strong>{channels.length}</strong></article>
        <article><span>保存した数</span><strong>{saved.length}</strong></article>
        <article><span>投稿した数</span><strong>{posts.length}</strong></article>
      </section>
      <section className="alert-grid">
        {filtered.map((alert) => (
          <article className="alert-card" key={alert.id}>
            <div className="card-top"><span>{alert.area} / {alert.category}</span><b>{alert.score}</b></div>
            <h2>{alert.title}</h2>
            <p>{alert.summary}</p>
            <div className="tag-row">{alert.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="channel-row">{alert.channels.map((channel) => <span key={channel}>{channel}</span>)}</div>
            <button type="button" onClick={() => toggleSave(alert.id)}>{saved.includes(alert.id) ? '保存済み' : 'あとで見るために保存'}</button>
          </article>
        ))}
      </section>
      <section className="split">
        <div className="panel">
          <h2>使い方</h2>
          <article><b>1. 場所を選ぶ</b><p>行く予定の病院や役所、整理券を取った施設を選びます。</p></article>
          <article><b>2. 知りたい条件を決める</b><p>「あと5人になったら」「窓口が空いたら」など、動き出したいタイミングを決めます。</p></article>
          <article><b>3. 通知を受け取る</b><p>条件に近づいたら、LINEやメールに届きます。呼ばれる前に戻れます。</p></article>
          <article><b>いまの状態</b><p>公開しているのは表示例です。通知の受け付けは準備中で、対応する施設から順に始めます。</p></article>
        </div>
        <div className="panel">
          <h2>通知してほしい場所を教えてください</h2>
          <p>よく行く病院や役所、待ち時間で困った施設を教えてください。要望の多い場所から対応していきます。投稿はこの端末にだけ保存されます。</p>
          <form className="ugc-form" onSubmit={addPost}>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="施設名や場所" />
            <input value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })} placeholder="通知の届け先（LINE / X / メール / Slack）" />
            <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} placeholder="待ち時間で困ったこと、知りたい条件" />
            <button>送る</button>
          </form>
          <div className="post-list">
            {posts.length === 0 && <p className="empty">まだ投稿はありません。困った場面を教えていただけると、対応する場所を決める手がかりになります。</p>}
            {posts.map((post) => <article key={post.id}><b>{post.title}</b><p>{post.memo}</p><small>{post.channel} / {post.date}</small></article>)}
          </div>
        </div>
      </section>
      <section className="seo-section">
        <h2>これから増やしていくもの</h2>
        <div className="seo-grid">
          <article><b>地域ごとのページ</b><p>市区町村や駅ごとに、待ち時間を知りたい施設をまとめます。</p></article>
          <article><b>条件ごとのページ</b><p>「空いている時間帯」「混みにくい曜日」など、行く前に知りたいことをまとめます。</p></article>
          <article><b>施設の方向けの案内</b><p>待ち時間を掲載したい施設の方へ、掲載方法と運用のご案内を用意します。</p></article>
        </div>
      </section>
      <section className="faq-section">
        <h2>よくある質問</h2>
        <div className="faq-grid">{faqs.map(([q, a]) => <article key={q}><h3>{q}</h3><p>{a}</p></article>)}</div>
      </section>
    </main>
  )
}

export default App
