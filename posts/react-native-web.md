---
layout: post
title: 'Cross-Platform Development: React-Native-Web'
permalink: "/cross-platform-development-react-native-web/"
description: Cross-Platform Development’a niyet ettiğinizde en çok karşılaşacağınız ve kafanızı karıştıracak soru bu olacak. Benim bu noktada kişisel kanaatim, Web Development kökenli bir yazılım geliştirici olma perspektifinden tabii, kararı tamamen ihtiyaçlarınıza göre vermeniz. Küçük ve orta ölçekli projeler için, özellikle uygulamalarınız harika animasyonlara yahut native platformun _cutting-edge_ özelliklerine bağımlı değilse Hybrid bir uygulama işinizi fazlasıyla görecektir diyebilirim; lakin istekleriniz ve yazılım geliştirme takımınızın kompozisyonu (örneğin hem mobil uygulama hem de web geliştiricilerin olduğu ve uyumlu çalışabilecekleri bir ortam) uygunsa native çözümlere yönelmeniz daha sağlıklı olacaktır.
date: 2019-09-22
---

# {{ title }}
{{ page.date | prettyDate }}

Güncel bir proje için fikrinizin tüm popüler platformlarda yer almasını istiyor olmanız son derece makul. Bu gerçekten hareketle bugün bir uygulama inşa etmeye ve kullanıcılarınızın karşısına çıkmaya karar verdiğinizde muhtemelen en az, üç popüler platformda yer almak zorundasınız.

*   Web
*   iOS
*   Android

Bu üç düzlem için üç ayrı dilde, üç ayrı geliştirme kültürü ve platformların geliştirme araçlarını kullanarak ve bu ortamlarda geliştirme yapma gereklerini yerine getirerek aslında büyük oranda aynı işi yapan üç ayrı uygulama üreteceksiniz.

Tabii her proje aynı rekabet imkanlarına ve gücüne sahip olamıyor. Ekibinizdeki geliştirici sayısı, bu geliştiricilerin tecrübesi ve sadakati tüm süreçte ziyadesiyle etken hususlar olarak karşımıza çıkıyor. Aynı şekilde ürün yönetimi, dizayn süreçleri ve yine tüm bu ayrı uygulamalar üzerindeki test akışlarının yönetimi dünyanızdaki karmaşıklığı arttırmaya meyyal bir durum.

İşte tüm bu unsurlar göz önünde bulundurulduğunda `Cross-Platform Development` bilişim projeleri için günümüzün kızıl elması, kutsal kasesi, El Dorado'sudur diyebiliriz. Zira tek bir geliştirme ortamı, tek bir codebase ve bu bağlamda yine ortak diğer süreçler ve çok daha düşük maliyetlerle projenizi/fikrinizi hayata geçirmenizi ve tüm yaygın kullanılan platformlarda varolmanızı sağlayan bir yazılım geliştirme konsepti `Cross-Platform Development`.

## Hybrid mi Native mi?

Cross-Platform Development’a niyet ettiğinizde en çok karşılaşacağınız ve kafanızı karıştıracak soru bu olacak. Benim bu noktada kişisel kanaatim, Web Development kökenli bir yazılım geliştirici olma perspektifinden tabii, kararı tamamen ihtiyaçlarınıza göre vermeniz. Küçük ve orta ölçekli projeler için, özellikle uygulamalarınız harika animasyonlara yahut native platformun _cutting-edge_ özelliklerine bağımlı değilse Hybrid bir uygulama işinizi fazlasıyla görecektir diyebilirim; lakin istekleriniz ve yazılım geliştirme takımınızın kompozisyonu (örneğin hem mobil uygulama hem de web geliştiricilerin olduğu ve uyumlu çalışabilecekleri bir ortam) uygunsa native çözümlere yönelmeniz daha sağlıklı olacaktır.

## Cross-Platform Development’ın Geleceği

