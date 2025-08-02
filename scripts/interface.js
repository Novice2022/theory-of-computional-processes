const updateState = (inputId, state) => {
    state.setTokens(document.getElementById(inputId).value);

    // resetColors();
    // resetTransitionsColors();

    canExecute = true;
}

function resetStates() {
    resetTokens();
    resetColors();
    resetTransitionsColors();

    document.getElementById('a-setter').value = 2;
    document.getElementById('b-setter').value = 1;
    document.getElementById('c-setter').value = 3;
    document.getElementById('d-setter').value = 5;

    se.setTokens(2);
    sa.setTokens(1);
    sf.setTokens(3);
    sc.setTokens(5);

    document.getElementById('a-setter').focus();

    canExecute = true;
}

/**
 * 
 * @param { boolean } toState `on` or `off` 
 */
function setInterfaceDisabled(toState) {
    const controllers = document.getElementsByClassName('setter-controller');

    for (let i = 0; i < controllers.length; i++) {
        controllers.item(i).disabled = toState;
    }

    document.getElementById('run').disabled = toState;

    document.getElementById('iterate').disabled = !(toState && canExecute);
    document.getElementById('stop').disabled = !toState;
    
    const reachabilities = document.getElementsByClassName('reachability');

    for (let i = 0; i < reachabilities.length; i++) {
        reachabilities.item(i).disabled = !toState;
    }
}
