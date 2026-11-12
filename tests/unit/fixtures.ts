import type { Mock } from 'vitest';
import { vi } from 'vitest';

// A trimmed-down /data/data.json with the same shape as the real one.
export const conferenceData = {
  schedule: [
    {
      date: '2047-05-17',
      groups: [
        {
          time: '8:00 am',
          sessions: [
            {
              id: '1',
              name: 'Breakfast',
              timeStart: '8:00 am',
              timeEnd: '9:00 am',
              location: 'Dining Hall',
              tracks: ['Food'],
            },
          ],
        },
        {
          time: '9:15 am',
          sessions: [
            {
              id: '2',
              name: 'Getting Started with Ionic',
              timeStart: '9:30 am',
              timeEnd: '9:45 am',
              location: 'Hall 2',
              description: 'Mobile devices and browsers are now advanced enough...',
              speakerNames: ['Ted Turtle'],
              tracks: ['Ionic'],
            },
            {
              id: '3',
              name: 'Ionic Tooling',
              timeStart: '9:45 am',
              timeEnd: '10:00 am',
              location: 'Executive Ballroom',
              speakerNames: ['Rachel Rabbit'],
              tracks: ['Tooling'],
            },
            {
              id: '4',
              name: 'University of Ionic',
              timeStart: '9:15 am',
              timeEnd: '9:30 am',
              location: 'Hall 3',
              speakerNames: ['Ellie Elephant'],
              tracks: ['Ionic'],
            },
          ],
        },
        {
          time: '10:00 am',
          sessions: [
            {
              id: '5',
              name: 'Migrating to Vue',
              timeStart: '10:00 am',
              timeEnd: '10:15 am',
              location: 'Hall 1',
              speakerNames: ['Rachel Rabbit', 'Ted Turtle'],
              tracks: ['Ionic', 'Vue'],
            },
          ],
        },
      ],
    },
  ],
  speakers: [
    {
      id: '1',
      name: 'Ted Turtle',
      profilePic: '/assets/img/speakers/turtle.jpg',
      twitter: 'ionicframework',
      about: 'Ted is a Turtle.',
      title: 'Software Engineer',
      location: 'Everywhere',
      email: 'ted@example.com',
      phone: '+1-541-754-3010',
    },
    {
      id: '2',
      name: 'Ellie Elephant',
      profilePic: '/assets/img/speakers/elephant.jpg',
    },
    {
      id: '3',
      name: 'Rachel Rabbit',
      profilePic: '/assets/img/speakers/rabbit.jpg',
      title: 'Software Engineer',
    },
  ],
  map: [
    { name: 'Monona Terrace Convention Center', lat: 43.071584, lng: -89.38012, center: true },
    { name: 'Ionic HQ', lat: 43.074395, lng: -89.381056 },
  ],
  tracks: [
    { name: 'Vue', icon: 'logo-vue' },
    { name: 'Food', icon: 'restaurant' },
    { name: 'Ionic', icon: 'logo-ionic' },
    { name: 'Tooling', icon: 'hammer' },
  ],
};

/* Stubs fetch so every request answers with `body` (a copy of the fixture by default). */
export const stubFetch = (body: unknown = structuredClone(conferenceData), ok = true): Mock => {
  const fetch = vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
};
