# 設定回應通知（EmailJS）

情書畫面顯示的同時，網站會在背景嘗試寄一封信通知你（發送人）對方已經答應、約定了哪一天。這一步需要你自己申請一個免費的 EmailJS 帳號並填入設定，填好之前這個通知會靜默失敗（不影響情書正常顯示）。

## 步驟

1. 到 https://www.emailjs.com/ 註冊帳號。
2. 在 **Email Services** 建立一個 Service（連你自己的 Gmail 等信箱），複製它的 **Service ID**。
3. 在 **Email Templates** 建立一個 Template，內容至少要用到這兩個變數：
   - `{{chosen_date}}` — 對方選的約會日期
   - `{{message}}` — 一句組合好的通知文字
   - 收件地址欄位填 `{{to_email}}`
   複製這個 Template 的 **Template ID**。
4. 在 **Account → General** 找到你的 **Public Key**。
5. 打開 [script.js](script.js) 最上面，把四個常數換成你自己的值：

```js
const EMAILJS_SERVICE_ID = "你的 Service ID";
const EMAILJS_TEMPLATE_ID = "你的 Template ID";
const EMAILJS_PUBLIC_KEY = "你的 Public Key";
const ASKER_EMAIL = "你想收到通知的信箱";
```

6. 存檔後重新整理頁面測試：走一次完整流程選一個日期，檢查信箱有沒有收到通知信。

## 美術素材說明

目前頁面裡的貓咪、雲朵、建築剪影都是用 CSS/SVG 手繪的原創圖形，不是下載的素材包 —— 這樣不用擔心授權問題，也不依賴外部檔案。如果你想換成更精緻的像素風圖片素材，可以把 `.cat-scene` 裡的手繪貓咪換成你自己準備的圖片（放進一個 `assets/` 資料夾，`<img>` 引用即可）。
