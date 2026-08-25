"use strict";

/* =========================================================
   EmailJS 設定 — 回應通知 (見 CONTEXT.md「回應通知」)
   請到 https://www.emailjs.com/ 申請帳號後，把下面四個值換成你自己的。
   詳細步驟見 SETUP.md。在填好之前，通知會照設計靜默失敗，不影響情書畫面。
   ========================================================= */
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const ASKER_EMAIL = "your-email@example.com";

try {
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
} catch (err) {
  // 靜默失敗：見 CONTEXT.md「回應通知」規則
}

/* ========================= 畫面切換 ========================= */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.toggle("hidden", el.id !== id);
  });
}

/* ========================= 拒絕縮小機制 ========================= */

const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const noPhraseEl = document.getElementById("no-phrase");

const NO_MIN_SCALE = 0.15;
const YES_MAX_SCALE = 2.4;
const GROWTH_STEP = 0.16;

const NO_PHRASES = [
  "不要這樣啦",
  "人家是認真的耶",
  "再考慮一下下嘛～",
  "你確定要選這個嗎？",
  "選 YES 比較可愛喔",
  "拜託拜託～",
  "好啦好啦我知道你會按 YES 的",
];

let noClickCount = 0;

btnNo.addEventListener("click", () => {
  noClickCount += 1;

  const yesScale = Math.min(YES_MAX_SCALE, 1 + noClickCount * GROWTH_STEP);
  const noScale = Math.max(NO_MIN_SCALE, 1 - noClickCount * GROWTH_STEP);

  btnYes.style.transform = `scale(${yesScale})`;
  btnNo.style.transform = `scale(${noScale})`;

  noPhraseEl.textContent = NO_PHRASES[(noClickCount - 1) % NO_PHRASES.length];

  if (noScale <= NO_MIN_SCALE) {
    btnNo.disabled = true;
  }
});

btnYes.addEventListener("click", () => {
  showScreen("screen-celebrate");
});

document.getElementById("btn-next").addEventListener("click", () => {
  showScreen("screen-calendar");
  renderCalendar();
});

/* ========================= 日曆選日 ========================= */

const calTitle = document.getElementById("cal-title");
const calGrid = document.getElementById("cal-grid");
const calPrev = document.getElementById("cal-prev");
const calNext = document.getElementById("cal-next");

const MONTH_NAMES = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

const today = new Date();
today.setHours(0, 0, 0, 0);

let viewYear = today.getFullYear();
let viewMonth = today.getMonth(); // 0-indexed

let dateLocked = false;

function isBeforeToday(y, m, d) {
  const candidate = new Date(y, m, d);
  candidate.setHours(0, 0, 0, 0);
  return candidate < today;
}

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function renderCalendar() {
  calTitle.textContent = `${viewYear} 年 ${MONTH_NAMES[viewMonth]}`;

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
  calPrev.disabled = isCurrentMonth;

  calGrid.innerHTML = "";

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i += 1) {
    const empty = document.createElement("div");
    empty.className = "cal-day empty";
    calGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cal-day";
    cell.textContent = String(day);

    const cellDate = new Date(viewYear, viewMonth, day);

    if (isSameDate(cellDate, today)) {
      cell.classList.add("today");
    }

    if (isBeforeToday(viewYear, viewMonth, day)) {
      cell.classList.add("disabled");
    } else {
      cell.addEventListener("click", () => selectDate(cellDate));
    }

    calGrid.appendChild(cell);
  }
}

calPrev.addEventListener("click", () => {
  viewMonth -= 1;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  }
  renderCalendar();
});

calNext.addEventListener("click", () => {
  viewMonth += 1;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  }
  renderCalendar();
});

function selectDate(date) {
  if (dateLocked) return; // 約會日期一經鎖定即不可修改，見 CONTEXT.md
  dateLocked = true;

  sendNotification(date);
  showLetter(date);
}

/* ========================= 回應通知（背景、靜默失敗） ========================= */

function sendNotification(date) {
  try {
    if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
      return; // EmailJS 尚未設定，靜默跳過
    }
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: ASKER_EMAIL,
        message: `Uni小寶貝答應約會了！約定日期：${formatDate(date)}`,
        chosen_date: formatDate(date),
      })
      .catch(() => {
        // 靜默失敗，見 CONTEXT.md「回應通知」規則
      });
  } catch (err) {
    // 靜默失敗
  }
}

/* ========================= 情書 ========================= */

function formatDate(date) {
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日（星期${weekday}）`;
}

function showLetter(date) {
  const content = [
    "Uni小寶貝：",
    "",
    "不管怎樣，你都真的很可愛，",
    "不要讓任何人告訴你不是，好嗎？",
    "",
    "有你在，每個平凡的日子都變得特別。",
    "",
    "謝謝你願意花時間認識我、陪著我，",
    "這些日子我真的很珍惜。",
    "",
    "謝謝你按下了 YES，",
    `${formatDate(date)}，`,
    "我們就正式約定好了。",
    "",
    "在那之前我會好好期待，",
    "到時候見 ❤",
    "",
    "                    親親，大林",
  ].join("\n");

  document.getElementById("letter-content").textContent = content;
  showScreen("screen-letter");
}
