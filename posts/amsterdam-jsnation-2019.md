---
layout: post
title: 'Amsterdam JSNation 2019'
permalink: "/amsterdam-jsnation-2019/"
description: 7 Haziran’da, Hollanda’nın başkenti güzide kent Amsterdam’da düzenlenen JSNation konferansına Zingat Yazılım Ekibi’ni temsilen katılma fırsatım oldu. Avrupa’nın gezginler tarafından en fazla ziyaret edilen şehirlerinden biri olan Amsterdam’ın merkezi sayılabilecek bir noktada, Zuiderkerk adlı eski bir kilisede gerçekleşen konferans, aynı zamanda Rembrandt’ın ünlü tablosu The Night Watch’u yarattığı yer olmasıyla da ilgi çekiyor.
date: 2019-06-11
---

# {{ title }}
{{ page.date | prettyDate }}

7 Haziran’da, Hollanda’nın başkenti güzide kent Amsterdam’da düzenlenen JSNation konferansına Zingat Yazılım Ekibi’ni temsilen katılma fırsatım oldu. Avrupa’nın gezginler tarafından en fazla ziyaret edilen şehirlerinden biri olan Amsterdam’ın merkezi sayılabilecek bir noktada, Zuiderkerk adlı eski bir kilisede gerçekleşen konferans, aynı zamanda Rembrandt’ın ünlü tablosu The Night Watch’u yarattığı yer olmasıyla da ilgi çekiyor.

Amsterdam JSNation bu sene iki ayrı konumda gerçekleşti. Zuiderkerk ana konferans merkeziydi, kiliseye beş dakika yürüme mesafesinde bulunan Uilenburg sinagogunda ise Node.js merkezli sunumlar yapıldı. Her ne kadar lokasyonlar birbirlerine yakın ve Amsterdam’ın tarihi sokaklarını adımlamak keyifli olsa da, özellikle sunumları canlı izleme gayretinde olduğum için iki lokasyon arasında bayağı bir mekik dokumak durumunda kaldım diyebilirim.

<img class="lazy" data-src="/public/images/posts/amsterdam-jsnation-2019/zuiderkerk.jpeg" alt="Zuiderkerk - Ana Salon" />

JavaScript Zingat’ta code stack’imizin en önemli unsurlarından biri. Platformumuzun önemli parçalarından MVC bir Node.js — Express uygulaması olan zingat.com website’ı başta olmak üzere, kimisi son kullanıcılara açık kimisi de Zingat içerisinde, backend ya da frontend ihtiyaçlarına yönelik olarak geliştirdiğimiz çeşitli JS uygulamalarımız mevcut. Haliyle JavaScript tarafında gerçekleşen gelişmeleri sıkı şekilde takip ediyor ve uygulamalarımızı devamlı güncel tutmaya gayret ediyoruz. Bu bağlamda Amsterdam JSNation benim adıma hem arkaplan edindiği egzotik lokasyonu hasebiyle hem de JS komünitesinden takip ettiğim kimi isimlerin sunumlarıyla bünyesinde yer almalarından dolayı katılmayı ziyadesiyle arzu ettiğim bir organizasyondu.

<img class="lazy" data-src="/public/images/posts/amsterdam-jsnation-2019/uilenburg.jpeg" alt="Uilenburd - Node.js Salonu" />

Katıldığım sunumları mümkün mertebe çeşitli tutmaya, hem backend hem de frontend taraflarındaki konuşmalara seyirci olmaya gayret ettim. Zuiderkerk’te daha çok JavaScript’in frontend’deki kullanımına yönelik sunumlar varken, Uilenburg sinagogunda backend ağırlıklı anlatımlar vardı. Organizasyonu tertip eden GitNation ekibinin sunumları çeşitli ve ilgi çekici kılmak noktalarında iyi iş çıkardığını söyleyebilirim; zira WebGL’den tutun otomatik sayfa performansı ölçümleme metodolojilerine, fonksiyonel programlama paradigmalarından Angular geliştirmeye, oradan Node.js backend’lerde hata yönetimine uzanan geniş çerçevede bir içerik oluşturmayı başarmışlar.

<img class="lazy" data-src="/public/images/posts/amsterdam-jsnation-2019/amsterdam.jpeg" alt="Amsterdam" />

