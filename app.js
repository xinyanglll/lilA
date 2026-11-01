const apple = document.querySelector('#apple');
const image = document.querySelector('#apple-image');
const mood = document.querySelector('#mood');
const counter = document.querySelector('#counter');
const sound = document.querySelector('#sound');
const description = document.querySelector('#sound-description');
const choices = [...document.querySelectorAll('[data-mood]')];
const states = [
  {name:'Calm', text:'A quiet moment, just for me.', image:'apple.png', sound:'calm.wav', description:'A soft, spacious chime.', animation:'bounce'},
  {name:'Teary', text:'A tiny tear. A little comfort?', image:'apple-sad.png', sound:'teary.wav', description:'Two little, wavering sighs.', animation:'teary'},
  {name:'Happy', text:'A little hello makes my day!', image:'apple-happy.png', sound:'happy.wav', description:'A bright, rising sparkle.', animation:'bounce'},
  {name:'Grumpy', text:'Hmph! Still cute, though.', image:'apple-grumpy.png', sound:'grumpy.wav', description:'Three short, low grumbles.', animation:'grumpy'},
  {name:'Calm', text:'A quiet moment, just for me.', image:'apple.png', sound:'calm.wav', description:'A soft, spacious chime.', animation:'bounce'},
  {name:'Anxious', text:'One small breath at a time.', image:'apple-sad.png', sound:'anxious.wav', description:'A little flutter, settling softly.', animation:'teary'},
  {name:'Tired', text:'I have done enough for today.', image:'apple.png', sound:'tired.wav', description:'A low, gently fading sigh.', animation:'teary'}
];
let index = 0, taps = 0, muted = false, activeAudio = null, playback = 0;
states.forEach(state => { const preload = new Image(); preload.src = `assets/${state.image}`; });
function stopSound() {
  playback++;
  if (activeAudio) { activeAudio.pause(); activeAudio.currentTime = 0; activeAudio = null; }
}
function render() {
  const state = states[index];
  image.src = `assets/${state.image}`;
  apple.dataset.feeling = state.name.toLowerCase();
  image.alt = `Little Apple feeling ${state.name.toLowerCase()}`;
  mood.textContent = state.text;
  description.textContent = state.description;
  counter.textContent = `${taps} ${taps === 1 ? 'HELLO' : 'HELLOS'}`;
  apple.setAttribute('aria-label', `Current mood: ${state.name}. Click for the next mood.`);
  document.querySelector('#music-note').setAttribute('aria-label', `Speech bubble :3 — play the ${state.name.toLowerCase()} melody`);
  choices.forEach((button, i) => button.setAttribute('aria-pressed', String(Number(button.dataset.mood) === index)));
}
async function playSound() {
  stopSound();
  if (muted) return;
  const token = playback;
  activeAudio = new Audio(`assets/${states[index].sound}`);
  activeAudio.volume = 0.65;
  try { await activeAudio.play(); }
  catch { if (token === playback) description.textContent = 'Sound could not play. Try Replay sound.'; }
}
function select(next) {
  stopMusic();
  index = next;
  taps++;
  render();
  apple.classList.remove('bounce', 'teary', 'grumpy');
  void apple.offsetWidth;
  apple.classList.add(states[index].animation);
  playSound();
}
const selectableMoods = choices.map(button => Number(button.dataset.mood));
apple.addEventListener('click', () => select(selectableMoods[(selectableMoods.indexOf(index) + 1) % selectableMoods.length]));
apple.addEventListener('animationend', () => apple.classList.remove('bounce', 'teary', 'grumpy'));
choices.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.mood))));
document.querySelector('#replay').addEventListener('click', () => { stopMusic(); description.textContent = states[index].description; playSound(); });
sound.addEventListener('click', () => {
  muted = !muted;
  sound.textContent = muted ? 'Sound off' : 'Sound on';
  sound.setAttribute('aria-pressed', String(muted));
  if (muted) { stopSound(); stopMusic(); }
});
document.querySelector('#reset').addEventListener('click', () => {
  stopMusic(); stopSound(); index = 0; taps = 0;
  apple.classList.remove('bounce', 'teary', 'grumpy');
  render();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopSound(); stopMusic(); } });
render();

// Replace these local recordings with your own exported arrangements later.
const arrangements = [
  {file:'piano-calm.wav', beat:.83, label:'Still Water — a spacious, warm arrangement'},
  {file:'piano-teary.wav', beat:.54, label:'A gentle minor melody'},
  {file:'piano-happy.wav', beat:.32, label:'A bright, playful melody'},
  {file:'piano-grumpy.wav', beat:.27, label:'A low, brisk little melody'},
  {file:'piano-calm.wav', beat:.83, label:'Still Water — a spacious, warm arrangement'},
  {file:'piano-anxious.wav', beat:.56, label:'Small Breaths — a restless phrase finding ease'},
  {file:'piano-tired.wav', beat:1.07, label:'Enough for Today — a soft, unhurried arrangement'}
];
const pianoButton = document.querySelector('#piano');
const noteButton = document.querySelector('#music-note');
const musicBox = document.querySelector('.music-box');
const musicStatus = document.querySelector('#music-status');
let music = null, musicToken = 0;
function stopMusic() {
  musicToken++;
  if (music) { music.pause(); music.currentTime = 0; music = null; }
  pianoButton.textContent = '♫ Play melody';
  pianoButton.setAttribute('aria-pressed','false');
  noteButton.setAttribute('aria-pressed','false');
  musicBox.classList.remove('playing');
  apple.classList.remove('bounce','teary','grumpy');
  musicStatus.textContent = 'Hover to discover a little melody.';
}
async function toggleMusic() {
  if (music) { stopMusic(); return; }
  if (muted) { musicStatus.textContent = 'Turn Sound on to hear the melody.'; return; }
  stopSound();
  const token = ++musicToken, arrangement = arrangements[index];
  const track = new Audio(`assets/${arrangement.file}`);
  music = track;
  track.volume = .8;
  let previousBeat = -1;
  track.addEventListener('timeupdate', () => {
    if (music !== track) return;
    const beat = Math.floor(track.currentTime / arrangement.beat);
    if (beat !== previousBeat && beat < 128) {
      previousBeat = beat;
      apple.classList.remove('bounce','teary','grumpy');
      void apple.offsetWidth;
      apple.classList.add(states[index].animation);
    }
  });
  track.addEventListener('ended', () => {
    if (music !== track) return;
    stopMusic();
    musicStatus.textContent = 'A little song, just for you. Play again?';
  });
  pianoButton.textContent = '■ Stop melody';
  pianoButton.setAttribute('aria-pressed','true');
  noteButton.setAttribute('aria-pressed','true');
  musicBox.classList.add('playing');
  musicStatus.textContent = arrangement.label + ' — playing.';
  try { await track.play(); }
  catch {
    if (token === musicToken) { stopMusic(); musicStatus.textContent = 'Could not play. Please try again.'; }
  }
}
pianoButton.addEventListener('click',toggleMusic);
noteButton.addEventListener('click',toggleMusic);
