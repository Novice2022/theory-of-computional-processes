const STATE_DIAMETER_PX = 35 + 10 * 2 + 2;
const TRANSITION_HEIGHT_PX = 6;

const manageStatesLabels = () => {
    let labels = document.getElementsByClassName('state-label');

    for (let i = 0; i < labels.length; i++) {
        const label = labels.item(i);

        const height = label.offsetHeight;
        const width = label.offsetWidth;

        if ([
            'state-limit-to-out',
            'state-in'
        ].includes(label.parentElement.id)) {
            label.style.top = `${ STATE_DIAMETER_PX + height }px`;
            label.style.left = `-${ (width - STATE_DIAMETER_PX) / 2 }px`;
        }
        else if ([
            'state-ready-to-consume',
            'state-limit-to-in',
            'state-ready-to-produce'
        ].includes(label.parentElement.id)) {
            label.style.left = `-${ (width - STATE_DIAMETER_PX) / 2 }px`;
        } else {
            label.style.top = `${ STATE_DIAMETER_PX / 2 + height / 2 }px`;
            label.style.left = `-${ width + 10 }px`;
        }

        label.parentElement.style.marginTop = `-${height}px`;
    }    
}

const manageTransitionsLabels = () => {
    let labels = document.getElementsByClassName('transition-label');

    for (let i = 0; i < labels.length; i++) {
        const label = labels.item(i);

        const height = label.offsetHeight;
        const width = label.offsetWidth;

        label.style.top = `${ TRANSITION_HEIGHT_PX / 2 + height / 2 }px`;
        label.style.left = `-${ width + 10 }px`;

        label.parentElement.style.marginTop = `-${height}px`;
    }    
}


function manageDom() {
    manageStatesLabels();
    manageTransitionsLabels();
}

function finishDomManaging() {
    document.getElementById('run').focus();
}
