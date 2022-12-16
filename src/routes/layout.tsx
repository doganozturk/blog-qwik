import { component$, Slot } from '@builder.io/qwik';
import { Footer } from "~/components/footer/footer";

export default component$(() => {
  return (
    <div class="container">
      <Slot name="header"/>
      <Slot />
      <Footer/>
    </div>
  );
});
