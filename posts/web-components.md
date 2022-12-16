---
layout: post
title: 'Web Components'
permalink: "/web-components/"
description: Geliştirdiğimiz web ön-yüz projelerinde, özellikle de firma bazlı tüm departmanların gelişimine katkıda bulunduğu ve bakımını sağladığı styleguide’larınız yoksa; her yeni ürün ekleme süreci sonunda yeni button’lar, label’lar, form element’leri, modal’lar vb. geliştirmek durumunda kalındığı bir gerçek. Bu durum da bir süre sonra ön-yüz projelerinde karmaşıklığın yükselmesine ve geliştirme ve bakım maliyetlerinin artmasına sebep oluyor.
date: 2019-06-17
---

# {{ title }}
{{ page.date | prettyDate }}

Web Components beni son zamanlarda en fazla heyecanlandıran ön-yüz geliştirme konseptlerinden biri. Bu yazımda, _HTML_, _CSS_ ve _JavaScript_ ile tekrar tekrar kullanılabilir ve kapsüllenmiş web bileşenleri geliştirmemizi sağlayan bu teknolojiler bütününden bahsedeceğim.

Geliştirdiğimiz web ön-yüz projelerinde, özellikle de firma bazlı tüm departmanların gelişimine katkıda bulunduğu ve bakımını sağladığı styleguide’larınız yoksa; her yeni ürün ekleme süreci sonunda yeni button’lar, label’lar, form element’leri, modal’lar vb. geliştirmek durumunda kalındığı bir gerçek. Bu durum da bir süre sonra ön-yüz projelerinde karmaşıklığın yükselmesine ve geliştirme ve bakım maliyetlerinin artmasına sebep oluyor.

Bu sıkıntı elbette dünyada birçok yazılım geliştirici tarafından görüldü ve çeşitli çözümler üretildi. Aslında modern ön-yüz geliştirme çatıları olarak an itibariyle tercih edilen _React_, _Vue_ ve _Angular_’ın temel anlamda çözdüğü problem de bu. Özellikle _React’ın_ sunduğu view’un o anki state’in fonksiyonel bir çıktısı olması durumu (elbette one-way data-flow ile birlikte) kompleks ön-yüzleri bir bileşenler bütünü olarak algılama ve geliştirme fikrini de ortaya koymuş oldu.

Web Components kavramı özelinde konuşacak olursak, aslında framework’ler ile yıllardır yapılmakta olan şeylerin tarayıcı seviyesinde ve bir web projesini oluşturan temel öğelerin platformun desteklediği biçimde (_native_) ortaya konulması diyebiliriz. Böylece elimizdeki temel teknolojiler ile ( _HTML_, _CSS_ ve _JavaScript_) tekrar tekrar kullanılabilir web bileşenleri yazabiliyor hale geldik.

Web Components konseptinin uygulanabilir olmasını sağlayan üç adet browser API’ı var. Bunlar:

**1\. Custom Elements**

Custom elements API’ı sayesinde kendi ürettiğimiz tag’leri aynı `<div>`, `<span>` ya da `<video>` gibi, kullanabilir duruma geliyoruz. Bu bağlamda Web Component'leri temel olarak kendi ürettiğimiz custom HTML element'leri diyebiliriz.

Aynı `<video>` tag'inin kendi içerisinde başka öğeler (play, stop button'ları vb.) kullanıyor olmasına benzer şekilde, örneğin `<zingat-suggest />` custom element'i Zingat'ın suggest box'ının içerisindeki tüm kompleksliği saklıyor olabilir.

**2\. Shadow DOM**

Shadow DOM sayesinde bileşenimizdeki kendi HTML element’lerimizi varolan DOM’dan ayrı bir DOM ile kullanabiliyoruz. Bu durum ayrıca native olarak scoped CSS yazmamıza da olanak sağlıyor; en temel getirisi gibi görünse de aslında light DOM’dan tamamen bağımsız, bileşen özelinde bir DOM’a sahip oluyoruz bu API vesilesiyle.

