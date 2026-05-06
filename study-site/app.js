const state = {
  examIndex: 0,
  current: 0,
  answers: new Map(),
};

const els = {
  score: document.querySelector("#score"),
  nav: document.querySelector("#questionNav"),
  bank: document.querySelector("#vocabBank"),
  section: document.querySelector("#sectionTag"),
  page: document.querySelector("#pageTag"),
  number: document.querySelector("#questionNumber"),
  jp: document.querySelector("#jpSentence"),
  romaji: document.querySelector("#romaji"),
  translation: document.querySelector("#translation"),
  feedback: document.querySelector("#feedback"),
  explanation: document.querySelector("#explanation"),
  vocab: document.querySelector("#vocabList"),
  trueBtn: document.querySelector("#answerTrue"),
  falseBtn: document.querySelector("#answerFalse"),
  prev: document.querySelector("#prevQuestion"),
  next: document.querySelector("#nextQuestion"),
  reset: document.querySelector("#resetQuiz"),
  audio: document.querySelector("#audioPlayer"),
  play: document.querySelector("#playAudio"),
  source: document.querySelector("#sourceImage"),
  examSelect: document.querySelector("#examSelect"),
};

function exam() {
  return EXAMS[state.examIndex];
}

function questions() {
  return exam().questions;
}

function keyFor(question) {
  return `${exam().id}:${question.id}`;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function vocabFor(question) {
  return VOCAB.filter(([term]) => question.jp.includes(term));
}

function highlight(sentence, vocab) {
  let html = sentence;
  [...vocab].sort((a, b) => b[0].length - a[0].length).forEach(([term]) => {
    html = html.replace(new RegExp(escapeRegExp(term), "g"), `<mark>${term}</mark>`);
  });
  return html;
}

function renderVocabChip(jp, vi) {
  const safeJp = escapeHtml(jp);
  const safeVi = escapeHtml(vi);
  return `
    <span class="vocab-chip">
      <button class="vocab-audio" type="button" data-speak="${safeJp}" title="Nghe từ ${safeJp}" aria-label="Nghe từ ${safeJp}">▶</button>
      <span class="vocab-text"><b>${safeJp}</b>${safeVi}</span>
    </span>
  `;
}

function speakJapanese(text) {
  if (!("speechSynthesis" in window)) {
    els.feedback.hidden = false;
    els.feedback.className = "feedback bad";
    els.feedback.textContent = "Trinh duyet nay chua ho tro doc audio tu vung.";
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.82;
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang === "ja-JP" || item.lang.startsWith("ja"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function renderExamSelect() {
  els.examSelect.innerHTML = EXAMS.map((item, index) => {
    return `<option value="${index}">${item.title}</option>`;
  }).join("");
  els.examSelect.value = String(state.examIndex);
}

function renderNav() {
  els.nav.innerHTML = "";
  questions().forEach((q, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-dot";
    button.textContent = q.id;
    if (index === state.current) button.classList.add("active");
    const saved = state.answers.get(keyFor(q));
    if (saved !== undefined) button.classList.add(saved === q.answer ? "correct" : "wrong");
    button.addEventListener("click", () => {
      state.current = index;
      render();
    });
    els.nav.append(button);
  });
}

function renderScore() {
  const currentKeys = questions().map(keyFor);
  const answered = currentKeys.filter((key) => state.answers.has(key));
  const correct = answered.filter((key) => {
    const [, id] = key.split(":");
    const q = questions().find((item) => String(item.id) === id);
    return q && state.answers.get(key) === q.answer;
  }).length;
  els.score.textContent = `${correct}/${answered.length}`;
}

function renderVocabBank() {
  const terms = new Map();
  questions().forEach((q) => vocabFor(q).forEach(([jp, vi]) => terms.set(jp, vi)));
  els.bank.innerHTML = [...terms.entries()]
    .slice(0, 24)
    .map(([jp, vi]) => renderVocabChip(jp, vi))
    .join("");
}

function renderQuestion() {
  const q = questions()[state.current];
  const selected = state.answers.get(keyFor(q));
  const vocab = vocabFor(q);
  els.section.textContent = exam().title;
  els.page.textContent = `Trang ${q.page}`;
  els.number.textContent = `Cau ${q.id} / ${questions().length}`;
  els.jp.innerHTML = highlight(q.jp, vocab);
  els.romaji.textContent = q.romaji;
  els.translation.textContent = q.vi;
  els.explanation.textContent = q.reason;
  els.vocab.innerHTML = vocab.length
    ? vocab.map(([jp, vi]) => renderVocabChip(jp, vi)).join("")
    : `<span class="vocab-chip"><b>Ghi chu</b>Tu vung se duoc bo sung khi ra soat lai OCR.</span>`;
  els.audio.src = `assets/audio/${exam().id}_q${String(q.id).padStart(2, "0")}.m4a`;
  els.source.src = `assets/pages/page_${String(q.page).padStart(2, "0")}.jpg`;

  [els.trueBtn, els.falseBtn].forEach((btn) => {
    btn.classList.remove("selected", "correct-choice", "wrong-choice");
  });

  if (selected === undefined) {
    els.feedback.hidden = true;
  } else {
    const isCorrect = selected === q.answer;
    const chosen = selected ? els.trueBtn : els.falseBtn;
    chosen.classList.add("selected", isCorrect ? "correct-choice" : "wrong-choice");
    els.feedback.hidden = false;
    els.feedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
    els.feedback.textContent = isCorrect
      ? "Chinh xac. Hay nghe lai audio va doc lai tu khoa duoc highlight."
      : `Chua dung. Dap an dung la: ${q.answer ? "Dung" : "Sai"}.`;
  }

  els.prev.disabled = state.current === 0;
  els.next.disabled = state.current === questions().length - 1;
}

function answer(value) {
  state.answers.set(keyFor(questions()[state.current]), value);
  render();
}

function switchExam(index) {
  state.examIndex = index;
  state.current = 0;
  renderVocabBank();
  render();
}

function render() {
  renderNav();
  renderScore();
  renderQuestion();
}

function goToPreviousQuestion() {
  state.current = Math.max(0, state.current - 1);
  render();
}

function goToNextQuestion() {
  state.current = Math.min(questions().length - 1, state.current + 1);
  render();
}

function isTypingTarget(target) {
  return ["INPUT", "SELECT", "TEXTAREA", "BUTTON", "AUDIO"].includes(target.tagName) || target.isContentEditable;
}

els.examSelect.addEventListener("change", (event) => switchExam(Number(event.target.value)));
els.trueBtn.addEventListener("click", () => answer(true));
els.falseBtn.addEventListener("click", () => answer(false));
els.prev.addEventListener("click", goToPreviousQuestion);
els.next.addEventListener("click", goToNextQuestion);
els.reset.addEventListener("click", () => {
  questions().forEach((q) => state.answers.delete(keyFor(q)));
  state.current = 0;
  render();
});
els.play.addEventListener("click", () => {
  els.audio.currentTime = 0;
  els.audio.play();
});
document.addEventListener("click", (event) => {
  const button = event.target.closest(".vocab-audio");
  if (!button) return;
  speakJapanese(button.dataset.speak);
});
document.addEventListener("keydown", (event) => {
  if (isTypingTarget(event.target)) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToPreviousQuestion();
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    goToNextQuestion();
  }
});

renderExamSelect();
renderVocabBank();
render();
