# Проверка учебного проекта

Дата: 28 октября 2026. Локальная среда: macOS, Node.js 24.12.0, npm 11.21.0.

## Что выполнено

Создан новый Git-репозиторий с веткой `main` и отправлен в публичную учебную репу [mtldvp/Qoldau-workshop](https://github.com/mtldvp/Qoldau-workshop) в выбранном владельцем аккаунте. До начала работы в локальной папке не было `.git` или исходников.

В pipeline добавлены все пункты со слайда: `Lint check`, `Build project`, `Check README` с командой `grep "project" README.md`. Дополнительно есть HTTP-тесты, smoke check готовой сборки и загрузка артефакта. В README подготовлены тезисы для выступления 3–4 участников.

## Локальный результат

`npm run check` завершился успешно:

- ESLint и Prettier — без ошибок.
- 7 HTTP-тестов — успешно: health API, страница и ресурсы, неизвестные пути и доступ к исходникам, неподдерживаемый метод, HEAD, query string, отсутствие статических файлов.
- Сборка в `dist/` — успешно.
- Проверка README — успешно.
- Smoke check — успешно: готовый сервер возвращает API, HTML, JavaScript, CSS и favicon.

Готовое приложение запущено командой `npm start`. В Chromium проверены страница на десктопе и ширине 390 px, ответ кнопки `HTTP 200`, сообщение об ошибке при отключённой сети и повторная успешная проверка после восстановления связи. До искусственного отключения сети ошибок и предупреждений в консоли не было. Скриншоты сохранены локально в игнорируемой папке `output/playwright/`.

## Dependabot

- В `.github/dependabot.yml` настроены еженедельные обновления npm и GitHub Actions.
- Dependabot alerts включены: проверка API вернула успешный ответ `204`.
- Dependabot security updates включены: API вернул `enabled: true`, `paused: false`.
- Первые проверки зависимостей завершились успешно: [npm](https://github.com/mtldvp/Qoldau-workshop/actions/runs/40638804990) и [GitHub Actions](https://github.com/mtldvp/Qoldau-workshop/actions/runs/40638805109).

## GitHub Actions

Первый [запуск CI](https://github.com/mtldvp/Qoldau-workshop/actions/runs/40638800554) для коммита `bbe33f8` завершился успешно. Все шаги прошли: установка зависимостей, линтер, тесты, сборка, README, smoke check и загрузка артефакта.

Артефакт `qoldau-workshop-build` сохранён в этом запуске CI. Архив содержит самостоятельную сборку приложения.

Повторный запуск: Actions → CI → Run workflow или команда:

```bash
gh workflow run ci.yml --repo mtldvp/Qoldau-workshop --ref main
```
