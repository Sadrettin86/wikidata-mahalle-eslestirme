# 🚀 Wikidata Mahalle Eşleştirme - Kullanım Kılavuzu

## 📦 Dosyalar

Projenizde şu dosyalar var:

### ✅ Kullanılacak Dosyalar (YENİ VERSİYON):
- **`index-v2.html`** - Ana sayfa (kullan)
- **`app-v2.js`** - Ana uygulama (kullan)
- **`data/tuik_mahalleler.json`** - TÜİK verileri (32,227 mahalle)
- **`data/eslesmeler.json`** - Eşleşmeler (başlangıçta boş)

### 📄 Ek Dosyalar:
- `ornek-arayuz.html` - Statik örnek (test için)
- `KURULUM.md` - GitHub kurulum talimatları
- `README.md` - Proje açıklaması

### ⚠️ Eski Dosyalar (Kullanma):
- `index.html` + `app.js` (eski GitHub Issues tabanlı versiyon)

## 🎯 Hızlı Başlangıç

### 1. Dosyaları Hazırla

```bash
# Bir klasör oluştur
mkdir wikidata-mahalle
cd wikidata-mahalle

# İndirdiğin dosyaları kopyala
# - index-v2.html
# - app-v2.js
# - data/ klasörü (içinde tuik_mahalleler.json ve eslesmeler.json)
```

### 2. Lokal Sunucu Başlat

**Seçenek A: Python (Önerilen)**
```bash
# Python 3 ile
python3 -m http.server 8000

# Tarayıcıda aç:
# http://localhost:8000/index-v2.html
```

**Seçenek B: Node.js**
```bash
npx http-server -p 8000

# Tarayıcıda aç:
# http://localhost:8000/index-v2.html
```

**Seçenek C: VS Code**
- Live Server eklentisini kur
- index-v2.html'e sağ tık → "Open with Live Server"

### 3. Kullanmaya Başla! 🎉

1. **Sol panelden** bir il seç (örn: İstanbul)
2. İl açıldığında **bir ilçe seç** (örn: Esenler)
3. Sağ panelde **mahalleler ve Wikidata önerileri** görünür
4. **Yeşil önerilere tıkla** → "✅ Eşleştir" butonuna bas
5. Eşleştirme tamamlandı! ✨

## 🎨 Arayüz Açıklaması

### Sol Panel: İl/İlçe Ağacı
- **▶️ İl adı**: Tıkla, ilçeleri göster
- **🔽 İl adı**: Tıkla, ilçeleri gizle
- **📁 İlçe adı**: Tıkla, mahalleleri göster
- **Sayılar**: Her il/ilçedeki mahalle sayısı

### Sağ Panel: Mahalle Kartları

#### Bekleyen Mahalle:
```
⭕ Mahalle Adı
   İl › İlçe • TÜİK: 12345

   🔍 Wikidata Önerileri (3 sonuç)
   
   ✅ Q123456  [98% Eşleşme]
      Mahalle Adı
      📍 P131: İlçe → İl
      📖 tr.wikipedia.org/wiki/...
      ℹ️  Tür: mahalle
      [✅ Eşleştir] [👁️ Wikidata'da Gör]
```

#### Eşleşmiş Mahalle:
```
✅ Mahalle Adı
   İl › İlçe • TÜİK: 12345
   
   ✅ Eşleştirildi: Q123456
   [🔄 Geri Al]
```

## 🎯 Güven Skorları

Öneriler otomatik skorlanır:

- **🟢 90-100% (Yeşil)**: Çok güvenilir - hemen eşleştir
- **🟡 60-89% (Sarı)**: Dikkatli - kontrol et
- **🔴 0-59% (Kırmızı)**: Düşük güven - muhtemelen yanlış

### Skor Hesaplaması:
- ✅ Mahalle adı eşleşiyor: +40 puan
- ✅ P131 (ilçe) eşleşiyor: +30 puan
- ✅ Türkçe Vikipedi var: +15 puan
- ✅ Doğru tür (mahalle/köy): +15 puan

## 💾 Veri Yönetimi

