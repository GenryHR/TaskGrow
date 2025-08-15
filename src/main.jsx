import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  
  // Fallback error display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Ошибка загрузки приложения</h1>
        <p style="color: #6b7280; margin-bottom: 1rem;">
          Произошла ошибка при загрузке приложения. Попробуйте обновить страницу.
        </p>
        <button 
          onclick="window.location.reload()"
          style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
          "
        >
          Обновить страницу
        </button>
        <details style="margin-top: 1rem; text-align: left;">
          <summary style="cursor: pointer; color: #6b7280;">Детали ошибки</summary>
          <pre style="
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: #f3f4f6;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            overflow: auto;
            color: #374151;
          ">${error instanceof Error ? error.message : String(error)}</pre>
        </details>
      </div>
    `;
  }
}