**3\. HTML Templates**

HTML Template’leri `<template></template>` tag'larini kullanarak bir web dökümanı yüklendiğinde render olmayan HTML parçacıkları ( _fragment_) oluşturmamıza olanak tanıyor. Bu blueprint'leri daha sonra oluşturacağımız bileşenler için kullanabiliyoruz.

Web Components’e dair temel teoriden basitçe bahsettik, daha detaylı bilgi için [MDN’in Web Components dökümanından](https://developer.mozilla.org/en-US/docs/Web/Web_Components) yararlanabilirsiniz.

* * *

Şimdi, biraz da bu yazının kaleme alınmasına sebep, 30 Mart 2019 tarihinde Zingat Yazılım Ekibi olarak Nurol Tower’da düzenlediğimiz [Zeetup](https://www.meetup.com/zingat/)’ta gerçekleştirdiğim mini atölye çalışmasındaki örneklerin üzerinden gidip, kod tarafında nasıl oluyor bu iş, ona bakalım istiyorum:

Bir Web Component oluşturmak için yapacağımız temel aksiyon son derece basit aslında, ES6 ile hayatımıza giren class syntax’ını kullanarak bir obje yaratıyoruz ve daha sonra platformun bize sağladığı ve `CustomElementRegistry` objesine bir referans döndüren `window.customElements`'in `define()` metodu ile bileşenimizi register etmiş oluyoruz.

```javascript
class  ToolTip  extends  HTMLElement {
}

customElements.define('zingat-tooltip', ToolTip);
```

Böylece markup’ımızda kullanabileceğimiz `<zingat-tooltip>` şeklinde bir Web Component'imiz var artık. Bu tooltip'in HTML tarafında herhangi bir yazıyı içine aldığı durumda o yazının sonuna bir yıldız koymasını ve faremin imleci ile bu yıldız üzerinde hover ettiğimde yine benim belirlediğim bir metnin görünür olmasını istiyorum.

```javascript
class  ToolTip  extends  HTMLElement {
	constructor() {
		super();

		this.tooltipIcon  =  null;
		this.attachShadow({ mode:  'open' });

		this.shadowRoot.innerHTML = \`
			<slot></slot><span>\*</span>
		\`;
	}
...
```

Burada `<slot>` kullanımıyla `<zingat-tooltip>` tag'lerinin içine aldığım metni açtığım shadowRoot'un içine koyuyor, metnin sonuna da `<span>` tag'iyle bir yıldız ekliyorum.

```javascript
...

	render(e) {
		const visible = e.type === 'mouseenter';

		let tooltipContent = this.shadowRoot.querySelector('div');

		if (visible) {
			tooltipContent = document.createElement('div');
			tooltipContent.innerHTML = '<span>' + this.text + '</span>';
			tooltipContent.style.backgroundColor = this.bgColor;
		}

		if (visible) {
			this.shadowRoot.appendChild(tooltipContent);
		} else if (!visible && tooltipContent) {
			this.shadowRoot.removeChild(tooltipContent);
		}
	}

	connectedCallback() {
		this.text = this.getAttribute('text') || this.text;
		this.bgColor = this.getAttribute('bg-color') || this.bgColor;

		this.tooltipIcon = this.shadowRoot.querySelector('span');

		this.tooltipIcon.addEventListener('mouseenter', this.render.bind(this));
		this.tooltipIcon.addEventListener('mouseleave', this.render.bind(this));
	}

	disconnectedCallback() {
		this.tooltipIcon.removeEventListener('mouseenter', this.render);
		this.tooltipIcon.removeEventListener('mouseleave', this.render);
	}

	...
```

Yukarıda basit bir `render()` metodu yazdık. Bu metodun yaptığı iş, yıldızın üzerine gittiğimizde göstermek istediğimiz metni içerecek bir `<div>` oluşturmak ve bunu `mouseenter` event'inde gerçekleştirmek. `mouseleave` event'inde de `render()` fonksiyonu içerisindeki kontrollere göre bu içerik kutusunu kaldırabiliyoruz aynı zamanda.

Yine yukarıdaki kod parçacığında Web Component’lere ilişkin bir diğer kavram olan **Lifecycle Callbacks** ile tanışmış olduk. Bunlardan en yoğun olarak kullanacağımız callback, bileşenimiz DOM’a mount olduğunda invoke olan `connectedCallback()` fonksiyonu. `disconnectedCallback()` metodunda ise tahmin edebileceğiniz gibi bileşenimizi DOM'dan kaldırdığımız durumlarda memory leak'leri önlemek adına temizleme işlemleri yapıyoruz.

Bir diğer önemli **Lifecycle Callback** de `attributeChangedCallback()`. Bu da Web Components'e _reactivity_ katan bir yapı aslında. Yukarıdaki kodda `this.text` ve `this.bgColor` şeklinde iki property kullanmıştık, bunlar `<zingat-tooltip text="Bu bir tooltip metni!" bg-color="#fff">...` şeklinde kullandığımız bileşenimize dinamik olarak verdiğimiz değerleri örneklemek için kullandığım iki property idi. `attributeChangedCallback()` ile bu _attribute_'ler değiştirildiğinde bileşenin bu durumdan haberdar olması ve buna göre reaksiyon göstermesi sağlanıyor.

```javascript
class ToolTip extends HTMLElement {
	constructor() {
		super();

		this.tooltipIcon = null;
		this.text = 'Standart metin';
		this.bgColor = "#fff";

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = \`
			<style>
				span {
					cursor: pointer;
				}

				div {
					background-color: ${this.bgColor};
					color: #000;
					padding: 0.5rem;
					border: 1px solid #000;
					border-radius: 4px;
					box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.5);
					position: absolute;
					top: 0.5rem;
					left: 0.5rem;
					z-index: 1;
				}
			</style>

			<slot></slot><span>\*</span>
		\`;
	}

	...

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}

		if (name === 'text') {
			this.text = newValue;
		}

		if (name === 'bg-color') {
			this.bgColor = newValue;
		}
	}

	static get observedAttributes() {
		return \['text', 'bg-color'\];
	}
}
```

`text` ve `bgColor` property'leri için default değerleri _constructor_'da belirledik gördüğünüz üzere. Daha sonra `connectedCallback()`'te bu değerleri _attribute_'lerden okuyup güncelledik. Bu değerler değiştinde tepki verebilmek için de `observedAttributes` _getter_'ı ile bu iki property'i takibe aldık.

Yukarıdaki kod bloğunda bu bileşene özgü ( _scoped_) bir CSS yazımı örneği de var. shadowRoot içerisinde açtığımız `<style>` tag'lerinde yazdığımız tüm CSS deklarasyonları light DOM'da yer alan diğerlerinden bağımsız ve etkilenmez haldeler.

* * *

<div class="video-wrapper">
    <iframe class="lazy" width="560" height="315" title="Web Components" data-src="https://www.youtube.com/embed/IGDJyP_-p6A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
</div>

Bu projenin tamamlanmış haline ve diğer örneklerin de yer aldığı repoya [https://github.com/doganozturk/web-components](https://github.com/doganozturk/web-components) üzerinden erişebilirsiniz. Konu üzerine gerçekleştirdiğim sunuma da [buradan](https://youtu.be/IGDJyP_-p6A) ulaşabilirsiniz. Ayrıca bu örnekleri oluşturmam ve geliştirmem noktasında Web Components’i daha iyi anlamamı sağlayan ve örneklerinden yararlandığım Maximilian Schwarzmüller’in Udemy’deki [Web Components & Stencil.js — Build Custom HTML Elements](https://www.udemy.com/web-components-stenciljs-build-custom-html-elements/) dersini de konuyla ilgili herkese tavsiye ediyorum.

*\* Bu yazı ilk olarak [labs.zingat.com](https://labs.zingat.com) adresinde belirtilen tarihte yayımlanmıştır.*
