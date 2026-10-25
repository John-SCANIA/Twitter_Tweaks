// 左サイドバーで非表示にできる項目。設定画面とコンテンツスクリプトの両方で使う。
// Xは項目のURLや名前をよく変えるので、セレクタは複数書いておく。
const SIDEBAR_ITEMS = [
  { id: "home", label: "ホーム", selectors: ['a[data-testid="AppTabBar_Home_Link"]'] },
  { id: "explore", label: "話題を検索", selectors: ['a[data-testid="AppTabBar_Explore_Link"]'] },
  { id: "notifications", label: "通知", selectors: ['a[data-testid="AppTabBar_Notifications_Link"]'] },
  { id: "follow", label: "フォロー", selectors: ['a[href="/i/connect_people"]', 'a[href^="/i/connect_people?"]'] },
  { id: "messages", label: "メッセージ / チャット", selectors: ['a[data-testid="AppTabBar_DirectMessage_Link"]', 'a[href="/messages"]', 'a[href^="/i/chat"]'] },
  { id: "grok", label: "Grok", selectors: ['a[href="/i/grok"]', 'a[href^="/i/grok?"]'] },
  { id: "lists", label: "リスト", selectors: ['a[href$="/lists"]'] },
  { id: "bookmarks", label: "ブックマーク", selectors: ['a[href="/i/bookmarks"]'] },
  { id: "jobs", label: "求人", selectors: ['a[href="/jobs"]', 'a[href^="/i/jobs"]'] },
  { id: "communities", label: "コミュニティ", selectors: ['a[href$="/communities"]'] },
  { id: "premium", label: "プレミアム", selectors: ['a[href^="/i/premium"]', 'a[data-testid="premium-signup-tab"]'] },
  { id: "verifiedOrgs", label: "認証済み組織", selectors: ['a[href^="/i/verified-orgs"]'] },
  { id: "business", label: "ビジネス", selectors: ['a[href^="/i/business"]'] },
  { id: "monetization", label: "収益化", selectors: ['a[href^="/i/monetization"]', 'a[href^="/settings/monetization"]'] },
  { id: "spaces", label: "スペース", selectors: ['a[href^="/i/spaces"]'] },
  { id: "profile", label: "プロフィール", selectors: ['a[data-testid="AppTabBar_Profile_Link"]'] },
  { id: "more", label: "もっと見る", selectors: ['button[data-testid="AppTabBar_More_Menu"]', 'div[data-testid="AppTabBar_More_Menu"]'] },
  { id: "post", label: "ポストする（大きいボタン）", selectors: ['a[data-testid="SideNav_NewTweet_Button"]'] }
];
