---
layout: post
title: 'JavaScript Temelleri: Hoisting'
permalink: "/javascript-temelleri-hoisting/"
description: Zingat'ta yazılımcılarla gerçekleştirdiğimiz iş görüşmelerinde sıklıkla karşılaştığımız problemlerden biri adayların kullandıkları dilin temel unsurlarıyla ilişkilerinin bir miktar kopuk olması. Çoğu genç arkadaş güncel web framework'leriyle (React, Vue vs.) yahut JS temelli cross-platform geliştirme ortamlarıyla (React-Native, Ionic vs.) ilgilenmiş oluyor; ancak JavaScript'in hikayesinden ya da dil ve dilin çalıştığı ortamların gerçeklerinden uzak durumdalar.
date: 2020-03-17
---

# {{ title }}
{{ page.date | prettyDate }}

Zingat'ta yazılımcılarla gerçekleştirdiğimiz iş görüşmelerinde sıklıkla karşılaştığımız problemlerden biri adayların kullandıkları dilin temel unsurlarıyla ilişkilerinin bir miktar kopuk olması. Çoğu genç arkadaş güncel web framework'leriyle (React, Vue vs.) yahut JS temelli cross-platform geliştirme ortamlarıyla (React-Native, Ionic vs.) ilgilenmiş oluyor; ancak JavaScript'in hikayesinden ya da dil ve dilin çalıştığı ortamların gerçeklerinden uzak durumdalar.

Bu konuda hem bir kaynak üretmek, hem de bu minvalde kendi bilgilerimi derleyip toplamak ve biraz da kişisel bir referans noktası oluşturmak adına yeni bir yazı dizisine başlamayı uygun gördüm. Okuduğum, izlediğim kaynaklardan edindiğim bilgileri kendimce düzenli bir biçimde sunmak adına böyle bir serüvene çıkıyorum.

Burada anlatacaklarım İnternet'te hali hazırda bulabileceğiniz şeyler, Türkçe ve İngilizce bu konularda söylenmiş pek çok şey var. Haliyle uzun süredir JavaScript'le geliştirme yapanlar burada yazılanları zaten biliyor olacaklar; fakat özellikle dili öğrenmeye yeni başlamış yahut dili kullanarak iş geliştirebilen -lakin daha da derinleşmek isteyenler için güzel bir başlangıç noktası olabilir bu yazı dizisi.

JavaScript motoru bir kod parçacığını çalıştırırken bazı aşamalardan geçirir. Bunları temel olarak:

1. Yaratım fazı (*creation phase*)
2. Yürütme fazı (*execution phase*)

olarak ifade edebiliriz. Yaratım fazı aşamasında JavaScript motoru bize *global* objeyi ve *this* anahtar kelimesini verir. Tarayıcı ortamı için *global*, *window* objesidir. *this* ayrı bir konu, kendisini bilahare inceleyeceğiz. Bunlar, *global execution context*'in oluşması sonucu elimizde olanlar aslında. Kullandığınız tarayıcıya boş bir `.js` dosyası verip geliştirici konsolunda *global* (*window*) ve *this* ifadelerini yazdırmayı deneyin, dosyanız boş olmasına rağmen bunlara erişiminiz olduğunu göreceksiniz.

Yaratım fazında gerçekleşen bir durum daha var. Bu yazının da konusu olan *hoisting* (yukarı kaldırma/çekme) tam da bu noktada gerçekleşiyor. Aşağıdaki gibi bir kod parçacığımız olsun:

```javascript
console.log(person);
console.log(greetPerson);

var person = 'ahmet';

function greetPerson() {
    console.log('Hello ' + person);
}
```

JavaScript'te diğer birçok programlama dilinden farklı olarak *person* ve *greetPerson* değişkenlerinin kodun başında konsola yazılmalarını sağlayan fonksiyonları çağırmak herhangi bir hataya sebep olmaz. *Hoisting* sonucu değişken deklarasyonları (*variable* *declaration*)  ve fonksiyon deklarasyonları (*function declaration*) *hoist* edilir. Aşağıdaki gibi bir durum oluştuğunu anlayışımızı kolaylaştırmak adına varsayabiliriz:

```javascript
var person = undefined;

function greetPerson() {
    console.log('Hello ' + person);
}

console.log(person); // undefined
console.log(greetPerson); // function greetPerson()

person = 'ahmet';
```

Tabii aslında olan bu değil. JavaScript motoru yaratım fazında bütün kod bloğunun üzerinden geçer, *global execution context* ile varsa *function execution context*'ler (JavaScript'te her bir fonksiyonun kendi yürütme konteksti bulunur) içerisindeki değişken ve fonksiyon deklarasyonlarını hafızaya (*memory*) kaydeder.

Peki böyle bir ihtiyaç neden hasıl olmuş? Benim de bu yazıyı hazırlarken rast geldiğim, Brendan Eich'a ithaf edilen şu cümleyi paylaşmak isterim:

> "var hoisting was thus [an] unintended consequence of function hoisting, no block scope, [and] JS as a 1995 rush job."

Yine dönüp dolaşıp JavaScript'in şahsına münhasır dizaynından kaynaklı bir çıktı gibi duruyor.

*Hoisting* konusunu anlama gayretimizde dikkat edilecek bazı noktalar var, bunları örnekler üzerinden inceleyelim:

```javascript
console.log(person);
console.log(greetPerson);

var person = 'ahmet';

(function greetPerson() {
    console.log('Hello ' + person);
})
```

