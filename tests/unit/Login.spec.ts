import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }));
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

const fill = async (wrapper: Wrapper, username: string, password: string) => {
  await wrapper.find('input[name="username"]').setValue(username);
  await wrapper.find('input[name="password"]').setValue(password);
};

enableAutoUnmount(afterEach);

beforeEach(() => {
  push.mockClear();
});

describe.each([
  { view: 'Login', component: Login },
  { view: 'Signup', component: Signup },
])('$view', ({ component }) => {
  it('opens the schedule when the username and password are filled in', async () => {
    const wrapper = mount(component);
    await fill(wrapper, 'ionitron', 'secret');

    await wrapper.find('form').trigger('submit');

    expect(push).toHaveBeenCalledWith('/tabs/schedule');
  });

  it.each([
    { missing: 'username and password', username: '', password: '' },
    { missing: 'username', username: '', password: 'secret' },
    { missing: 'password', username: 'ionitron', password: '' },
  ])('stays on the form without a $missing', async ({ username, password }) => {
    const wrapper = mount(component);
    await fill(wrapper, username, password);

    await wrapper.find('form').trigger('submit');

    expect(push).not.toHaveBeenCalled();
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