Önümüzdeki yıllar içinde çok daha fazla konuşulacak ve uygulanacak bir yöntem olduğunu düşünüyorum; zira cihazlar çeşitleniyor, alternatif platformlar peyda oluyor ve projelerin farklı ortamlarda kendilerini gösterme/bulunma ihtiyaçları artıyor. Bu bağlamda şu anda birleştirici bir geliştirme ortamı/kültürü olarak Web Development bu ihtiyaçların ortasında yer alıyor gibi görünse de örneğin Flutter’ı geliştiren ekibin üzerinde çalıştığı Hummingbird’de olduğu gibi Web’in de üzerinde bir soyutlama (_abstraction_) seviyesinde hem Web’e hem de iOS ve Android’e çıktı oluşturabilecek geliştirme imkanları gündemlerimizi daha da fazla işgal edecek.

## React

Tam bu noktada ara vermek ve uygulama ön yüz geliştirme dünyasında son yılların en popüler JavaScript kütüphanesinden, React’tan bahsetmek istiyorum. Buradan React-Native’e ve React-Native-Web’e uzanacağız tabii.

React, sadece React olarak üzerinde çalışacağı platforma dair herhangi bir bilgiye sahip değil. React, sadece _view_’le, yani gördüğümüz şeyle ilgileniyor. Bu şeyi bize ifade ederken de bazı temel kavramlar kullanıyor. Bunlar _view_’ü inşa ederken kullandığımız lego parçaları diyebileceğimiz `Component`'ler -ki React dünyasında her bir `Component` temel olarak `view` render eden birer fonksiyondur.

React, _Imperative_ değil _declarative_ bir kod yazım perspektifi sunuyor. Bunu da `Component`’lerin `state` ve `prop`’ların değişimi ile re-render olması prensibi ile çözüyor.

## Web’de React Kullanımı

Bahsettiğim gibi React, kendi başına hangi platformda çalıştığını bilmiyor. `Component`'lerin tanımlanması, birbirleriyle kurdukları ilişki ile `state` ve `prop` kavramlarını temel alıyor. Temelde UI'ı _declarative_ biçimde oluşturmanızı sağlıyor.

Web’de React kullanmak için ReactDOM adında ek bir kütüphaneden yararlanıyoruz. ReactDOM bünyesinde DOM spesifik metodlar barındırıyor, React bileşenlerinizin Web üzerinde çalışır hale gelmesini sağlıyor bu metodlar sayesinde.

## React-Native

React-Native, Facebook tarafından 2015 Mart’ında OSS olarak Github üzerinden yayınlandı. React’la birlikte gündeme gelen “learn once, write everywhere” düsturuna bağlı kalarak, kısa sürede Cross-Platform Development için en önde gelen geliştirme platformlarından biri haline geldi. Kütüphanenin Github üzerindeki performansı, bu yazının kaleme alındığı tarih itibariyle gayet iyi durumda.

## React-Native-Web

Cross-Platform çözümler için araştırma yaparken React-Native-Web’le karşılaştım. Nicolas Gallagher tarafından yazılmış bir kütüphane. Nicolas Gallagher Twitter’ın PWA’inin yazılması sürecinde tech-lead olarak rol almış bir yazılımcı, günümüzde ise Facebook’ta çalışıyor. React-Native-Web ilk olarak 2015 Temmuz’unda yayınlanmış, ilerleyen süreçte geliştirilmiş, hali hazırda da geliştirilmeye devam edilen bir JavaScript kütüphanesi.

React-Native-Web’in temel fikri son derece basit aslında. Nasıl React-Native ile tek bir Component lisanı kullanıyor ve bunları Android ve iOS eşleniklerine dönüştürüyorsak, bu kütüphane de aynı soyutlamaları karşılıkları olan DOM uyumlu HTML tag’lerine eviriyor. Bu eşleştirme sayesinde React seviyesinde tuttuğumuz business logic, state yönetimi, bileşen hiyerarşisi aynı kalmakla birlikte üç platform için de render() fonksiyonları içinde aynı lisanı kullanabilir hale geliyoruz.

