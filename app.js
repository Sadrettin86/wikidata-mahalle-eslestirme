// Veri Deposu
let mahalleler = [];
let eslesmeler = [];
let iller = {};
let selectedIl = null;
let selectedIlce = null;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    buildTree();
    updateStats();
});

// Verileri yükle
async function loadData() {
    try {
        // TÜİK verilerini yükle
        const response = await fetch('data/tuik_mahalleler.json');
        mahalleler = await response.json();
        
        // Eşleşmeleri yükle
        try {
            const matchResponse = await fetch('data/eslesmeler.json');
            eslesmeler = await matchResponse.json();
            
            // Eşleşmeleri uygula
            eslesmeler.forEach(eslesme => {
                const mahalle = mahalleler.find(m => m.id === eslesme.id);
                if (mahalle) {
                    mahalle.qid = eslesme.qid;
                    mahalle.durum = 'eslesmis';
                }
            });
        } catch (e) {
            console.log('Eşleşme dosyası bulunamadı');
        }
        
        // İl/İlçe yapısını oluştur
        buildIlIlceStructure();
        
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        alert('Veriler yüklenemedi. Lütfen data/ klasörünün doğru olduğundan emin olun.');
    }
}

// İl/İlçe yapısını oluştur
function buildIlIlceStructure() {
    iller = {};
    
    mahalleler.forEach(m => {
        if (!iller[m.il]) {
            iller[m.il] = {};
        }
        if (!iller[m.il][m.ilce]) {
            iller[m.il][m.ilce] = [];
        }
        iller[m.il][m.ilce].push(m);
    });
}

// Ağaç yapısını oluştur
function buildTree() {
    const treeView = document.getElementById('treeView');
    const illerSorted = Object.keys(iller).sort();
    
    let html = '<ul class="tree">';
    
    illerSorted.forEach(il => {
        const ilceler = Object.keys(iller[il]);
        const totalMahalle = ilceler.reduce((sum, ilce) => sum + iller[il][ilce].length, 0);
        
        html += `
            <li class="tree-item">
                <div class="tree-label" onclick="toggleIl('${il}')">
                    <span class="tree-icon" id="icon-${il}">▶️</span>
                    <span>${il}</span>
                    <span class="tree-count">${totalMahalle}</span>
                </div>
                <ul class="tree-children" id="ilce-${il}" style="display: none;">
        `;
        
        ilceler.sort().forEach(ilce => {
            const mahalleCount = iller[il][ilce].length;
            html += `
                <li class="tree-item">
                    <div class="tree-label" onclick="selectIlce('${il}', '${ilce}')">
                        <span class="tree-icon">📁</span>
                        <span>${ilce}</span>
                        <span class="tree-count">${mahalleCount}</span>
                    </div>
                </li>
            `;
        });
        
        html += `
                </ul>
            </li>
        `;
    });
    
    html += '</ul>';
    treeView.innerHTML = html;
}

// İli aç/kapat
function toggleIl(il) {
    const ilceList = document.getElementById(`ilce-${il}`);
    const icon = document.getElementById(`icon-${il}`);
    
    if (ilceList.style.display === 'none') {
        ilceList.style.display = 'block';
        icon.textContent = '🔽';
    } else {
        ilceList.style.display = 'none';
        icon.textContent = '▶️';
    }
}

// İlçe seç
async function selectIlce(il, ilce) {
    selectedIl = il;
    selectedIlce = ilce;
    
    // Aktif seçimi güncelle
    document.querySelectorAll('.tree-label').forEach(el => el.classList.remove('active'));
    event.target.closest('.tree-label').classList.add('active');
    
    // Başlıkları güncelle
    document.getElementById('contentTitle').textContent = `${ilce} Mahalleleri`;
    document.getElementById('contentSubtitle').textContent = `${il} › ${ilce} › ${iller[il][ilce].length} mahalle`;
    document.getElementById('nextDistrictBtn').disabled = false;
    
    // Mahalleleri göster
    await showMahalleler();
}

