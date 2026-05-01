# Pull-Up Quest

8-бит трекер подтягиваний. PWA - устанавливается на телефон как нативное приложение.

## Деплой одной командой

```bash
gh repo create pullup-quest --public --source=. --push
gh api repos/:owner/pullup-quest/pages -X POST -f "build_type=legacy" -F "source[branch]=main" -F "source[path]=/"
```

После 1-2 минут приложение будет тут:
`https://<твой-username>.github.io/pullup-quest/`

## Установка на телефон

**iOS:** открыть ссылку в Safari → Поделиться → На экран «Домой»
**Android:** открыть в Chrome → меню → Установить приложение

## Структура

```
index.html      — разметка
styles.css      — стили (NES-палитра, CRT-эффект)
app.js          — рендер графиков и календаря
manifest.json   — манифест PWA
sw.js           — service worker (offline)
icons/          — иконки 192/512
```

## Как добавить новые данные

Открой `app.js`, найди массив `rawData` в начале файла, добавь новый объект:

```js
{ day: 1, label: '1 ПТ', sets: [10, 11, 9], total: 30 }
```

Для MAX-теста добавь `isMax: true`.

После изменений: `git add . && git commit -m "update" && git push` — GitHub Pages обновится автоматически за минуту.
