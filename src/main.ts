const ORB_STATES = ['idle', 'listening', 'thinking', 'speaking', 'error'] as const;

type OrbState = (typeof ORB_STATES)[number];

type NeoOrbController = {
  readonly states: readonly OrbState[];
  getState: () => OrbState;
  setState: (nextState: OrbState | string) => OrbState;
};

const STATE_LABELS: Record<OrbState, string> = {
  idle: 'Idle mode: Neo is awake, calm, and ready.',
  listening: 'Listening mode: prepared for future microphone events.',
  thinking: 'Thinking mode: prepared for future reasoning and tool activity.',
  speaking: 'Speaking mode: prepared for future speech output.',
  error: 'Error mode: prepared for recoverable system feedback.'
};

declare global {
  interface Window {
    NeoOrb: NeoOrbController;
  }
}

function isOrbState(value: string): value is OrbState {
  return ORB_STATES.includes(value as OrbState);
}

function createNeoOrbController(root: HTMLElement): NeoOrbController {
  const stateCopy = root.querySelector<HTMLElement>('#state-copy');
  const stateButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-state]'));
  let currentState: OrbState = isOrbState(root.dataset.orbState ?? '') ? root.dataset.orbState : 'idle';

  if (!stateCopy) {
    throw new Error('Neo orb controller requires #state-copy.');
  }

  function setState(nextState: OrbState | string): OrbState {
    const state = isOrbState(nextState) ? nextState : 'idle';
    currentState = state;
    root.dataset.orbState = state;
    stateCopy.textContent = STATE_LABELS[state];

    stateButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.state === state));
    });

    return state;
  }

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest<HTMLButtonElement>('[data-state]');
    if (button?.dataset.state) {
      setState(button.dataset.state);
    }
  });

  setState(currentState);

  return {
    states: ORB_STATES,
    getState: () => currentState,
    setState
  };
}

const appShell = document.querySelector<HTMLElement>('.app-shell');

if (!appShell) {
  throw new Error('Neo interface requires .app-shell.');
}

// Future voice, AI, and automation modules can call window.NeoOrb.setState('listening').
window.NeoOrb = createNeoOrbController(appShell);

export {};