// Mahalleleri göster
async function showMahalleler() {
    const container = document.getElementById('mahalleList');
    const mahalleler = iller[selectedIl][selectedIlce];
    
    container.innerHTML = '<div class="loading"><div class="spinner"></div>Yükleniyor...</div>';
    
    let html = '';
    
    for (const mahalle of mahalleler) {
        if (mahalle.durum === 'eslesmis') {
            html += createMatchedCard(mahalle);
        } else {
            html += await createMahalleCard(mahalle);
        }
    }
    
    container.innerHTML = html;
}

// Eşleştirilmiş kart
function createMatchedCard(mahalle) {
    return `
        <div class="mahalle-card matched">
            <div class="mahalle-header">
                <div>
                    <div class="mahalle-title">${mahalle.mahalle}</div>
                    <div class="mahalle-meta">
                        <span>${mahalle.il} › ${mahalle.ilce}</span>
                        <span>•</span>
                        <span>TÜİK: ${mahalle.id}</span>
                    </div>
                </div>
                <span class="mahalle-badge" style="background: #c6f6d5; color: #22543d;">✅ Eşleştirildi</span>
            </div>
            
            <div class="matched-info">
                <div class="matched-text">
                    <span>✅</span>
                    <span>Eşleştirildi:</span>
                    <a href="https://www.wikidata.org/wiki/${mahalle.qid}" class="matched-link" target="_blank">
                        ${mahalle.qid}
                    </a>
                </div>
                <button class="btn-undo" onclick="undoMatch('${mahalle.id}')">🔄 Geri Al</button>
            </div>
        </div>
    `;
}

// Mahalle kartı oluştur
async function createMahalleCard(mahalle) {
    const suggestions = await searchWikidata(mahalle);
    
    let suggestionsHtml = '';
    
    if (suggestions.length === 0) {
        suggestionsHtml = `
            <div class="no-suggestions">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                <div>Wikidata'da eşleşme bulunamadı</div>
                <div style="margin-top: 1rem; display: flex; gap: 0.75rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="window.open('https://www.wikidata.org/wiki/Special:NewItem', '_blank')">
                        ➕ Wikidata'da Oluştur
                    </button>
                    <button class="btn btn-secondary" onclick="window.open('https://www.wikidata.org/w/index.php?search=${encodeURIComponent(mahalle.mahalle + ' ' + mahalle.ilce)}', '_blank')">
                        🔍 Manuel Ara
                    </button>
                </div>
            </div>
        `;
    } else {
        suggestionsHtml = suggestions.map(s => createSuggestionItem(s, mahalle)).join('');
    }
    
    return `
        <div class="mahalle-card" id="card-${mahalle.id}">
            <div class="mahalle-header">
                <div>
                    <div class="mahalle-title">${mahalle.mahalle}</div>
                    <div class="mahalle-meta">
                        <span>${mahalle.il} › ${mahalle.ilce}</span>
                        <span>•</span>
                        <span>TÜİK: ${mahalle.id}</span>
                    </div>
                </div>
                <span class="mahalle-badge">Beklemede</span>
            </div>
            
            <div class="suggestions">
                <div class="suggestions-header">
                    🔍 Wikidata Önerileri ${suggestions.length > 0 ? `(${suggestions.length} sonuç)` : ''}
                </div>
                ${suggestionsHtml}
            </div>
        </div>
    `;
}