Bu kodu çalıştırdığımızda *person* değişkeni için yukarıda anlattıklarımız halen geçerli; fakat *greetPerson* fonksiyon deklarasyonu artık bir *IIFE* (*Immediately Invoked Function Expression*). Bu durumda ortada bir deklarasyon yok aslında. Haliyle JavaScript motoru bu kodun üzerinden geçerken *hoist* edilen sadece *person* değişkeni olacak.

```javascript
var person = undefined;

console.log(person); // undefined
console.log(greetPerson); // ReferenceError: greetPerson is not defined

person = 'ahmet';

(function greetPerson() {
    console.log('Hello ' + person);
})
```

Şimdi de sadece *variable initialization* durumunu ele alalım:

```javascript
console.log(person);

person = 'ahmet';
```

Kodu çalıştırdığımızda hata alacağız. Başta dediğimiz gibi, sadece deklarasyonlar *hoist* ediliyor, burada bir deklarasyon durumu mevzu bahis değil.

```javascript
console.log(person); // ReferenceError: person is not defined

person = 'ahmet';
```

Benzeri bir durum da fonksiyon ifadeleri (*function expression*) nezdinde gerçekleşiyor:

```javascript
console.log(person);
console.log(greetPerson);

var person = 'ahmet';

var greetPerson = function() {
    console.log('Hello ' + person);
}
```

Bu sefer çıktımız aşağıdaki gibi olacak; zira bu fonksiyon ifadesi bu bağlamda bir değişken deklarasyonu olmakta. *Hoisting*'in çalışma prensibi gereğince de bu bağlamda ele alınmakta.

```javascript
var person = undefined;
var greetPerson = undefined;

console.log(person); // undefined
console.log(greetPerson); // undefined

person = 'ahmet';

greetPerson = function() {
    console.log('Hello ' + person);
}
```

Örneğimizi biraz daha geliştirip bu sefer işin içine *function execution context*'leri de katalım:

```javascript
console.log(person);
console.log(greetPerson);
console.log(greetPerson());

var person = 'ahmet';

function greetPerson() {
    console.log('Hello ' + person);

    var person = 'mehmet';
}
```

Dikkat etmemiz gereken nokta *greetPerson* fonksiyonu içerisinde de aynı *global execution context*  içerisinde olduğu gibi *hoisting* gerçekleşiyor ve JavaScript motoru `var person = 'mehmet';` satırını gördüğü anda *person* değişkeni için hafızada yer arıyor (*memory allocation*). JavaScript'teki kapsam zinciri (*scope chain*) işleyişi sonucu *person* değişkeninin davranışına da dikkatinizi çekmiş olayım.

```javascript
var person = undefined;

function greetPerson() {
    var person = undefined;

    console.log('Hello ' + person);

    person = 'mehmet';
}

console.log(person); // undefined
console.log(greetPerson); // function greetPerson()
console.log(greetPerson()); // 'Hello undefined'

person = 'ahmet';
```

Bir diğer örnek:

```javascript
console.log(person);

var person = 'ahmet';
var person = 'mehmet';
```

*Hoisting* gerçekleştiğinde şöyle olacağını varsayabiliriz:

```javascript
var person = undefined;

console.log(person); // undefined

person = 'ahmet';
person = 'mehmet';
```

Değişken deklarasyonları için şu ana kadar gördüğümüz örneklerden farklı bir şey yok gibi duruyor, peki fonksiyon deklarasyonları için durum ne?

```javascript
console.log(greetPerson());

function greetPerson() {
    console.log('Hello');
}

function greetPerson() {
    console.log('Hi');
}
```

JavaScript motoru ilk *greetPerson* deklarasyonunu gördüğü anda bunu *hoist* edecek, ardından ikinci fonksiyon deklarasyonunu görecek ve bunu da aynı şekilde *hoist* edecek. Hafızadaki *greetPerson* fonksiyonunun üzerine ikinci fonksiyonu yazacak.

```javascript
function greetPerson() {
    console.log('Hi');
}

console.log(greetPerson()); // 'Hi'

function greetPerson() {
    console.log('Hello');
}
```

Son olarak da ECMAScript 2015 ile birlikte hayatımıza giren *let* ve *const* anahtar kelimelerinin *hoisting* durumundaki davranışlarına bakalım:

```javascript
console.log(person);
console.log(greetPerson);
console.log(greetPerson());

const person = 'ahmet';

function greetPerson() {
    console.log('Hello ' + person);

    let person = 'mehmet';
}
```

Aslında *let*, *const*, *var*, *class* ve *function* anahtar kelimeleri *hoist* ediliyor; fakat *initialization* aşamasında oluşan farklılıktan dolayı *let* ve *const*'un bu şekilde kullanımı *ReferenceError* oluşmasına yol açıyor. *let*/*const* ile deklare edilen bir değişken ilgili ifade (*statement*) koşulana kadar başlatılmamış (*uninitialized*) durumda olurken, *var* ile deklare edilen bir değişken *undefined* primitifi ile başlatılmış da oluyor aynı zamanda.

```javascript
console.log(person); // ReferenceError: person is not defined
console.log(greetPerson);
console.log(greetPerson());

const person = 'ahmet';

function greetPerson() {
    console.log('Hello ' + person);

    let person = 'mehmet';
}
```

İlk konsol ifadesini kaldırırsak bu sefer *let* sebepli  aynı hatayı *greetPerson* fonksiyonunun çalıştırılması dolayısıyla alacağız.

*\* Bu yazı ilk olarak [labs.zingat.com](https://labs.zingat.com) adresinde belirtilen tarihte yayımlanmıştır.*