<img class="lazy" data-src="/public/images/posts/amsterdam-jsnation-2019/opening.jpeg" alt="JSNation Açılış" />

Benim bu yazıyı kaleme aldığım dönemde sunumları resmi Youtube sayfalarında ayrı ayrı koymamışlardı. O yüzden katıldığım sunumlar ve aldığım notlarla birlikte, sunumları stream’in tamamından başlangıç noktalarını link’leyerek sizlerle paylaşacağım.

Sabah organizasyon alanına gelip içeri girdikten ve benim için bastırılmış, üzerinde ismimin yazılı olduğu kartımı alıp boynuma astıktan sonra Kyle Simpson’ın açılış konuşmasını dinlemek üzere yerime oturdum. Kyle Simpson Github üzerindeki reposundan ([https://github.com/getify/You-Dont-Know-JS)](https://github.com/getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS))) bedava şekilde okuyabileceğiniz popüler You Don’t Know JS serisinin yazarı, uzun yıllara dayanan bir programcılık geçmişi var ve web’in yıllar içerisinde geçirdiği evrimin her evresinde bulunmuş bir geliştirici. Özellikle JavaScript’in gün geçtikçe compile target’a dönüşmesi üzerine dile getirdikleri çok hoşuma gitti. Her birimizin web geliştirmeye giriş döneminde tarayıcıda ilgimizi çeken bir web sayfasında sağ tıklayıp “Kaynağı Gör”’ü seçerek, HTML’i inceleyerek ve anlamaya çalışarak bu işi öğrenmesi üzerinden hareketle gün geçtikçe kompleksleşen Web ve JavaScript geliştirme kültürünün eğlenceli ve düşündürücü bir eleştirisini yaptı.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Keep betting on JavaScript - Kyle Simpson" data-src="https://www.youtube.com/embed/ZrKjgSfpppM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

İlk konuşmanın ardından Node.js salonuna geçtim ve orada uzun süredir detaylı incelemek istediğim Quasar Framework üzerine yaratıcısı Razvan Stoenescu’nun sunumunu izledim. Tek bir codebase üzerinden hybrid mobile, desktop (electron) ve web geliştirme yapmanızı sağlayan, arkaplanda Vue.js kullanan overall bir çözüm sunuyor. Ufak bir uygulama yapmak için beni tavladı diyebilirim.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="SSR with Quasar Framework - Razvan Stoenescu" data-src="https://www.youtube.com/embed/RUWawfKVomw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Waleed Ashraf’in multiple Node.js process’lerini yönetmek için RabbitMQ ve PM2 kullanmak üzerine sunumu özellikle Node.js’in built-in cluster yapısından daha yönetilebilir ve ölçeklenebilir bir mimariye geçme deneyimi olarak önemli noktalara değindi.

[https://waleedashraf.me/switching-from-cluster-module-to-pm2-and-rabbitmq-in-nodejs/](https://waleedashraf.me/switching-from-cluster-module-to-pm2-and-rabbitmq-in-nodejs/](https://waleedashraf.me/switching-from-cluster-module-to-pm2-and-rabbitmq-in-nodejs/))

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="RabbitMQ and PM2 in Node.js for managing Multiple Processes - Waleed Ashraf" data-src="https://www.youtube.com/embed/fM9qwbofop0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Bu iki sunumdan sonra tekrar ana salona döndüm ve Webpack’in yaratıcısı Tobias Koppers’in Webpack 5'le ilgili konuşmasını dinledim. Bu sürümle birlikte bazı breaking change’ler olduğundan ve bu tercihleri neden/nasıl aldıklarından bahsetti.

<img class="lazy" data-src="/public/images/posts/amsterdam-jsnation-2019/webpack.jpeg" alt="Webpack 5" />

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Why Breaking Changes? What is next? - Tobias Koppers" data-src="https://www.youtube.com/embed/p-MhcctQBlY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

En ilgimi çeken sunumlardan biri Andre Staltz’ın bir fonksiyonel programlama paradigması olarak Lens’lerden bahsettiği ve Cycle.js ile React/Vue örnekleri üzerinden state yönetimine dair örneklerle süslediği konuşması oldu.

<img class="lazy" data-src="/public/images/posts/amsterdam-jsnation-2019/lenses.jpeg" alt="Cycle.js" />

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Functional Lenses for Contemporary Frameworks" data-src="https://www.youtube.com/embed/5R3l2r1XxKI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Bu konuşma sonrasında ana salonu tekrar üzülerek terk ettim zira Babel mainter’ı Henry Zhu’nun açık kaynaklı bir projede görev almak/geliştirici olmak üzerine anlattıklarını merak ediyordum; lakin görev bilinciyle tekrar Node.js salonuna yöneldim.

Viktor Turskyi kendi çalıştığı firmada yaşadıkları deneyimleri ve clean architecture namına Node.js — Express üzerinde uyguladıkları taktikleri anlattığı sunumu başarılıydı, bir de kullandıkları mimariyi Github üzerinde yayınlayacaklarından bahsetti.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="The Working Architecture of Node.js Applications - Viktor Turskyi" data-src="https://www.youtube.com/embed/eVGdV53q68I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Matthias Dugué’nin stateless, zero-knowledge backends sunumu özellikle Node.js — Mongodb — Express stack’i üzerinde JWT kullanımı ve user authentication süreçleriyle ilgili ilginç noktalar içeriyor.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Building Zero-Knowledge Backends - Matthias Dugue" data-src="https://www.youtube.com/embed/1QueApYNfPI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Max Gallo, RxJS’teki map ve filter operator’larını, observer’ları ve operator’ların nasıl chain edildiğini canlı kodlama sekansı üzerinden anlattı sunumunda, yine fonksiyonel programlamaya yönelik başarılı bulduğum bir içerik sundu diyebilirim.

<img class="lazy" data-src="/public/images/posts/amsterdam-jsnation-2019/rxjs.jpeg" alt="RxJs" />

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Reinventing RxJS - Max Gallo" data-src="https://www.youtube.com/embed/7sdVXMTFVbE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Paulo Lopes’in GraalVM üzerinde GraalJS kullanarak, alternatif, V8'siz bir Node.js runtime’ı üzerinde yaptığı benchmark çalışmalarıyla en az Go ya da Rust gibi dillerle kazanılan performansların ötesine nasıl geçebildiğini anlattığı sunumu yine en etkileyici içeriklerden biriydi.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="10 Things I Learned Making the Fastest JS Server Runtime in the World - Paulo Lopes" data-src="https://www.youtube.com/embed/JUJ85k3aEg4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Node.js core contributor’lerinden Ruben Bridgewater’ın Node.js uygulamalarında hata yönetimi sunumu özellikle promise ve async/await kullanan codebase’ler için gerçek hayattan örneklerle süslenmiş bir konuşmaydı.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Error Handling: Doing It Right! - Ruben Bridgewater" data-src="https://www.youtube.com/embed/hNaNjBBAdBo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Financial Times’ta çalışan Katie Koschland’in Artillery ile yük testi metodolojisi üzerine yaşanmış tecrübelerle bezediği sunumu hepimizin dönem dönem yüzleşmek durumunda kaldığı nereden çıktığı belli olmayan çılgın bug’lar temasına sahipti.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Ready, Steady, Crash! - Katie Koschland" data-src="https://www.youtube.com/embed/r8DbY3FCRww" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Günün son iki konuşması için ana salona geri döndüm. Christian Bromann’in otomatik performans testleri üzerine verdiği bilgiler ilgi çekiciydi, bizim de Zingat bünyesinde en fazla önem verdiğimiz konulardan biri olduğu için dikkatle dinledim.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Automated Performance Testing With WebDriver - Christian Bromann" data-src="https://www.youtube.com/embed/Al7zlLdd_es" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

David Rousset, organizasyonun son sunumunda VR, mobile ve web için WebGL ve Babylon.js kullanarak bir PWA olarak geliştirdiği oyunu üzerinden mevzubahis teknolojileri son derece eğlenceli biçimde izleyicilere sundu.

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Using WebGL and PWA to Build an Adaptive Game for Touch, Mouse and VR Devices - David Rousset" data-src="https://www.youtube.com/embed/l9DGNQN4uqU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Katılımın son derece yoğun olduğu organizasyon geriye keyifli anılar ve yeni arkadaşlıklar bıraktı. Önümüzdeki senelerde de daha da kalabalık bir ekiple orada olmayı diliyorum.

*\* Bu yazı ilk olarak [labs.zingat.com](https://labs.zingat.com) adresinde belirtilen tarihte yayımlanmıştır.*