## Expo

Expo, React-Native üzerine kurulmuş bir araçlar bütünü. React-Native geliştirirken hayatınızı oldukça kolaylaştıran bazı araçlar sunuyor. Örneğin Expo CLI ile uygulamanızı başlattığınızda basit CLI komutları üzerinden istediğiniz platform için uygulamanızı geliştirebiliyor, verdiği QR kodu telefonunuza kurduğunuz Expo Client uygulaması ile kolayca açıp cihaz üzerinde debug edebiliyorsunuz. Ayrıca birçok kütüphane ile örneğin cihaz spesifik kamera, akselerometre vb. API’larına ulaşmanızı sağlıyor, bunlar ayrıca geliştirme yapma maliyetinden sizi kurtarıyor. Tüm getirilerinin yanında hazır bir çözüm olmasından kelli dünyanızı kısıtlıyor ve React-Native projenize platform özel dillerde (Objective-C, Swift, Java yahut Kotlin) yazılmış modülleri eklemenizi namümkün hale getiriyor. Ayrıca hazır çözümlerle gelmesinin bir dezavantajı olarak uygulamanızın boyutu büyüyor.

Ben kendi React-Native-Web serüvenimde Expo kullanmadım. Hem geliştirme platformunu daha iyi öğrenmek hem de bağımlılıklarımı azaltmak, kullandığım her kütüphanenin maksadını biliyor olmak anlamında daha doğru bir yöntem olduğunu düşünüyorum. Lakin yine ihtiyaçlar değerlendirilip ufak ya da orta çaplı uygulamalar için hiç düşünmeden Expo kullanabilir, geliştirme sürecinizde oldukça rahat edebilirsiniz.

Expo’yla ilgili son bir not: React-Native-Web’i React-Native ile bir araya getirme noktasında çok ciddi çabaları var. Burada yaptıkları çalışmalar çok önemli ve hali hazırdaki problemlerini giderip bu hususta yol alabilirlerse kolay kullanılabilir bir JS yönelimli Cross-Platform Development ortamını biz geliştiriciler için oluşturmuş olacaklar.

* * *

## React-Native-Web Tecrübelerim

Geldik en can alıcı kısıma. Kendi React-Native-Web öğrenme ve geliştirme sürecimde yaşadıklarımdan dem vuracağım bu noktada.



