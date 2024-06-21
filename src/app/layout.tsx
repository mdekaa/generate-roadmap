import '../app/globals.css';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>AI Course Generator</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
