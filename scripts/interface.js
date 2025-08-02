function updateState(inputId, stateComponentId) {
    const input = document.getElementById(inputId);

    stateComponent = document.getElementById(stateComponentId);
    stateComponent.getElementsByTagName('p')[0].textContent = input.value;
}

function resetStates() {
    const inputs = document.getElementsByTagName('input');
    
    for (let i = 0; i < inputs.length; i++) {
        inputs.item(i).value = 0;
    }

    document.getElementById('a-setter').focus();
}

/**
 * 
 * @param { boolean } toState `on` or `off` 
 */
function setInterfaceDisabled(toState) {
    const setters = document.getElementsByClassName('setter');

    for (let i = 0; i < setters.length; i++) {
        const setter = setters.item(i);

        setter.getElementsByTagName('button')[0].disabled =
        setter.getElementsByTagName('input')[0].disabled =
            toState;
    }
}

function iterate() {
    
}

function getReachabilityTree() {
    
}

function getReachabilityMatrix() {

}
