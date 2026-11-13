import { Preferences } from '@capacitor/preferences';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { createTestStore } from './store/createTestStore';

import type { StoreState } from '@/store';
import Account from '@/views/Account.vue';

const { push, alertCreate, testStore } = vi.hoisted(() => ({
  push: vi.fn(),
  alertCreate: vi.fn(),
  testStore: { current: null as unknown },
}));

vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/store', () => ({ useStore: () => testStore.current }));
vi.mock('@ionic/vue', async () => ({
  ...(await import('./ionicStubs')).ionTags(
    'IonPage',
    'IonHeader',
    'IonToolbar',
    'IonButtons',
    'IonBackButton',
    'IonContent',
    'IonList',
    'IonItem',
    'IonTitle',
  ),
  alertController: { create: alertCreate },
}));

type AlertOptions = {
  header: string;
  buttons: (string | { text: string; handler: (data: { username: string }) => void })[];
  inputs: { name: string; value: string }[];
};

let store: Store<StoreState>;

const mountAccount = async () => {
  const wrapper = mount(Account);
  await flushPromises();
  return wrapper;
};

const item = (wrapper: Awaited<ReturnType<typeof mountAccount>>, text: string) =>
  wrapper.findAll('ion-item').find((i) => i.text() === text)!;

enableAutoUnmount(afterEach);

beforeEach(async () => {
  vi.clearAllMocks();
  alertCreate.mockResolvedValue({ present: vi.fn() });
  await Preferences.clear();
  store = createTestStore();
  testStore.current = store;
  await store.dispatch('logIn', 'ionitron');
});

describe('Account', () => {
  it('shows the username', async () => {
    const wrapper = await mountAccount();

    expect(wrapper.find('h2').text()).toBe('ionitron');
  });

  it('changes and saves the username from the alert', async () => {
    const wrapper = await mountAccount();

    await item(wrapper, 'Change Username').trigger('click');
    await flushPromises();
    const options: AlertOptions = alertCreate.mock.calls[0][0];
    expect(options.header).toBe('Change Username');
    expect(options.inputs[0]).toMatchObject({ name: 'username', value: 'ionitron' });

    const ok = options.buttons.find((b) => typeof b !== 'string' && b.text === 'Ok') as Exclude<
      AlertOptions['buttons'][number],
      string
    >;
    ok.handler({ username: 'capacitor' });
    await flushPromises();

    expect(wrapper.find('h2').text()).toBe('capacitor');
    expect((await Preferences.get({ key: 'username' })).value).toBe('capacitor');
  });

  it('logs out and opens the login page', async () => {
    const wrapper = await mountAccount();

    await item(wrapper, 'Logout').trigger('click');
    await flushPromises();

    expect(store.state.user.isAuthenticated).toBe(false);
    expect((await Preferences.get({ key: 'hasLoggedIn' })).value).toBeNull();
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('opens support', async () => {
    const wrapper = await mountAccount();

    await item(wrapper, 'Support').trigger('click');

    expect(push).toHaveBeenCalledWith('/support');
  });
});
