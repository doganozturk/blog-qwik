---
layout: post
title: Decorator'leri Express.js Temel Konseptleri Üzerinden Anlamak
permalink: "/decoratorleri-expressjs-temel-konseptleri-uzerinden-anlamak/"
description: ES6 ya da diğer adıyla ES2015, 17 Haziran 2015'te standart haline geldi. Öncesinde ve tabii o günden bu yana asıl adıyla ECMAScript, yaygın kullandığımız haliyle JavaScript, Web'in gittikçe artan ihtiyaçlarına cevap vermeye çalışıyor. Her sene dilin özüne yeni konseptler ve yapılar ekleniyor.
date: 2020-01-02
---

# {{ title }}
{{ page.date | prettyDate }}

ES6 ya da diğer adıyla ES2015, 17 Haziran 2015'te standart haline geldi. Öncesinde ve tabii o günden bu yana asıl adıyla ECMAScript, yaygın kullandığımız haliyle JavaScript, Web'in gittikçe artan ihtiyaçlarına cevap vermeye çalışıyor. Her sene dilin özüne yeni konseptler ve yapılar ekleniyor. Bunlar, özleri itibariyle, JS tabanlı uygulamalar yazan bizler için işimizi daha da kolay yapmamızı sağlayacak, ölçeklendirilebilir ve yönetimi, bakımı ve geliştirilmesi daha rahat olacak kod temelleri oluşturmamızı sağlayan yenilikler.

Bu yazıda ele almak istediğim konu da aslında böyle bir *ekleme. Ecma International, Technical Committee 39,* ECMAScript dilinin kurallarını belirleyen, her sene dile eklenecek özelliklerin bünyesinde planlandığı, üyelerinin önerilerini sundukları, bunların tartışıldığı ve uygun bulunup üzerinde uzlaşmaya varılan özelliklerin standart altına alındığı bir kurul. Bu yazıda değineceğim Decorator'ler de şu anda *stage 2* aşamasında olan yeni bir konsept. Tabii yeni dediğime bakmayın, diğer birçok dilde benzer işlevleri gerçekleştiren yapılar var, JS dünyası için yeni diyelim. Güncel önerileri ve bulundukları aşamaları şuradan inceleyebilirsiniz: [https://github.com/tc39/proposals](https://github.com/tc39/proposals).

Decorator'ler JavaScript'e ES6 ile eklenen *Class* sentaksı üzerine yeni metaprogramming becerileri getiren, aslında temelinde daha okunabilir, işlevsel, bakımı ve yönetimi kolay soyutlamalar oluşturmamıza olanak sağlayacak bir dil özelliği. Wikipedia'daki tanımı ile *metaprogramming* bir bilgisayar programının başka bir programı yahut kendisini okuması, oluşturması, analiz etmesi ya da değiştirmesi anlamında kullanılan bir programlama tekniği. Bu bağlamda pratik olarak decorator'lerin JS'teki kullanımı ile nesne yönelimli bir programlama tasavvurunu daha da güçlü biçimde hayata geçirmemiz olanaklı hale geliyor.

Bunca sözün ardından daha pratik bir yaklaşım ile temel olarak bazı decorator tiplerinin örneklemleri üzerinden basit bir Node.js / Express.js MVC uygulaması örneği yazacağız ve buradaki Controller, Middleware, Router gibi temel Express.js kavramları ile bunları bağdaştıracağız.

Açıkçası anlatmaya başlayacağım bu örneğe benzer/yakın başka çalışmalar decorator'lerin pratik kullanımı açısından benim için ufuk açıcı oldu. Özellikle Node.js ve Express.js (yahut Koa, Fastify gibi diğer Node.js microframework'leri) özelinde uygulama geliştirme imkanınız olduysa buradaki yaklaşım sizler için de decorator'leri anlaşılır kılacaktır.

