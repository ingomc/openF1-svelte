<script lang="ts">
  import { getCircuitImageUrl, getImageWithFallback } from './f1-images';
  
  export let circuits: any[] = [];
  export let selectedYear: number;
  
  let searchTerm = '';
  let imageCache = new Map<string, string>();
  
  $: filteredCircuits = circuits.filter(circuit => 
    circuit.circuitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circuit.Location.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circuit.Location.country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Function to get circuit image with caching and fallback
  async function getCircuitImage(circuitId: string, circuitName: string): Promise<string> {
    const cacheKey = `${circuitId}-${circuitName}`;
    
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!;
    }
    
    const primaryUrl = getCircuitImageUrl(circuitId, circuitName);
    const fallbackUrl = getCircuitImageUrl('default', circuitName);
    
    try {
      const finalUrl = await getImageWithFallback(primaryUrl, fallbackUrl);
      imageCache.set(cacheKey, finalUrl);
      return finalUrl;
    } catch {
      const defaultUrl = getCircuitImageUrl('fallback', circuitName);
      imageCache.set(cacheKey, defaultUrl);
      return defaultUrl;
    }
  }
  
  function getCountryFlag(country: string): string {
    const flags: Record<string, string> = {
      'Netherlands': '🇳🇱',
      'Monaco': '🇲🇨',
      'UK': '🇬🇧',
      'Spain': '🇪🇸',
      'Mexico': '🇲🇽',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Japan': '🇯🇵',
      'Singapore': '🇸🇬',
      'Italy': '🇮🇹',
      'Belgium': '🇧🇪',
      'Hungary': '🇭🇺',
      'Austria': '🇦🇹',
      'Azerbaijan': '🇦🇿',
      'Bahrain': '🇧🇭',
      'Saudi Arabia': '🇸🇦',
      'UAE': '🇦🇪',
      'Brazil': '🇧🇷',
      'USA': '🇺🇸',
      'Qatar': '🇶🇦',
      'Las Vegas': '🇺🇸'
    };
    return flags[country] || '🏁';
  }
  
  function getCircuitType(circuitName: string): string {
    if (circuitName.toLowerCase().includes('street') || 
        circuitName.toLowerCase().includes('monaco') ||
        circuitName.toLowerCase().includes('singapore') ||
        circuitName.toLowerCase().includes('baku') ||
        circuitName.toLowerCase().includes('jeddah') ||
        circuitName.toLowerCase().includes('vegas')) {
      return '🏙️ Stadtkurs';
    }
    return '🏁 Rennstrecke';
  }
</script>