### Eşleşmeler Nerede Saklanır?

1. **localStorage**: Tarayıcıda otomatik kaydedilir
2. **Export**: "💾 Export JSON" butonu ile indir

### Export Edilen Veri Formatı:

```json
[
  {
    "id": "176887",
    "qid": "Q123456",
    "label": "Akören Mahallesi",
    "tarih": "2025-12-13T21:45:00.000Z"
  }
]
```

### Veriyi Yedekle:

```bash
# Düzenli olarak export et
# index-v2.html'de "💾 Export JSON" → eslesmeler-2025-12-13.json
```

## 🔄 İş Akışı Önerileri

### Yaklaşım 1: İlçe Bazında
1. Bir ilçe seç (örn: Esenler - 12 mahalle)
2. Tüm mahalleleri eşleştir
3. "⏭️ Sonraki İlçe" → Devam et

### Yaklaşım 2: Kolay Olanlardan Başla
1. Küçük ilçeleri seç (5-20 mahalle)
2. %98+ skorlu eşleşmeleri yap
3. Belirsizleri sonraya bırak

### Yaklaşım 3: Hızlı Tarama
1. Tek önerisi olanları bul
2. Yüksek skorluysa hemen eşleştir
3. Çoklu önerileri detaylı incele

## ⚠️ Dikkat Edilmesi Gerekenler

### ❌ Eşleştirme YAPMA:
- Farklı il/ilçedeki yerler
- "nehir", "kale" gibi farklı türler
- %50'nin altındaki düşük skorlar (dikkatli kontrol et)

### ✅ Eşleştirme YAP:
- %90+ skor
- P131 zinciri doğru (Mahalle → İlçe → İl)
- Vikipedi sayfası var ve doğru

### 🤔 Belirsiz Durumlar:
1. Wikidata'da maddeyi aç (👁️ butonu)
2. P131 ve P17 değerlerini kontrol et
3. Vikipedi sayfasını oku
4. Emin değilsen eşleştirme

## 🐛 Sorun Giderme

### "Veriler yüklenmiyor"
- `data/tuik_mahalleler.json` dosyasının varlığını kontrol et
- Tarayıcı konsolunu aç (F12) ve hataları oku
- HTTP sunucu ile çalıştırdığından emin ol (file:// ile çalışmaz)

### "Wikidata önerileri gelmiyor"
- İnternet bağlantını kontrol et
- Tarayıcı konsolunda CORS hatası varsa, HTTP sunucu kullan
- Birkaç saniye bekle (API yavaş olabilir)

### "Eşleştirmeler kaydolmuyor"
- localStorage açık mı kontrol et
- Gizli mod kullanıyorsan, normal modda aç
- Düzenli export yaparak yedekle

## 📊 İstatistikler

Üst başlıkta anlık istatistikler:
- **📊 Toplam**: Tüm mahalleler (32,227)
- **✅ Eşleşti**: Tamamlanan eşleştirmeler
- **⏳ Kalan**: Bekleyen mahalleler
- **📈 İlerleme**: Yüzde olarak

## 🎯 Hedefler

**Kısa Vadeli:**
- İlk 100 eşleştirme ✨
- Bir ili tamamen bitir 🏆

**Orta Vadeli:**
- 1,000 eşleştirme 🎉
- En az 10 il tamam 🌟

**Uzun Vadeli:**
- Tüm 32,227 mahalle! 🚀🚀🚀

## 💡 İpuçları

1. **Klavye Kısayolları**: Planlanıyor
2. **Toplu Onaylama**: Geliştirilecek
3. **Filtreleme**: Eklenecek
4. **Arama**: İyileştirilecek

## 📞 Yardım

Sorun mu yaşıyorsun?

1. Tarayıcı konsolunu kontrol et (F12)
2. Dosya yapısını doğrula
3. HTTP sunucu kullandığından emin ol
4. localhost:8000/index-v2.html adresini kullan

---

**Başarılar! Türkiye'nin açık veri altyapısına katkı için teşekkürler! 🇹🇷🗺️✨**
