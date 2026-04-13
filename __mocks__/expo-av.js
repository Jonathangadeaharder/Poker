export const Audio = {
  Sound: {
    createAsync: jest.fn(() => Promise.resolve({
      sound: { playAsync: jest.fn(), unloadAsync: jest.fn() },
      status: {},
    })),
  },
  setAudioModeAsync: jest.fn(() => Promise.resolve()),
};