<div class="circuits-tab">
  <div class="tab-header">
    <h2>🏁 Rennstrecken {selectedYear}</h2>
    <div class="search-box">
      <input 
        type="text" 
        placeholder="Strecke suchen..." 
        bind:value={searchTerm}
        class="search-input"
      />
      <span class="search-icon">🔍</span>
    </div>
  </div>
  
  <div class="circuits-content">
    {#if filteredCircuits.length > 0}
      <div class="circuits-grid">
        {#each filteredCircuits as circuit}
          <div class="circuit-card">
            <div class="circuit-image">
              {#await getCircuitImage(circuit.circuitId, circuit.circuitName)}
                <div class="image-loading">
                  <div class="loading-spinner"></div>
                </div>
              {:then imageUrl}
                <img 
                  src={imageUrl} 
                  alt="{circuit.circuitName} track map"
                  class="circuit-photo"
                  loading="lazy"
                  on:error={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target) {
                      target.src = getCircuitImageUrl('fallback', circuit.circuitName);
                    }
                  }}
                />
              {:catch}
                <div class="image-error">
                  <span class="error-icon">🏁</span>
                  <span class="error-text">Streckenbild nicht verfügbar</span>
                </div>
              {/await}
              <div class="circuit-type-overlay">{getCircuitType(circuit.circuitName)}</div>
            </div>
            
            <div class="circuit-header">
              <div class="circuit-flag">{getCountryFlag(circuit.Location.country)}</div>
              <div class="circuit-info">
                <h3 class="circuit-name">{circuit.circuitName}</h3>
                <p class="circuit-location">{circuit.Location.locality}, {circuit.Location.country}</p>
              </div>
            </div>
            
            <div class="circuit-details">
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">🏆 Name:</span>
                  <span class="detail-value">{circuit.circuitName}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">📍 Ort:</span>
                  <span class="detail-value">{circuit.Location.locality}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">🌍 Land:</span>
                  <span class="detail-value">{circuit.Location.country}</span>
                </div>
                
                {#if circuit.Location.lat && circuit.Location.long}
                  <div class="detail-item coordinates">
                    <span class="detail-label">🗺️ Koordinaten:</span>
                    <span class="detail-value">
                      {parseFloat(circuit.Location.lat).toFixed(4)}°, {parseFloat(circuit.Location.long).toFixed(4)}°
                    </span>
                  </div>
                {/if}
              </div>
              
              {#if circuit.url}
                <div class="circuit-links">
                  <a href={circuit.url} target="_blank" rel="noopener noreferrer" class="wiki-link">
                    📖 Wikipedia
                  </a>
                  {#if circuit.Location.lat && circuit.Location.long}
                    <a 
                      href="https://www.google.com/maps?q={circuit.Location.lat},{circuit.Location.long}" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="maps-link"
                    >
                      🗺️ Karte
                    </a>
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else if searchTerm}
      <div class="no-results">
        <p>Keine Strecken gefunden für "{searchTerm}"</p>
      </div>
    {:else}
      <div class="no-data">
        <p>Keine Streckendaten für {selectedYear} verfügbar</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .circuits-tab {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .tab-header {
    padding: 24px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .tab-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .search-box {
    position: relative;
    min-width: 250px;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 2px solid #ddd;
    border-radius: 25px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #ff3e00;
  }
  
  .search-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
  
  .circuits-content {
    padding: 32px 24px;
  }
  
  .circuits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    gap: 24px;
  }
  
  .circuit-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .circuit-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .circuit-image {
    position: relative;
    width: 100%;
    height: 250px;
    overflow: hidden;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  
  .circuit-photo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    transition: transform 0.3s ease;
    background: white;
  }
  
  .circuit-card:hover .circuit-photo {
    transform: scale(1.05);
  }
  
  .circuit-type-overlay {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.8rem;
    backdrop-filter: blur(4px);
  }
  
  .circuit-header {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #dee2e6;
  }
  
  .circuit-flag {
    font-size: 2rem;
    margin-right: 16px;
  }
  
  .circuit-info {
    flex: 1;
  }
  
  .circuit-name {
    margin: 0 0 4px 0;
    color: #333;
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.2;
  }
  
  .circuit-location {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .circuit-details {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .detail-grid {
    display: grid;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }
  
  .detail-item.coordinates {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-label {
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
    min-width: 100px;
  }
  
  .detail-value {
    font-weight: 500;
    color: #333;
    text-align: right;
    flex: 1;
  }
  
  .coordinates .detail-value {
    text-align: left;
    font-family: monospace;
    font-size: 0.85rem;
    background: #f8f9fa;
    padding: 4px 8px;
    border-radius: 4px;
    margin-top: 4px;
  }
  
  .circuit-links {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
  }
  
  .wiki-link,
  .maps-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 12px;
    border: 1px solid #007bff;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  
  .wiki-link:hover,
  .maps-link:hover {
    background: #007bff;
    color: white;
  }
  
  .maps-link {
    color: #28a745;
    border-color: #28a745;
  }
  
  .maps-link:hover {
    background: #28a745;
    color: white;
  }
  
  .no-results,
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px;
    color: #666;
    font-style: italic;
    text-align: center;
  }
  
  /* Image loading and error states */
  .image-loading,
  .image-error {
    width: 100%;
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    color: #6c757d;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #dee2e6;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-icon {
    font-size: 48px;
    margin-bottom: 8px;
    opacity: 0.5;
  }
  
  .error-text {
    font-size: 12px;
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    .tab-header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-box {
      min-width: unset;
    }
    
    .circuits-grid {
      grid-template-columns: 1fr;
    }
    
    .circuits-content {
      padding: 16px;
    }
    
    .circuit-header {
      padding: 16px;
    }
    
    .circuit-details {
      padding: 16px;
    }
    
    .circuit-links {
      flex-direction: column;
    }
    
    .detail-item {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .detail-value {
      text-align: left;
    }
  }
  
  /* Large screens optimization */
  @media (min-width: 1400px) {
    .circuits-grid {
      grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
      gap: 28px;
    }
    
    .tab-header {
      padding: 32px;
    }
    
    .circuits-content {
      padding: 32px;
    }
  }
  
  @media (min-width: 1800px) {
    .circuits-grid {
      grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
      gap: 32px;
    }
  }
</style>
