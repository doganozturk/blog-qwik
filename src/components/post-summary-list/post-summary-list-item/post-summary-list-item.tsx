import { component$, useStylesScoped$ } from "@builder.io/qwik";

import styles from "./post-summary-list-item.css?inline";

export const PostSummaryListItem = component$(() => {
  useStylesScoped$(styles);

  return (
    <a href="/" className="post-summary-list-item">
      <h2 className="title">JavaScript Temelleri: Hoisting</h2>
      <p className="date">2 yıldan fazla önce</p>
      <p className="summary">
        Zingat'ta yazılımcılarla gerçekleştirdiğimiz iş görüşmelerinde sıklıkla karşılaştığımız problemlerden biri adayların kullandıkları dilin temel unsurlarıyla ilişkilerinin bir miktar kopuk olması. Çoğu genç arkadaş güncel web framework'leriyle (React, Vue vs.) yahut JS temelli cross-platform geliştirme ortamlarıyla (React-Native, Ionic vs.) ilgilenmiş oluyor; ancak JavaScript'in hikayesinden ya da dil ve dilin çalıştığı ortamların gerçeklerinden uzak durumdalar.
      </p>
    </a>
  )
});