[Bu link](https://github.com/doganozturk/react-native-web-boilerplate)’te bu süreçte oluşturduğum bir repo var. Aslında biraz araştırırsanız göreceğiniz üzere üretilmiş pek çok React-Native-Web başlangıç projesi var; ancak hem React hem de React-Native tarafında versiyonlar ilerledikçe, ayrıca komünite tarafından geliştirilen yardımcı kütüphaneler de aynı şekilde geliştikçe bazı şeyler eskiyor. Bu da sürecin tekrar ele alınmasını gerekli kılabiliyor.

Yaptığım çalışmada kullanılan tüm paketlerin maksatlarını öğrenmek, hem de böyle bir implementasyonun büyük bir projede karşımıza çıkarabileceği karmaşıklıkları baştan sezebilmek adına yapıyı düşe kalka, sıfırdan kurmaya gayret ettim.

İlk işim, React-Native dökümantasyonunda da önerildiği şekilde, React-Native-CLI’ı kullanarak “react-native init” komutu ile bir başlangıç projesi oluşturmak oldu. Web’i de içeren yapıyı bu temelin üzerinden şekillendirdim. React-Native’i baz almak önemli; zira native tarafta çok daha fazla “oynak parça” bulunuyor, bu da zannımca işin o tarafını daha kırılgan hale getiriyor. Bu sebeple temeli native uygulama için atıp Web’i yanına iliştirmek daha sağlıklı sonuçlar elde etmek için önemli.

Yine tam burada Web ve React-Native’i bir araya getirdiğinizde karşılaşacağınız temel problemlerden biri, navigasyon konusu ortaya çıkıyor. Nihayetinde Web bünyesinde routing kavramını barındıran ve url’ler üzerinden farklı sayfalara gidilebilen bir platform; native içinse farklı “view’ler” arası geçişlerin yönetimi konusu Web’deki routing’e benzese de aslında daha farklı konseptleri bünyesinde barındırıyor.

Biraz araştırdıktan sonra navigasyon meselesini çözmek için React-Navigation kütüphanesini uygun buldum diyebilirim. React-Navigation ve Expo geliştiricileri birlikte React-Native-Web’i üzerinde daha kolay çalışılabilir hale getirmeye çalışıyorlar. Tabii React-Navigation kullanınca işiniz bitmiyor; yine iki navigasyon durumunu da çalıştırmanızı sağlayacak wrapper’lar yazmanız gerekebilir.

Bir diğer önemli husus da Web tarafında JS’in nasıl bundle edileceği meselesi. Bu noktada native projeden bağımsız bir Webpack konfigürasyonu yapmak gerekiyor. Bu konfigürasyonun içerisinde birçok React-Native paketi hali hazırda ES5 uyumlu derlenmediği için örneğin, bu durumu karşılayacak spesifik Babel loader ayarları yapmak gerekiyor.

Import statement’ları için de benzer şekilde alias tanımlaması yapmak gerekiyor.

Web ve native için yazdığınız farklı kodların da yine platform bazlı ayrımını Webpack konfigürasyonunuzda “.web.js” uzantılı dosyalara öncelik verecek şekilde ayarlayacak bir çalışma yapmak gibi bir çözüm var. Yukarıda bahsettiğim navigasyon konusuna dönersek Web’de çalışacak kısmın ilgili dosyasını “.web.js” uzantılı hale getiriyor, native içinse standart dosyayı kullanıyoruz. Bu dosya diyelim ki “index.js” ise, bu yaklaşım sonucunda bir de “index.web.js” dosyanız oluyor. Webpack kodunuzu bundle ederken dosyanın “.web.js” uzantılı olan halini esas alıyor, bu da Web özelinde işler yapmanıza olanak tanıyor.

* * *

Sona geldiğimizde React-Native-Web’in kullanılabilirliği üzerine bazı tespitlerde bulunmak istiyorum. Zingat özelinde örneğin, Zingat’ın ilanlarını listelediğimiz, kullanıcılara arama yapma ya da konut projelerinin detaylarını sunma gibi yüksek SEO gereksinimleri olan veya Pagespeed performansı özelinde çok ince çalışmamızın gerektiği modüller için kullanılabilir olduğunu düşünmüyorum. Aynı şekilde akıllı bir telefonun son API’larını kullanan, platform özelinde yüksek performans ve hakimiyet gerektirecek işler için de Web’i ve native’i bir araya getirmezdim diyebilirim.

Bunun yanında eğer ilgili ön yüzleriniz yukarıda bahsettiğim durumlardan muafsa ve ekibinizin ortaya çıkacak karmaşıklıkla baş edebileceğini düşünüyorsanız (hem native hem de Web tarafında işinin ehli geliştiricilerinizin olması ön şart bence) tek bir codebase ile üç platform için de çıktı üretebilmek ciddi anlamda heyecan verici.

* * *

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Cross-Platform Development: React-Native-Web" data-src="https://www.youtube.com/embed/G5KBZWLhtMM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Zingat Yazılım Ekibi olarak 29 Haziran 2019 tarihinde İTÜ Arı 3 Teknokent Konferans Salonu’nda düzenlediğimiz ikinci Zeetup etkinliğimizde bu konuda bir sunum gerçekleştirdim. Cross-Platform Development’ın merak uyandırıcı dünyasına React/React-Native özelinde ufak bir giriş anlamında göz atmanızı tavsiye ederim.

*\* Bu yazı ilk olarak [labs.zingat.com](https://labs.zingat.com) adresinde belirtilen tarihte yayımlanmıştır.*
