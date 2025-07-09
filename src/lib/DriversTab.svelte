<script lang="ts">
  import { getDriverFlag, formatBirthDate, calculateAge } from './utils';
  import { getDriverImageUrl, getDriverAvatarUrl, getImageWithMultipleFallbacks, getWikipediaImage } from './f1-images';
  
  export let drivers: any[] = [];
  export let selectedYear: number;
  
  let searchTerm = '';
  let imageCache = new Map<string, string>();
  
  $: filteredDrivers = drivers.filter(driver => 
    driver.givenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Function to get driver image with enhanced multi-tier fallback system
  async function getDriverImage(driverId: string, givenName: string, familyName: string, nationality?: string): Promise<string> {
    const cacheKey = `${driverId}-${givenName}-${familyName}`;
    
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!;
    }
    
    // Tier 1: Official F1 API
    const primaryUrl = getDriverImageUrl(driverId, givenName, familyName);
    
    // Tier 2: Wikipedia/Wikimedia Commons
    const secondaryUrl = getWikipediaImage(driverId, familyName);
    
    // Tier 3: Generated avatar with initials
    const tertiaryUrl = getDriverAvatarUrl(driverId, givenName, familyName, nationality);
    
    // Tier 4: Ultimate fallback - static placeholder
    const ultimateUrl = getDriverImageUrl('fallback', givenName, familyName);
    
    try {
      const finalUrl = await getImageWithMultipleFallbacks(
        primaryUrl, 
        secondaryUrl || tertiaryUrl, 
        tertiaryUrl, 
        ultimateUrl
      );
      imageCache.set(cacheKey, finalUrl);
      return finalUrl;
    } catch {
      // Fallback to generated avatar in case of complete failure
      const avatarUrl = getDriverAvatarUrl(driverId, givenName, familyName, nationality);
      imageCache.set(cacheKey, avatarUrl);
      return avatarUrl;
    }
  }
</script>

<div class="drivers-tab">
  <div class="tab-header">
    <h2>🏎️ Fahrer {selectedYear}</h2>
    <div class="search-box">
      <input 
        type="text" 
        placeholder="Fahrer suchen..." 
        bind:value={searchTerm}
        class="search-input"
      />
      <span class="search-icon">🔍</span>
    </div>
  </div>
  
  <div class="drivers-content">
    {#if filteredDrivers.length > 0}
      <div class="drivers-grid">
        {#each filteredDrivers as driver}
          <div class="driver-card">
            <div class="driver-image">
              {#await getDriverImage(driver.driverId, driver.givenName, driver.familyName, driver.nationality)}
                <div class="image-loading">
                  <div class="loading-spinner"></div>
                </div>
              {:then imageUrl}
                <img 
                  src={imageUrl} 
                  alt="{driver.givenName} {driver.familyName}"
                  class="driver-photo"
                  loading="lazy"
                  on:error={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target) {
                      // Use generated avatar as ultimate fallback for image errors
                      target.src = getDriverAvatarUrl(driver.driverId, driver.givenName, driver.familyName, driver.nationality);
                    }
                  }}
                />
              {:catch}
                <div class="image-fallback">
                  <img 
                    src={getDriverAvatarUrl(driver.driverId, driver.givenName, driver.familyName, driver.nationality)}
                    alt="{driver.givenName} {driver.familyName}"
                    class="driver-photo"
                    loading="lazy"
                  />
                </div>
              {/await}
              <div class="driver-number-overlay">#{driver.permanentNumber || driver.code || '?'}</div>
            </div>
            
            <div class="driver-header">
              <div class="driver-flag">{getDriverFlag(driver.nationality)}</div>
              <div class="driver-info">
                <h3 class="driver-name">{driver.givenName} {driver.familyName}</h3>
                <p class="driver-nationality">{driver.nationality}</p>
              </div>
            </div>
            
            <div class="driver-details">
              <div class="detail-item">
                <span class="detail-label">Geboren:</span>
                <span class="detail-value">
                  {formatBirthDate(driver.dateOfBirth)}
                  {#if driver.dateOfBirth}
                    ({calculateAge(driver.dateOfBirth)} Jahre)
                  {/if}
                </span>
              </div>
              
              {#if driver.code}
                <div class="detail-item">
                  <span class="detail-label">Code:</span>
                  <span class="detail-value driver-code">{driver.code}</span>
                </div>
              {/if}
              
              {#if driver.url}
                <div class="detail-item">
                  <a href={driver.url} target="_blank" rel="noopener noreferrer" class="wiki-link">
                    📖 Wikipedia
                  </a>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else if searchTerm}
      <div class="no-results">
        <p>Keine Fahrer gefunden für "{searchTerm}"</p>
      </div>
    {:else}
      <div class="no-data">
        <p>Keine Fahrerdaten für {selectedYear} verfügbar</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .drivers-tab {
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
  
  .drivers-content {
    padding: 32px 24px;
  }
  
  .drivers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }
  
  .driver-card {
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
  
  .driver-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .driver-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  
  .driver-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 0.3s ease;
  }
  
  .driver-card:hover .driver-photo {
    transform: scale(1.05);
  }
  
  .driver-number-overlay {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.9rem;
    backdrop-filter: blur(4px);
  }
  
  .driver-header {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #dee2e6;
  }
  
  .driver-flag {
    font-size: 2rem;
    margin-right: 16px;
  }
  
  .driver-info {
    flex: 1;
  }
  
  .driver-name {
    margin: 0 0 4px 0;
    color: #333;
    font-size: 1.3rem;
    font-weight: 700;
  }
  
  .driver-nationality {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .driver-details {
    padding: 20px;
    flex: 1;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .detail-item:last-child {
    margin-bottom: 0;
  }
  
  .detail-label {
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
  }
  
  .detail-value {
    font-weight: 500;
    color: #333;
  }
  
  .driver-code {
    background: #f8f9fa;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: 700;
  }
  
  .wiki-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }
  
  .wiki-link:hover {
    color: #0056b3;
    text-decoration: underline;
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
  
  /* Image loading and fallback states */
  .image-loading,
  .image-fallback {
    width: 100%;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    color: #6c757d;
  }
  
  .image-fallback {
    height: 200px;
    background: transparent;
  }
  
  .image-fallback .driver-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  
  @media (max-width: 768px) {
    .tab-header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-box {
      min-width: unset;
    }
    
    .drivers-grid {
      grid-template-columns: 1fr;
    }
    
    .drivers-content {
      padding: 16px;
    }
    
    .driver-header {
      padding: 16px;
    }
    
    .driver-details {
      padding: 16px;
    }
  }
  
  /* Large screens optimization */
  @media (min-width: 1400px) {
    .drivers-grid {
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 28px;
    }
    
    .tab-header {
      padding: 32px;
    }
    
    .drivers-content {
      padding: 32px;
    }
  }
  
  @media (min-width: 1800px) {
    .drivers-grid {
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
      gap: 32px;
    }
  }
</style>
