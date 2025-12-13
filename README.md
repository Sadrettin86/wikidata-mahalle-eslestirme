# 🗺️ Wikidata Mahalle Eşleştirme Projesi

> Türkiye'deki **32,227 mahalleyi** Wikidata ile eşleştiren interaktif web uygulaması

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Beta](https://img.shields.io/badge/Status-Beta-blue.svg)]()

## 🎯 Proje Hakkında

Bu proje, TÜİK'ten alınan Türkiye mahalleler listesini Wikidata'daki karşılıklarıyla eşleştirmeyi amaçlar. 

**Özellikler:**
- ✅ 32,227 mahalle verisi
- ✅ Otomatik Wikidata önerileri
- ✅ Akıllı güven skoru sistemi
- ✅ Tek tıkla eşleştirme
- ✅ İl/İlçe bazında hiyerarşik görünüm
- ✅ Türkçe Vikipedi entegrasyonu
- ✅ P131 (located in) zinciri gösterimi
- ✅ Tarayıcıda çalışır (backend gerektirmez)

## 🚀 Hızlı Başlangıç

### 1. Dosyaları İndir

```bash
git clone https://github.com/KULLANICI_ADI/wikidata-mahalle-eslestirme.git
cd wikidata-mahalle-eslestirme
```

### 2. HTTP Sunucu Başlat

```bash
python3 -m http.server 8000
```

### 3. Tarayıcıda Aç

```
http://localhost:8000/index-v2.html
```

**Hepsi bu kadar!** 🎉

## 📖 Kullanım

1. **Sol panelden** bir il ve ilçe seçin
2. **Sağ panelde** mahalleler ve Wikidata önerileri görünür
3. **Yeşil önerilere** tıklayıp "✅ Eşleştir" deyin
4. Eşleştirmeler otomatik kaydedilir
5. "💾 Export JSON" ile yedekleyin

Detaylı kullanım için: [KULLANIM.md](KULLANIM.md)

## 🎨 Ekran Görüntüleri

### Ana Arayüz
```
┌─────────────────────────────────────────────────────┐
│  🗺️ Wikidata Mahalle Eşleştirme                    │
│  📊 32,227 | ✅ 1,245 | ⏳ 30,982 | 📈 3.9%        │
└─────────────────────────────────────────────────────┘

┌─────────┬───────────────────────────────────────────┐
│ İller   │ Mahalleler & Wikidata Önerileri           │
│ ─────── │ ───────────────────────────────────────── │
│ 🔽 İst. │ ⭕ Atışalanı Mah.                         │
│  📁 Ese.│   ✅ Q25305471 [98%] Atışalanı Mahallesi │
│  📁 Kad.│      📍 Esenler → İstanbul                │
│ ▶️ Ank. │      📖 tr.wikipedia.org/...              │
│ ▶️ İzm. │      [✅ Eşleştir]                        │
└─────────┴───────────────────────────────────────────┘
```

## 📊 Veri Kaynağı

- **TÜİK**: Türkiye İstatistik Kurumu mahalleler listesi
- **Wikidata**: Açık bilgi tabanı
- **Wikipedia**: Türkçe ansiklopedi

## 🔧 Teknik Detaylar

### Teknolojiler
- Vanilla JavaScript (framework yok)
- Wikidata Query Service API
- localStorage (veri saklama)
- CSS Grid Layout

### API Kullanımı
```javascript
// Wikidata arama
https://www.wikidata.org/w/api.php?
  action=wbsearchentities&
  search=Mahalle, İlçe&
  language=tr

// Detay çekme
https://www.wikidata.org/w/api.php?
  action=wbgetentities&
  ids=Q123456&
  props=labels|claims|sitelinks
```

### Güven Skoru Algoritması

```javascript
Puan = 0
+ Mahalle adı eşleşiyor: +40
+ P131 ilçe eşleşiyor: +30
+ Vikipedi sayfası var: +15
+ Doğru tür (mahalle): +15
= Toplam: 0-100
```

**Sınıflandırma:**
- 🟢 90-100%: Yüksek güven
- 🟡 60-89%: Orta güven
- 🔴 0-59%: Düşük güven

## 📁 Dosya Yapısı

```
wikidata-mahalle-eslestirme/
├── index-v2.html          # Ana sayfa
├── app-v2.js             # Ana uygulama
├── data/
│   ├── tuik_mahalleler.json   # TÜİK verileri (32,227)
│   └── eslesmeler.json        # Eşleştirmeler
├── KULLANIM.md           # Kullanım kılavuzu
├── KURULUM.md            # GitHub kurulum
└── README.md             # Bu dosya
```

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📈 İlerleme

- [x] TÜİK verilerini import et
- [x] Wikidata API entegrasyonu
- [x] İl/İlçe ağaç yapısı
- [x] Otomatik öneri sistemi
- [x] Güven skoru algoritması
- [x] Tek tıkla eşleştirme
- [x] localStorage kaydı
- [x] Export/Import
- [ ] Toplu onaylama
- [ ] Klavye kısayolları
- [ ] Gelişmiş filtreleme
- [ ] GitHub Actions otomasyonu
- [ ] Çoklu kullanıcı desteği

## 🎯 Hedefler

- **Kısa Vade**: 1,000 eşleştirme
- **Orta Vade**: 10,000 eşleştirme
- **Uzun Vade**: Tüm 32,227 mahalle!

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 🙏 Teşekkürler

- **TÜİK** - Mahalle verileri için
- **Wikidata** - Açık veri platformu için
- **Wikimedia Türkiye** - Topluluk desteği için

## 📞 İletişim

- **Issues**: [GitHub Issues](https://github.com/KULLANICI_ADI/wikidata-mahalle-eslestirme/issues)
- **Twitter**: [@kullaniciadi](https://twitter.com/kullaniciadi)

## 🌟 Proje Durumu

[![Aktif](https://img.shields.io/badge/Maintenance-Active-green.svg)]()
[![Beta](https://img.shields.io/badge/Version-Beta%201.0-blue.svg)]()

---

**Türkiye'nin açık veri altyapısına katkı için teşekkürler! 🇹🇷🗺️✨**

Made with ❤️ by Turkish Open Data Community