Başlangıç uygulamamız temel TypeScript boilerplate'i üzerine çok basit bir Express.js örneği:
```javascript
import express, { Request, Response, Router } from "express";
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;
const router = Router();

app.use(bodyParser.urlencoded({ extended: true }));

router.get('/user', (req: Request, res: Response): void => {
    res.send(`
    <div>
        <form action="/user" method="post">
            <div>
                <label for="name">Name:</label>
                <input type="text" name="name">
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" name="email">
            </div>
            <div>
                <label for="age">Age:</label>
                <input type="number" name="age">
            </div>
            <div>
                <label for="address">Address:</label>
                <input type="text" name="address">
            </div>
            <button>SEND</button>
        </form>
    </div>
    `);
});

router.post('/user', (req: Request, res: Response): void => {
    const { name, email, age, address } = req.body;

    res.send(`
      <div>
          <h1>USER INFO:</h1>
          <p>
              Name: ${name}
          </p>
          <p>
              Email: ${email}
          </p>
          <p>
              Age: ${age}
          </p>
          <p>
              Address: ${address}
          </p>
          <p>
              Is Admin: ${!!res.locals.isAdmin}
          </p>
      </div>
    `);
});

app.use(router);

app.listen(port, (): void => {
    console.log(`Server started on port ${port}`);
});
```
Görüldüğü üzere iki controller'ımız var. Bunlar `/user` path'inde GET ve POST isteklerini karşılıyorlar.

Kodumuz şu anki haliyle TypeScript uyumlu, çalıştırdığınızda TypeScript compiler'ı hata vermeyecektir; ancak tabii TypeScript kullanıyorsak kodumuzun daha az prosedürel, daha fazla OOP özellikleri taşımasını istiyor olmalıyız. Haliyle aklımıza şöyle bir API üzerinden controller'ı dizayn etmek ve yönetmek gelebilir:
```javascript
import { Request, Response } from "express";
import { Controller, Get, Post, Middleware } from "../decorators";
import { isAdmin, logger } from "../middlewares";

@Controller('/user')
export class UserController {
    @Get()
    getUser(req: Request, res: Response): void {
        res.send(`
            <div>
                <form action="/user" method="post">
                    <div>
                        <label for="name">Name:</label>
                        <input type="text" name="name">
                    </div>
                    <div>
                        <label for="email">Email:</label>
                        <input type="email" name="email">
                    </div>
                    <div>
                        <label for="age">Age:</label>
                        <input type="number" name="age">
                    </div>
                    <div>
                        <label for="address">Address:</label>
                        <input type="text" name="address">
                    </div>
                    <button>SEND</button>
                </form>
            </div>
        `);
    }

    @Post()
    @Middleware([logger, isAdmin])
    postUser(req: Request, res: Response): void {
        const { name, email, age, address } = req.body;

        res.send(`
            <div>
                <h1>USER INFO:</h1>
                <p>
                    Name: ${name}
                </p>
                <p>
                    Email: ${email}
                </p>
                <p>
                    Age: ${age}
                </p>
                <p>
                    Address: ${address}
                </p>
                <p>
                    Is Admin: ${!!res.locals.isAdmin}
                </p>
            </div>
        `);
    }
}
```
Günün sonunda ulaşmak istediğimiz kod yazım şekli bu olsun diyelim. Örnekte dikkatinizi çektiğini tahmin ettiğim `@Controller`, `@Get`, `@Post` ve `@Middleware` decorator'leri yer almakta. İşte bu decorator'leri oluşturarak bir TypeScript class'ına controller vazifesi yüklüyor olacağız. Class içerisinde tanımladığımız metodları da yine çeşitli decorator'ler ile `request handler` olarak atayacağız. Benzer şekilde `@Middleware` decorator factory'si ile request controller'a ulaşmadan onu istediğimiz middleware'lerden seçtiğimiz sıra ile geçirebileceğiz.

Decorator factory'ler invoke edildiklerinde decorator dönen fonksiyonlar basitçe. Bu örnekte kullandığımız tüm yapılar birer decorator factory. Çeşitli parametreler alıyorlar ya da alabilir durumdalar ve sonuçta UserController class'ını ve bu class'a ait metodları manipüle etmemizi sağlayan decorator'leri dönüyorlar. TypeScript'te beş çeşit decorator var: class, method, accessor, property ve parameter decorator'leri. Bu yazıda class ve method örneklerini inceliyor olacağız.

