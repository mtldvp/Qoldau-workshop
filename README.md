# Qoldau workshop

[![CI](https://github.com/mtldvp/Qoldau-workshop/actions/workflows/ci.yml/badge.svg)](https://github.com/mtldvp/Qoldau-workshop/actions/workflows/ci.yml)

A small runnable project for the “Improve your pipeline” team workshop.

Учебное приложение на Node.js 24: страница с объяснением pipeline и кнопкой, которая делает настоящий запрос к `/health`. База данных, секреты и внешние сервисы для запуска не нужны.

## Запуск

Установите Node.js 24 (версия указана в `.nvmrc`). В терминале из папки проекта:

```bash
npm ci
npm run build
npm start
```

Откройте <http://127.0.0.1:3000>. Нажмите «Проверить приложение»: должен появиться ответ `HTTP 200`. Остановить сервер можно через `Ctrl+C`.

Для разработки: `npm run dev` (сборка перед этим не нужна). Другой порт: `PORT=3001 npm start`. По умолчанию сервер доступен только локально. Для контейнера или другого устройства в локальной сети задайте `HOST=0.0.0.0`.

## Проверка одной командой

```bash
npm run check
```

Эта команда последовательно запускает линтер, тесты, сборку, проверку README и smoke check готовой сборки. Smoke check использует свободный локальный порт и сам останавливает свой сервер.

| Задание со слайда       | Что добавлено                                           | Зачем                                               |
| ----------------------- | ------------------------------------------------------- | --------------------------------------------------- |
| Linter                  | `Lint check`: ESLint + Prettier, затем `Lint passed`    | Найти ошибки JavaScript и форматирования            |
| Build step              | `Build project`: сборка `dist/`, затем `Build complete` | Получить запускаемый результат                      |
| Extra check             | `Check README`: `grep "project" README.md`              | Убедиться, что документация содержит ключевое слово |
| Дополнительные проверки | HTTP-тесты и smoke check                                | Проверить поведение API и запуск готовой сборки     |
| Dependabot              | npm и GitHub Actions, еженедельно                       | Предлагать обновления зависимостей                  |

Файлы CI: [`.github/workflows/ci.yml`](.github/workflows/ci.yml) и [`.github/dependabot.yml`](.github/dependabot.yml). CI запускается при push в `main`, при pull request и вручную через Actions → CI → Run workflow. После успешной проверки в Actions доступен артефакт `qoldau-workshop-build`.

Линтер и сборка выполняют настоящие команды. Строки `echo` из задания выводятся только после их успешного завершения; ошибки не скрываются.

## Dependabot

Версионные обновления настраиваются файлом `.github/dependabot.yml`. В GitHub также должны быть включены **Dependabot alerts** и **Dependabot security updates**: Settings → Security → Advanced Security (название раздела может меняться). Эти параметры включаются отдельно от конфигурационного файла.

Официальная документация: [version updates](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-version-updates), [security updates](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-security-updates).

## API и сборка

`GET /health` возвращает `{"status":"ok","project":"qoldau-workshop"}`. Неизвестные пути возвращают `404`, неподдерживаемые методы — `405`. Статические файлы обслуживаются из фиксированного списка.

В `dist/` находятся сервер, HTML, CSS, JS и `package.json` с типом модулей. После копирования содержимого `dist/` в отдельную папку приложение запускается командой `node src/server.js` без установки зависимостей. Команды ESLint и Prettier нужны только при разработке.

## Выступление команды (3–4 участника)

1. **Участник 1 — что добавили:** «Мы добавили линтер ESLint и проверку форматирования Prettier. Команда `npm run lint` завершает CI с ошибкой, если код не проходит проверку».
2. **Участник 2 — зачем нужна сборка:** «Шаг Build project собирает приложение в dist. Затем smoke check запускает именно эту сборку и проверяет страницу, API и ресурсы».
3. **Участник 3 — дополнительные проверки:** «Мы добавили проверку README со слайда и HTTP-тесты. В Actions виден результат каждого шага».
4. **Участник 4 — Dependabot и демонстрация:** «Dependabot предлагает обновления npm и GitHub Actions. Покажем зелёный CI и работающую кнопку проверки сервера». В команде из трёх человек этот пункт берёт один из предыдущих участников.

Каждый участник говорит хотя бы один раз. Для демонстрации откройте успешный запуск CI и локальную страницу приложения.
