# Sofra — restoran sitesi

Değerlendirme için tek sayfalık Türkçe restoran projesi. Yalnızca HTML5 ve CSS3; framework, JavaScript ve derleme gerektirmez. Sofra kurgusal bir restorandır. Menü, fiyat, çalışma saatleri ve konum örnek içeriktir.

## Çalıştırma

`dist/index.html` dosyasını tarayıcıda açın veya proje klasöründe `python -m http.server 8080 --directory dist` çalıştırın.

## Proje sınırları

Bu çalışma yapay zekâ desteğiyle hazırlanmıştır. Dersinizin yapay zekâ kurallarını kontrol edin; kodu anlayıp kendi katkılarınızı yapın ve değerlendirmede yardımın kapsamını dürüstçe açıklayın. Bu commit geçmişi bu hazırlık oturumuna aittir; haftalara yayılmış öğrenci çalışması değildir.

4–5 kişilik grup oluşturmak, ortak tasarımda anlaşmak, hafta içinde buluşmak, birbirine hata ayıklamada yardım etmek ve herkesin bağımsız kod yazması grup tarafından yapılmalıdır. Aynı dosyaları grup üyelerine kopyalamak ödevdeki bağımsız çalışma kuralını karşılamaz.

## GitHub

Yerel commit geçmişi hazırdır. GitHub oturumu olmadığı için uzak depo henüz oluşturulmamıştır. GitHub CLI kuruluysa bu klasörde:

```powershell
gh auth login
gh repo create sofra-restaurant --public --source . --remote origin --push
```

Depo ismi kullanımdaysa kendinize ait başka bir isim seçin. Commit geçmişini sıfırlamadan yükleyin. Daha sonra kendi değişikliklerinizi küçük ve anlamlı commit’lerle kaydedin.
