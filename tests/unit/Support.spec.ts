import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Support from '@/views/Support.vue';

const { toastCreate, present, alertCreate, leaveGuard } = vi.hoisted(() => ({
  toastCreate: vi.fn(),
  present: vi.fn(),
  alertCreate: vi.fn(),
  leaveGuard: { current: null as null | (() => Promise<boolean>) },
}));

vi.mock('/assets/img/appicon.svg', () => ({ default: '' }));
vi.mock('vue-router', () => ({
  onBeforeRouteLeave: (guard: () => Promise<boolean>) => {
    leaveGuard.current = guard;
  },
}));
vi.mock('@ionic/vue', async () => {
  const { ionInput, ionTags } = await import('./ionicStubs');
  return {
    ...ionTags('IonPage', 'IonHeader', 'IonToolbar', 'IonButtons', 'IonMenuButton', 'IonButton', 'IonContent'),
    ...ionTags('IonTitle', 'IonRow', 'IonCol'),
    IonTextarea: ionInput('ion-textarea'),
    alertController: { create: alertCreate },
    toastController: { create: toastCreate },
  };
});

type AlertOptions = { header: string; message: string; buttons: { text: string; role: string }[] };

// Answers the leave alert with the button that has this role.
const answerLeaveAlert = (role: string) =>
  alertCreate.mockResolvedValue({ present: vi.fn(), onDidDismiss: () => Promise.resolve({ role }) });

// Runs the page's leave guard; true lets the navigation continue.
const leave = () => leaveGuard.current!();

const toastMessages = () => toastCreate.mock.calls.map(([options]) => options.message);

// Ionic shows the textarea's error text when it has both of these classes.
const showsError = (wrapper: ReturnType<typeof mount>) => {
  const classes = wrapper.find('textarea').classes();
  return classes.includes('ion-touched') && classes.includes('ion-invalid');
};

const mountSupport = async () => {
  const wrapper = mount(Support);
  await flushPromises();
  return wrapper;
};

enableAutoUnmount(afterEach);

beforeEach(() => {
  vi.clearAllMocks();
  toastCreate.mockResolvedValue({ present });
  leaveGuard.current = null;
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

  it('does not send an empty message and shows the required error', async () => {
    const wrapper = await mountSupport();
    expect(showsError(wrapper)).toBe(false);

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(toastMessages()).not.toContain('Your support request has been sent.');
    expect(showsError(wrapper)).toBe(true);
    expect(wrapper.find('textarea').attributes('error-text')).toBe('Support message is required');
  });

  it('shows the required error once the message is touched', async () => {
    const wrapper = await mountSupport();

    await wrapper.find('textarea').trigger('blur');

    expect(showsError(wrapper)).toBe(true);
  });

  it('does not show the required error after a message is sent', async () => {
    const wrapper = await mountSupport();
    await wrapper.find('textarea').setValue('The schedule is great!');
    await wrapper.find('textarea').trigger('blur');

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(showsError(wrapper)).toBe(false);
  });

  it('leaves without asking when the message is empty or blank', async () => {
    const wrapper = await mountSupport();

    expect(await leave()).toBe(true);

    await wrapper.find('textarea').setValue('   ');
    expect(await leave()).toBe(true);
    expect(alertCreate).not.toHaveBeenCalled();
  });

  it('asks before leaving with an unsent message and stays on Stay', async () => {
    const wrapper = await mountSupport();
    await wrapper.find('textarea').setValue('Unsent message');
    answerLeaveAlert('cancel');

    expect(await leave()).toBe(false);

    const [options] = alertCreate.mock.calls[0] as [AlertOptions];
    expect(options.header).toBe('Leave this page?');
    expect(options.message).toBe(
      'Are you sure you want to leave this page? Your support message will not be submitted.',
    );
    expect(options.buttons).toEqual([
      { text: 'Stay', role: 'cancel' },
      { text: 'Leave', role: 'confirm' },
    ]);
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('Unsent message');
  });

  it('leaves with an unsent message on Leave', async () => {
    const wrapper = await mountSupport();
    await wrapper.find('textarea').setValue('Unsent message');
    answerLeaveAlert('confirm');

    expect(await leave()).toBe(true);
    expect(alertCreate).toHaveBeenCalledTimes(1);
  });
});
