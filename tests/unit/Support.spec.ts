import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Support from '@/views/Support.vue';

const { toastCreate, present } = vi.hoisted(() => ({ toastCreate: vi.fn(), present: vi.fn() }));

vi.mock('/assets/img/appicon.svg', () => ({ default: '' }));
vi.mock('@ionic/vue', async () => {
  const { ionInput, ionTags } = await import('./ionicStubs');
  return {
    ...ionTags('IonPage', 'IonHeader', 'IonToolbar', 'IonButtons', 'IonMenuButton', 'IonButton', 'IonContent'),
    ...ionTags('IonTitle', 'IonRow', 'IonCol'),
    IonTextarea: ionInput('ion-textarea'),
    toastController: { create: toastCreate },
  };
});

const toastMessages = () => toastCreate.mock.calls.map(([options]) => options.message);

const mountSupport = async () => {
  const wrapper = mount(Support);
  await flushPromises();
  return wrapper;
};

enableAutoUnmount(afterEach);

beforeEach(() => {
  vi.clearAllMocks();
  toastCreate.mockResolvedValue({ present });
});

describe('Support', () => {
  it('warns that support requests are not really sent', async () => {
    await mountSupport();

    expect(toastMessages()).toEqual(['This does not actually send a support request.']);
    expect(present).toHaveBeenCalledTimes(1);
  });

  it('confirms a sent message and clears the form', async () => {
    const wrapper = await mountSupport();
    await wrapper.find('textarea').setValue('The schedule is great!');

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(toastMessages()).toContain('Your support request has been sent.');
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('');
  });

  it('does not send an empty message', async () => {
    const wrapper = await mountSupport();

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(toastMessages()).not.toContain('Your support request has been sent.');
  });
});
