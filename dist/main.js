const ORB_STATES = ['idle', 'listening', 'thinking', 'speaking', 'error'];
const STATE_LABELS = {
    idle: 'Idle mode: Neo is awake, calm, and ready.',
    listening: 'Listening mode: prepared for future microphone events.',
    thinking: 'Thinking mode: prepared for future reasoning and tool activity.',
    speaking: 'Speaking mode: prepared for future speech output.',
    error: 'Error mode: prepared for recoverable system feedback.'
};
function isOrbState(value) {
    return ORB_STATES.includes(value);
}
function createNeoOrbController(root) {
    const stateCopy = root.querySelector('#state-copy');
    const stateButtons = Array.from(root.querySelectorAll('[data-state]'));
    let currentState = isOrbState(root.dataset.orbState ?? '') ? root.dataset.orbState : 'idle';
    if (!stateCopy) {
        throw new Error('Neo orb controller requires #state-copy.');
    }
    function setState(nextState) {
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
        const button = target.closest('[data-state]');
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
const appShell = document.querySelector('.app-shell');
if (!appShell) {
    throw new Error('Neo interface requires .app-shell.');
}
window.NeoOrb = createNeoOrbController(appShell);
export {};