Controller'a ait metodların birer request handler olmasını sağlayan decorator'ümüzle başlayalım:
```javascript
import { HttpMethods, ControllerDecoratorParams } from "../enums";

function createRouteMethod(method: HttpMethods) {
    return function(path?: string): Function {
        return function(target: any, propertyKey: string): void {
            Reflect.defineMetadata(ControllerDecoratorParams.Path, path, target, propertyKey);
            Reflect.defineMetadata(ControllerDecoratorParams.Method, method, target, propertyKey);
        }
    }
}

export const Get = createRouteMethod(HttpMethods.Get);
export const Post = createRouteMethod(HttpMethods.Post);
export const Put = createRouteMethod(HttpMethods.Put);
export const Patch = createRouteMethod(HttpMethods.Patch);
export const Delete = createRouteMethod(HttpMethods.Delete);
```
Aslında yaptığı son derece basit: Tüm HTTP metodları için teker teker yazmaktansa günün sonunda kullanacağımız decorator factory'yi dönen `createRouteMethod` adında bir fonksiyonumuz var. 'get', 'post' gibi bir string değer alıyor aslında, TypeScript dünyasında olduğumuz için bu parametreleri bir enum üzerinden yönetme şansımız var. Decorator factory'nin kendisi bir `path` parametresi alıyor, '/user' path'ine GET request'i yapılıyor gibi düşünebilirsiniz, ve decorator'ün kendisini dönüyor nihayetinde. Decorator fonksiyonunun içerisinde de dışarıdan aldığımız `path` ve hangi HTTP metodunu karşıladığımızı gösteren `method` parametrelerini daha sonra kullanmak üzere metadata olarak saklıyoruz

Request handler bazlı middleware yapısını kullanmamızı sağlayan decorator emsalimiz ise şu şekilde:
```javascript
import { ControllerDecoratorParams } from "../enums";
import { RequestHandler } from "express";

export function Middleware(middlewares: RequestHandler[]): Function {
    return function(target: any, propertyKey: string): void {
        Reflect.defineMetadata(ControllerDecoratorParams.Middleware, middlewares, target, propertyKey);
    }
}
```
Bu decorator factory'ye de istediğimiz middleware fonksiyonlarını (klasik middleware fonksiyonları olarak düşünün bunları) bir Array olarak veriyoruz ve nihayetinde yine metadata olarak bu Array'i saklıyoruz.

Sakladığımız bu bilgiyi runtime'ın başında UserController class'ımızın işleyip kurduğumuz mimarinin çalışmasını sağlayacak ana unsur ise @Controller decorator'ü:
```javascript
import { AppRouter } from "../router/AppRouter";
import { HttpMethods, ControllerDecoratorParams } from "../enums";
import { RequestHandler } from "express";

export function Controller(path: string): Function {
    return function(target: any): void {
        const router = AppRouter.router;

        for (const _action in target.prototype) {
            if (target.prototype.hasOwnProperty(_action)) {
                const _path: string = Reflect.getMetadata(ControllerDecoratorParams.Path, target.prototype, _action) || '';
                const method: HttpMethods = Reflect.getMetadata(ControllerDecoratorParams.Method, target.prototype, _action);
                const middlewares: RequestHandler[] = Reflect.getMetadata(ControllerDecoratorParams.Middleware, target.prototype, _action) || [];

                router[method](`${path}${_path}`, middlewares, target.prototype[_action]);
            }
        }
    }
}
```
Burada UserController class'ına tanımladığımız tüm metodları dönüyor ve herbiri için eğer varsa tanımlı metadata'yı dışarı çıkarıp istediğimiz tanımlamaları singleton olarak tasarladığımız router'ımız yardımıyla yapıyoruz. Burada dinamik olarak yaptığımız şey aşağıdaki çıktıyı oluşturuyor:
```javascript
router.get('/user', [], getUser);
router.post('/user', [logger, isAdmin], postUser);
```
İfade etmeye çalıştığım yapının benzerleri ve çok daha profesyonelce hazırlanmış, kullanılabilir halleri için [Nest.js](https://nestjs.com), [Ts.ED](https://tsed.io) gibi popüler projeleri inceleyebilirsiniz.

Bu yazıda kod kullandığım projeye [https://github.com/doganozturk/express-typescript-decorators](https://github.com/doganozturk/express-typescript-decorators) adresi üzerinden ulaşabilir, inceleyebilirsiniz.

*\* Bu yazı ilk olarak [labs.zingat.com](https://labs.zingat.com) adresinde belirtilen tarihte yayımlanmıştır.*
