import type { Component } from 'vue';
import { defineComponent, h } from 'vue';

/** Renders an Ionic component as its own tag with its default slot, so tests can find it. */
export const ionTag = (name: string): Component =>
  defineComponent({
    setup:
      (_, { slots }) =>
      () =>
        h(name, slots.default?.()),
  });

/** Stubs for each named Ionic component, e.g. `ionTags('IonPage')` gives `{ IonPage: <ion-page> }`. */
export const ionTags = (...names: string[]): Record<string, Component> =>
  Object.fromEntries(names.map((name) => [name, ionTag(name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())]));

/**
 * A v-model stub for ion-input and ion-textarea. Other attributes (such as its class and error-text)
 * land on the native element, and blurring it emits ionBlur.
 */
export const ionInput = (name: string): Component =>
  defineComponent({
    props: { modelValue: { type: String, default: '' } },
    emits: ['update:modelValue', 'ionBlur'],
    setup:
      (props, { emit, attrs }) =>
      () =>
        h(name === 'ion-textarea' ? 'textarea' : 'input', {
          name: attrs.name,
          value: props.modelValue,
          onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value),
          onBlur: () => emit('ionBlur'),
        }),
  });
