(function () {
  const style = document.createElement("style");
  style.innerHTML = `
    #customDialog {
      position: fixed;
      bottom: 40px;
      right: 40px;
      display: flex;
      align-items: center;
      padding: 18px 24px;
      border-radius: 16px;
      background: #ffffffcc;
      color: #1f1f1f;
      font-family: 'Segoe UI', 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.4;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.4s ease, transform 0.4s ease;
      z-index: 9999;
      max-width: 420px;
      min-width: 280px;
      gap: 16px;
      border-left: 6px solid transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      backdrop-filter: blur(20px);
    }

    #customDialog.show {
      opacity: 1;
      transform: translateY(0);
    }

    #customDialog .icon {
      font-size: 24px;
      flex-shrink: 0;
      line-height: 1;
      margin-top: 2px;
    }

    #customDialog .content {
      display: flex;
      flex-direction: column;
    }

    #customDialog .title {
      font-weight: 600;
      margin-bottom: 4px;
      line-height: 1.2;
      font-size: 16px;
    }

    #customDialog .subtitle {
      font-size: 14px;
      opacity: 0.85;
    }

    #customDialog.success {
      border-left-color: #22c55e;
    }
    #customDialog.error {
      border-left-color: #ef4444;
    }
    #customDialog.info {
      border-left-color: #3b82f6;
    }
    #customDialog.warning {
      border-left-color: #facc15;
    }
  `;
  document.head.appendChild(style);

  const dialog = document.createElement("div");
  dialog.id = "customDialog";

  const icon = document.createElement("div");
  icon.className = "icon";

  const content = document.createElement("div");
  content.className = "content";

  const title = document.createElement("div");
  title.className = "title";

  const subtitle = document.createElement("div");
  subtitle.className = "subtitle";

  content.appendChild(title);
  content.appendChild(subtitle);

  dialog.appendChild(icon);
  dialog.appendChild(content);
  document.body.appendChild(dialog);

  window.showDialog = function (msg, type = "info") {
    const titles = {
      success: "Success",
      error: "Error",
      info: "Info",
      warning: "Warning"
    };

    const icons = {
      success: "✅",
      error: "❌",
      info: "ℹ️",
      warning: "⚠️"
    };

    title.textContent = titles[type] || "Notice";
    subtitle.textContent = msg;
    icon.textContent = icons[type] || "ℹ️";

    dialog.className = `show ${type}`;

    if (dialog.dismissTimeout) clearTimeout(dialog.dismissTimeout);
    dialog.dismissTimeout = setTimeout(() => {
      dialog.classList.remove("show");
    }, 2000);
  };
})();