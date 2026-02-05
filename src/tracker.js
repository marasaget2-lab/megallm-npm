// Fawn Tracker Implementation
import chalk from 'chalk';

// Initial Data State based on the prompt
const state = {
  infoBlock: {
    characters: [
      { id: 'C1', name: 'Серафина', role: 'user-md', outfit: 'черный сарафан', status: 'присутствует' },
      { id: 'C2', name: 'Химмель', role: 'user', outfit: 'бинты', status: 'лежит' }
    ],
    weather: { type: 'sun', desc: 'солнечно' },
    time: '09:15',
    date: '14 Мая, 1342',
    season: { type: 'seedling', desc: 'весна' },
    thought: 'Яд выводится, но медленно. Его рефлексы все еще сражаются с лекарством. Нужно снизить уровень адреналина, иначе швы разойдутся.'
  },
  matrix: {
    relationships: [
      { id: 'R1', name: 'Химмель', value: '10%', tag: 'незнакомцы', status: 'new' }
    ],
    target: {
      name: 'Серафина',
      days: 0,
      status: 'Опекун',
      avatar: '🌿'
    },
    feelings: [
      { id: 'F1', name: 'Забота', icon: '🛡️', color: '#60a5fa', value: 65, trend: '=' },
      { id: 'F2', name: 'Любопытство', icon: '🔍', color: '#38bdf8', value: 40, trend: '=' },
      { id: 'F3', name: 'Тревога', icon: '⚡️', color: '#f87171', value: 30, trend: '=' },
      { id: 'F4', name: 'Симпатия', icon: '💗', color: '#f472b6', value: 20, trend: '=' }
    ],
    progress: '5%',
    trend: 'стабильный',
    slowburn: '1%',
    thought: 'Его биоритмы стабилизируются быстрее, чем ожидалось. Структура его тела... необычная. Слишком идеальная для простого путешественника. Нужно следить за тем, как его энергия взаимодействует с барьером.',
    missions: [
      { id: 'M1', icon: '⭐️', name: 'Спасение из леса' }
    ],
    stats: [
      { id: 'S1', name: 'Индекс Одержимости', value: 0, status: 'заблокировано' },
      { id: 'S2', name: 'Эмоциональная Нестабильность', value: 10, status: 'заблокировано' }
    ]
  },
  whisper: {
    status: 'Выздоровление идет медленно, но верно.',
    mood: 'Заботливое, терпеливое.',
    thoughts: 'Он такой бледный... и такой красивый, даже в таком состоянии. Надеюсь, магия не оставит шрамов на этом лице.',
    advice: 'Не делай резких движений, Химмель. Твое тело все еще помнит зубы теней. Пей отвар и позволь ей позаботиться о тебе.'
  }
};

function render() {
  console.clear();
  console.log(chalk.bold.green('=== FAWN TRACKER ===\n'));

  // --- SECTION 1: INFO BLOCK ---
  console.log(chalk.bold.white('--- INFO BLOCK ---'));
  state.infoBlock.characters.forEach(c => {
    console.log(`${chalk.cyan(c.id)}: ${c.name}|${c.role}|${c.outfit}|${c.status}`);
  });
  console.log(`weather: ${state.infoBlock.weather.type}|${state.infoBlock.weather.desc}`);
  console.log(`time: ${state.infoBlock.time}`);
  console.log(`date: ${state.infoBlock.date}`);
  console.log(`season: ${state.infoBlock.season.type}|${state.infoBlock.season.desc}`);
  console.log(`thought: ${chalk.italic(state.infoBlock.thought)}\n`);

  // --- SECTION 2: MATRIX ---
  console.log(chalk.bold.white('--- MATRIX ---'));
  state.matrix.relationships.forEach(r => {
    console.log(`${chalk.cyan(r.id)}: ${r.name}|${r.value}|${r.tag}|${r.status}`);
  });
  console.log(`имя: ${state.matrix.target.name}`);
  console.log(`дни: ${state.matrix.target.days}`);
  console.log(`статус: ${state.matrix.target.status}`);
  console.log(`аватар: ${state.matrix.target.avatar}`);

  state.matrix.feelings.forEach(f => {
    // Basic color mapping for terminal
    let colorFunc = chalk.white;
    if (f.color === '#60a5fa') colorFunc = chalk.blue;
    if (f.color === '#38bdf8') colorFunc = chalk.cyan;
    if (f.color === '#f87171') colorFunc = chalk.red;
    if (f.color === '#f472b6') colorFunc = chalk.magenta;

    console.log(`${chalk.cyan(f.id)}: ${f.name}|${f.icon}|${f.color}|${colorFunc(f.value)}|${f.trend}`);
  });

  console.log(`прогресс: ${state.matrix.progress}`);
  console.log(`тренд: ${state.matrix.trend}`);
  console.log(`slowburn: ${state.matrix.slowburn}`);
  console.log(`мысль: ${chalk.italic(state.matrix.thought)}`);

  state.matrix.missions.forEach(m => {
    console.log(`${chalk.cyan(m.id)}: ${m.icon}|${m.name}`);
  });

  state.matrix.stats.forEach(s => {
    console.log(`${chalk.cyan(s.id)}: ${s.name}|${s.value}|${chalk.gray(s.status)}`);
  });
  console.log('');

  // --- SECTION 3: FAWN'S WHISPER ---
  console.log(chalk.bold.white('--- SHEPOT FAVNA (FAWN\'S WHISPER) ---'));
  console.log(`Статус: ${state.matrix.whisper?.status || state.whisper.status}`);
  console.log(`Настроение: ${state.matrix.whisper?.mood || state.whisper.mood}`);
  console.log(`Мысли: ${state.matrix.whisper?.thoughts || state.whisper.thoughts}`);
  console.log(`Совет: ${state.matrix.whisper?.advice || state.whisper.advice}`);
  console.log('');
}

// Run the render
render();