// Öneri öğesi oluştur
function createSuggestionItem(suggestion, mahalle) {
    const confidenceClass = 
        suggestion.confidence >= 90 ? 'high-confidence' :
        suggestion.confidence >= 60 ? 'medium-confidence' : 'low-confidence';
    
    const confidenceBadgeClass = 
        suggestion.confidence >= 90 ? 'confidence-high' :
        suggestion.confidence >= 60 ? 'confidence-medium' : 'confidence-low';
    
    const warnings = [];
    if (suggestion.ilMismatch) warnings.push('⚠️ Farklı il - dikkatli olun!');
    if (suggestion.typeMismatch) warnings.push('❌ Farklı varlık türü - uygun değil');
    
    return `
        <div class="suggestion-item ${confidenceClass}">
            <div class="suggestion-header">
                <span class="suggestion-qid">${suggestion.qid}</span>
                <span class="confidence-badge ${confidenceBadgeClass}">${suggestion.confidence}% Eşleşme</span>
            </div>
            
            <div class="suggestion-label">${suggestion.label || 'İsim bulunamadı'}</div>
            
            <div class="suggestion-meta">
                ${suggestion.p131Chain ? `
                    <div class="meta-row">
                        <span class="meta-icon">📍</span>
                        <span class="meta-label">P131:</span>
                        <span class="meta-value">${suggestion.p131Chain}</span>
                    </div>
                ` : ''}
                
                ${suggestion.wikipedia ? `
                    <div class="meta-row">
                        <span class="meta-icon">📖</span>
                        <span class="meta-label">Wiki:</span>
                        <span class="meta-value">
                            <a href="${suggestion.wikipedia}" target="_blank">
                                ${suggestion.wikipedia.replace('https://tr.wikipedia.org/wiki/', '')}
                            </a>
                        </span>
                    </div>
                ` : `
                    <div class="meta-row">
                        <span class="meta-icon">📖</span>
                        <span class="meta-label">Wiki:</span>
                        <span class="meta-value" style="color: #a0aec0;">Vikipedi sayfası yok</span>
                    </div>
                `}
                
                ${suggestion.instanceOf ? `
                    <div class="meta-row">
                        <span class="meta-icon">ℹ️</span>
                        <span class="meta-label">Tür:</span>
                        <span class="meta-value">${suggestion.instanceOf}</span>
                    </div>
                ` : ''}
                
                ${warnings.map(w => `
                    <div class="meta-row">
                        <span class="meta-icon"></span>
                        <span class="meta-label"></span>
                        <span class="meta-value" style="color: ${w.includes('⚠️') ? '#d69e2e' : '#e53e3e'}; font-weight: 600;">${w}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="suggestion-actions">
                <button class="btn-match" onclick="matchMahalle('${mahalle.id}', '${suggestion.qid}', '${suggestion.label}')" ${suggestion.confidence < 50 ? 'style="background: #ecc94b; color: #744210;"' : ''}>
                    ${suggestion.confidence >= 50 ? '✅ Eşleştir' : '⚠️ Yine de Eşleştir'}
                </button>
                <button class="btn-view" onclick="window.open('https://www.wikidata.org/wiki/${suggestion.qid}', '_blank')">
                    👁️ Wikidata'da Gör
                </button>
            </div>
        </div>
    `;
}

// Wikidata'da ara
async function searchWikidata(mahalle) {
    try {
        // Mahalle adını temizle
        const mahalleName = mahalle.mahalle.replace(' Mah.', '').replace(' Mahallesi', '');
        const searchQuery = `${mahalleName}, ${mahalle.ilce}`;
        
        // Wikidata API'de ara
        const response = await fetch(
            `https://www.wikidata.org/w/api.php?` +
            `action=wbsearchentities&` +
            `search=${encodeURIComponent(searchQuery)}&` +
            `language=tr&` +
            `limit=5&` +
            `format=json&` +
            `origin=*`
        );
        
        const data = await response.json();
        
        if (!data.search || data.search.length === 0) {
            return [];
        }
        
        // Her öneri için detaylı bilgi al
        const suggestions = [];
        for (const item of data.search) {
            const details = await getWikidataDetails(item.id, mahalle);
            if (details) {
                suggestions.push(details);
            }
        }
        
        // Güven skoruna göre sırala
        suggestions.sort((a, b) => b.confidence - a.confidence);
        
        return suggestions;
        
    } catch (error) {
        console.error('Wikidata arama hatası:', error);
        return [];
    }
}

