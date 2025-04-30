export default defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:3000'
      }
    },
    define: {
      'process.env': process.env
    }
  });
  