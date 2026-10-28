export const metadata = {
  title: "HORSAN CRM",
  description: "سیستم مدیریت مشتریان مجموعه هورسان",
};

const styles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Tahoma, Vazirmatn, sans-serif; background: #f4f6f5; color: #111; }
  .wrap { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
  .card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
  input, select, button { font: inherit; padding: 8px 12px; border-radius: 8px; border: 1px solid #ccc; }
  button { background: #1f7a4d; color: #fff; border: none; cursor: pointer; }
  button:disabled { opacity: .5; cursor: default; }
  button.ghost { background: #eee; color: #111; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 10px; border-bottom: 1px solid #eee; text-align: right; }
  .muted { color: #777; font-size: 14px; }
  .error { color: #b00020; }
  .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