// Wikidata detaylarını al
async function getWikidataDetails(qid, mahalle) {
    try {
        const response = await fetch(
            `https://www.wikidata.org/w/api.php?` +
            `action=wbgetentities&` +
            `ids=${qid}&` +
            `props=labels|descriptions|claims|sitelinks&` +
            `languages=tr&` +
            `sitefilter=trwiki&` +
            `format=json&` +
            `origin=*`
        );
        
        const data = await response.json();
        const entity = data.entities[qid];
        
        if (!entity) return null;
        
        // P131 (located in) bilgisini al
        const p131Data = await extractP131Chain(entity.claims);
        
        // P31 (instance of) bilgisini al
        const instanceOf = extractInstanceOf(entity.claims);
        
        // Güven skorunu hesapla
        const confidence = calculateConfidence(entity, mahalle, p131Data, instanceOf);
        
        return {
            qid: qid,
            label: entity.labels?.tr?.value || entity.labels?.en?.value || 'İsim bulunamadı',
            description: entity.descriptions?.tr?.value || '',
            p131Chain: p131Data.chain,
            wikipedia: entity.sitelinks?.trwiki 
                ? `https://tr.wikipedia.org/wiki/${entity.sitelinks.trwiki.title}`
                : null,
            instanceOf: instanceOf,
            confidence: confidence,
            ilMismatch: p131Data.ilMismatch,
            typeMismatch: !instanceOf.includes('mahalle') && !instanceOf.includes('köy')
        };
        
    } catch (error) {
        console.error('Detay alma hatası:', error);
        return null;
    }
}

// P131 zincirini çıkar
async function extractP131Chain(claims) {
    if (!claims || !claims.P131 || claims.P131.length === 0) {
        return { chain: '', ilMismatch: true };
    }
    
    try {
        const p131Qid = claims.P131[0].mainsnak.datavalue.value.id;
        
        // P131'in labelını ve P131'ini al
        const response = await fetch(
            `https://www.wikidata.org/w/api.php?` +
            `action=wbgetentities&` +
            `ids=${p131Qid}&` +
            `props=labels|claims&` +
            `languages=tr&` +
            `format=json&` +
            `origin=*`
        );
        
        const data = await response.json();
        const entity = data.entities[p131Qid];
        
        if (!entity) return { chain: '', ilMismatch: true };
        
        const label1 = entity.labels?.tr?.value || p131Qid;
        let chain = `<a href="https://www.wikidata.org/wiki/${p131Qid}" target="_blank">${label1}</a>`;
        
        // İkinci seviye P131 varsa
        if (entity.claims && entity.claims.P131 && entity.claims.P131.length > 0) {
            const p131Qid2 = entity.claims.P131[0].mainsnak.datavalue.value.id;
            
            const response2 = await fetch(
                `https://www.wikidata.org/w/api.php?` +
                `action=wbgetentities&` +
                `ids=${p131Qid2}&` +
                `props=labels&` +
                `languages=tr&` +
                `format=json&` +
                `origin=*`
            );
            
            const data2 = await response2.json();
            const label2 = data2.entities[p131Qid2]?.labels?.tr?.value || p131Qid2;
            
            chain += ` → <a href="https://www.wikidata.org/wiki/${p131Qid2}" target="_blank">${label2}</a>`;
        }
        
        return { chain, ilMismatch: false };
        
    } catch (error) {
        console.error('P131 zinciri hatası:', error);
        return { chain: '', ilMismatch: true };
    }
}

// Instance of çıkar
function extractInstanceOf(claims) {
    if (!claims || !claims.P31 || claims.P31.length === 0) {
        return '';
    }
    
    const instanceQid = claims.P31[0].mainsnak.datavalue.value.id;
    
    const instanceTypes = {
        'Q3957': 'mahalle',
        'Q532': 'köy',
        'Q15303838': 'kasaba',
        'Q4022': 'nehir',
        'Q23413': 'kale'
    };
    
    return instanceTypes[instanceQid] || `(${instanceQid})`;
}

