import { Preferences } from '@capacitor/preferences';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { createTestStore } from './store/createTestStore';

import type { StoreState } from '@/store';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';

const { push, testStore } = vi.hoisted(() => ({ push: vi.fn(), testStore: { current: null as unknown } }));

vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/store', () => ({ useStore: () => testStore.current }));
vi.mock('/assets/img/appicon.svg', () => ({ default: '' }));
vi.mock('@ionic/vue', async () => {
  const { ionInput, ionTags } = await import('./ionicStubs');
  return {
    ...ionTags(
      'IonPage',
      'IonHeader',
      'IonToolbar',
      'IonButtons',
      'IonMenuButton',
      'IonButton',
      'IonContent',
      'IonTitle',
      'IonRow',
      'IonCol',
    ),
    IonInput: ionInput('ion-input'),
  };
});

type Wrapper = ReturnType<typeof mount>;

let store: Store<StoreState>;

const fill = async (wrapper: Wrapper, username: string, password: string) => {
  await wrapper.find('input[name="username"]').setValue(username);
  await wrapper.find('input[name="password"]').setValue(password);
};

const submit = async (wrapper: Wrapper) => {
  await wrapper.find('form').trigger('submit');
  await flushPromises();
};

// Ionic shows an input's error text when the input has both of these classes.
const showsError = (wrapper: Wrapper, field: string) => {
  const classes = wrapper.find(`input[name="${field}"]`).classes();
  return classes.includes('ion-touched') && classes.includes('ion-invalid');
};

enableAutoUnmount(afterEach);

beforeEach(async () => {
  push.mockClear();
  await Preferences.clear();
  store = createTestStore();
  testStore.current = store;
});

describe.each([
  { view: 'Login', component: Login },
  { view: 'Signup', component: Signup },
])('$view', ({ component }) => {
  it('logs in and opens the schedule when the username and password are filled in', async () => {
    const wrapper = mount(component);
    await fill(wrapper, 'ionitron', 'secret');

    await submit(wrapper);

    expect(store.state.user.isAuthenticated).toBe(true);
    expect(store.state.user.userName).toBe('ionitron');
    expect((await Preferences.get({ key: 'username' })).value).toBe('ionitron');
    expect(push).toHaveBeenCalledWith('/tabs/schedule');
  });

  it.each([
    { missing: 'username and password', username: '', password: '' },
    { missing: 'username', username: '', password: 'secret' },
    { missing: 'password', username: 'ionitron', password: '' },
  ])('stays on the form without a $missing', async ({ username, password }) => {
    const wrapper = mount(component);
    await fill(wrapper, username, password);

    await submit(wrapper);

    expect(push).not.toHaveBeenCalled();
    expect(store.state.user.isAuthenticated).toBe(false);
    expect(showsError(wrapper, 'username')).toBe(!username);
    expect(showsError(wrapper, 'password')).toBe(!password);
  });

  it('shows a required error once the field is touched, not before', async () => {
    const wrapper = mount(component);
    expect(showsError(wrapper, 'username')).toBe(false);
    expect(showsError(wrapper, 'password')).toBe(false);

    await wrapper.find('input[name="username"]').trigger('blur');

    expect(showsError(wrapper, 'username')).toBe(true);
    expect(showsError(wrapper, 'password')).toBe(false);

    await wrapper.find('input[name="username"]').setValue('ionitron');
    expect(showsError(wrapper, 'username')).toBe(false);
  });

  it('sets the required error messages', () => {
    const wrapper = mount(component);

    expect(wrapper.find('input[name="username"]').attributes('error-text')).toBe('Username is required');
    expect(wrapper.find('input[name="password"]').attributes('error-text')).toBe('Password is required');
  });
});

describe('Login', () => {
  it('opens signup from the Signup button', async () => {
    const wrapper = mount(Login);

    await wrapper
      .findAll('ion-button')
      .find((button) => button.text() === 'Signup')!
      .trigger('click');

    expect(push).toHaveBeenCalledWith('/signup');
  });
});
