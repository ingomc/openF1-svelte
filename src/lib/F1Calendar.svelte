<script lang="ts">
  import { onMount } from 'svelte';
  import { ergastService } from './ergast-service';
  import ErgastRaceCard from './ErgastRaceCard.svelte';
  import type { ProcessedRace } from './ergast-service';
  
  let races: ProcessedRace[] = [];
  let loading = true;
  let error: string | null = null;
  let selectedYear = 2025; // Start mit 2025 da wir bereits in 2025 sind
  
  async function loadRaces() {
    try {
      loading = true;
      error = null;
      races = await ergastService.getRaces(selectedYear);
      
      // Debug: Zeige die Anzahl der kommenden und vergangenen Rennen
      const upcoming = races.filter(r => r.isUpcoming);
      const past = races.filter(r => !r.isUpcoming);
      console.log(`Total races: ${races.length}`);
      console.log(`Upcoming races: ${upcoming.length}, Past races: ${past.length}`);
      console.log('Races:', races.map(r => ({ name: r.raceName, date: r.date, isUpcoming: r.isUpcoming })));
      
      if (races.length === 0) {
        error = `Keine Daten für ${selectedYear} verfügbar.`;
      }
    } catch (err: any) {
      error = 'Fehler beim Laden der Renndaten. Bitte versuchen Sie es später erneut.';
      console.error('Error loading races:', err);
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    loadRaces();
  });
  
  $: nextRace = races.find(r => r.isUpcoming);
  $: upcomingRaces = races.filter(r => r.isUpcoming);
  $: pastRaces = races.filter(r => !r.isUpcoming);
  
  function handleYearChange() {
    loadRaces();
  }
</script>

<div class="f1-calendar">
  <header class="calendar-header">
    <h1>🏎️ Formula 1 Kalender</h1>
    <div class="year-selector">
      <label for="year-select">Jahr:</label>
      <select 
        id="year-select" 
        bind:value={selectedYear} 
        on:change={handleYearChange}
      >
        {#each [2023, 2024, 2025] as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
    </div>
  </header>
  
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Lade Renndaten...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
      <button on:click={loadRaces} class="retry-button">
        Erneut versuchen
      </button>
    </div>
  {:else}
    <div class="races-container">
      {#if nextRace}
        <section class="upcoming-section">
          <h2>Nächstes Rennen</h2>
          <ErgastRaceCard race={nextRace} isExpanded={true} totalRaces={races.length} />
        </section>
      {/if}
      
      {#if upcomingRaces.length > 1}
        <section class="future-races-section">
          <h2>Kommende Rennen {selectedYear}</h2>
          <div class="races-grid">
            {#each upcomingRaces.slice(1) as race}
              <ErgastRaceCard {race} isExpanded={false} totalRaces={races.length} />
            {/each}
          </div>
        </section>
      {/if}
      
      {#if pastRaces.length > 0}
        <section class="past-races-section">
          <h2>Vergangene Rennen {selectedYear}</h2>
          <div class="races-grid">
            {#each pastRaces as race}
              <ErgastRaceCard {race} isExpanded={false} totalRaces={races.length} />
            {/each}
          </div>
        </section>
      {/if}
      
      {#if races.length === 0}
        <div class="no-data">
          <p>Keine Renndaten für {selectedYear} verfügbar.</p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .f1-calendar {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .calendar-header h1 {
    margin: 0;
    color: #333;
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  .year-selector {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .year-selector label {
    font-weight: 600;
    color: #666;
  }
  
  .year-selector select {
    padding: 8px 16px;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: white;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  
  .year-selector select:focus {
    outline: none;
    border-color: #ff3e00;
  }
  
  .loading, .error, .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ff3e00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading p, .error p, .no-data p {
    margin: 0;
    color: #666;
    font-size: 1.1rem;
  }
  
  .retry-button {
    margin-top: 16px;
    padding: 12px 24px;
    background: #ff3e00;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .retry-button:hover {
    background: #e63500;
  }
  
  .upcoming-section {
    margin-bottom: 48px;
  }
  
  .future-races-section {
    margin-bottom: 48px;
  }
  
  .past-races-section {
    margin-bottom: 24px;
  }
  
  .upcoming-section h2,
  .future-races-section h2,
  .past-races-section h2 {
    margin: 0 0 24px 0;
    color: #333;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .future-races-section h2 {
    background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%);
    border-left: 4px solid #4CAF50;
  }
  
  .past-races-section h2 {
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
    border-left: 4px solid #757575;
  }
  
  .races-grid {
    display: grid;
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    .f1-calendar {
      padding: 16px;
    }
    
    .calendar-header {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
    
    .calendar-header h1 {
      font-size: 2rem;
    }
    
    .year-selector {
      justify-content: center;
    }
  }
</style>
