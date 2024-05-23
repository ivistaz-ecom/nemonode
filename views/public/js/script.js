if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/views/public/service-worker.js').then(registration => {
        console.log('Servers Active ', registration.scope);
      }, error => {
        console.log('Servers not Active: ', error);
      });
    });
  }
  