// Güven skorunu hesapla
function calculateConfidence(entity, mahalle, p131Data, instanceOf) {
    let score = 0;
    
    // Label eşleşmesi (40 puan)
    const label = entity.labels?.tr?.value || '';
    const mahalleName = mahalle.mahalle.replace(' Mah.', '').replace(' Mahallesi', '');
    if (label.toLowerCase().includes(mahalleName.toLowerCase())) {
        score += 40;
    }
    
    // P131 eşleşmesi (30 puan)
    if (p131Data.chain && p131Data.chain.includes(mahalle.ilce)) {
        score += 30;
    }
    
    // Vikipedi varlığı (15 puan)
    if (entity.sitelinks?.trwiki) {
        score += 15;
    }
    
    // Instance of uygunluğu (15 puan)
    if (instanceOf.includes('mahalle') || instanceOf.includes('köy')) {
        score += 15;
    }
    
    return Math.min(100, score);
}

// Mahalle eşleştir
async function matchMahalle(mahalleId, qid, label) {
    const mahalle = mahalleler.find(m => m.id === mahalleId);
    if (!mahalle) return;
    
    mahalle.qid = qid;
    mahalle.durum = 'eslesmis';
    
    // Eşleşmelere ekle
    eslesmeler.push({
        id: mahalleId,
        qid: qid,
        label: label,
        tarih: new Date().toISOString()
    });
    
    // localStorage'a kaydet
    localStorage.setItem('eslesmeler', JSON.stringify(eslesmeler));
    
    // İstatistikleri güncelle
    updateStats();
    
    // Kartı güncelle
    const card = document.getElementById(`card-${mahalleId}`);
    if (card) {
        card.outerHTML = createMatchedCard(mahalle);
    }
    
    // Bildirim göster
    showNotification(`✅ ${mahalle.mahalle} → ${qid} eşleştirildi!`);
}

// Eşleştirmeyi geri al
function undoMatch(mahalleId) {
    const mahalle = mahalleler.find(m => m.id === mahalleId);
    if (!mahalle) return;
    
    mahalle.qid = null;
    mahalle.durum = 'beklemede';
    
    // Eşleşmelerden çıkar
    eslesmeler = eslesmeler.filter(e => e.id !== mahalleId);
    localStorage.setItem('eslesmeler', JSON.stringify(eslesmeler));
    
    // İstatistikleri güncelle
    updateStats();
    
    // Sayfayı yenile
    showMahalleler();
    
    showNotification(`🔄 ${mahalle.mahalle} eşleşmesi geri alındı`);
}

// İstatistikleri güncelle
function updateStats() {
    const total = mahalleler.length;
    const matched = mahalleler.filter(m => m.durum === 'eslesmis').length;
    const remaining = total - matched;
    const progress = ((matched / total) * 100).toFixed(1);
    
    document.getElementById('totalCount').textContent = total.toLocaleString('tr-TR');
    document.getElementById('matchedCount').textContent = matched.toLocaleString('tr-TR');
    document.getElementById('remainingCount').textContent = remaining.toLocaleString('tr-TR');
    document.getElementById('progressPercent').textContent = progress + '%';
}

// Sonraki ilçe
function nextDistrict() {
    const ilceler = Object.keys(iller[selectedIl]).sort();
    const currentIndex = ilceler.indexOf(selectedIlce);
    
    if (currentIndex < ilceler.length - 1) {
        selectIlce(selectedIl, ilceler[currentIndex + 1]);
    } else {
        alert('Bu ilin son ilçesisiniz!');
    }
}

// Veriyi export et
function exportData() {
    const dataStr = JSON.stringify(eslesmeler, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eslesmeler-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification(`💾 ${eslesmeler.length} eşleşme export edildi!`);
}

// Bildirim göster
function showNotification(message) {
    // Basit alert - ileride toast notification yapılabilir
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Filtreleri göster
function showFilters() {
    alert('Filtre özelliği yakında eklenecek!');
}

// localStorage'dan eşleşmeleri yükle
window.addEventListener('DOMContentLoaded', () => {
    const savedMatches = localStorage.getItem('eslesmeler');
    if (savedMatches) {
        eslesmeler = JSON.parse(savedMatches);
    }
});

// Animasyonlar
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
