<script lang="ts">
  import F1Calendar from './lib/F1Calendar.svelte'
</script>

<main>
  <F1Calendar />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: block; /* Override app.css flex */
  }
  
  :global(#app) {
    max-width: none; /* Override app.css max-width */
    margin: 0;
    padding: 0;
    text-align: left; /* Override app.css center */
  }
  
  main {
    min-height: 100vh;
    width: 100%;
  }
</style>
