import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles.css';

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e: any) {
  document.getElementById('root')!.innerHTML = `<pre style="color:red; font-size: 20px;">${e.stack || e.message}</pre>`;
}
