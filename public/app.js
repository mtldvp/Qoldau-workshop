const button = document.querySelector("#health-check");
const result = document.querySelector("#health-result");

button.addEventListener("click", async () => {
  button.disabled = true;
  result.dataset.state = "pending";
  result.textContent = "Проверяем сервер…";
  try {
    const response = await fetch("/health", {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.status !== "ok" || data.project !== "qoldau-workshop") {
      throw new Error("Неожиданный ответ сервера");
    }
    result.dataset.state = "ok";
    result.textContent = `✓ Приложение работает · ${data.project} · HTTP 200`;
  } catch {
    result.dataset.state = "error";
    result.textContent =
      "Не удалось связаться с сервером. Проверьте запуск и попробуйте ещё раз.";
  } finally {
    button.disabled = false;
  }
});
