class State {
    /**
     * 
     * @param { HTMLDivElement } element 
     * @param { number | null } tokens 
     */
    constructor(element, tokens = 0) {
        this.element = element;
        this.tokens = tokens;
    }

    /**
     * 
     * @param { number } count 
     */
    setTokens(count) {
        this.tokens = count;
        this.element.getElementsByTagName('p')[0].innerHTML =
            `<span class="state-value">${count}</span>`;
    }
    
    incrementTokens() {
        this.setTokens(this.tokens + 1);
    }

    decrementTokens() {
        this.setTokens(this.tokens - 1);
    }
}

class Transition {
    /**
     * 
     * @param { HTMLDivElement } element 
     * @param { Input[] } inputArcs 
     * @param { Output[] } outputArcs 
     */
    constructor(element, inputArcs = [], outputArcs = []) {
        this.element = element;
        this.inputArcs = inputArcs;
        this.outputArcs = outputArcs;
    }

    isEnabled() {
        return this.inputArcs.every(
            input => input.source.tokens > 0
        );
    }

    execute() {
        if (!this.isEnabled()) throw new Error("Transition is not enabled");

        this.inputArcs.forEach(input => {
            input.source.decrementTokens();
        });

        this.outputArcs.forEach(output => {
            output.destination.incrementTokens();
        });
    }

    drawSuccess() {
        this.inputArcs.forEach(input => input.arc.setColor('green'));
        this.element.getElementsByClassName('transition-rect')[0].style.borderColor = 'green';
        this.outputArcs.forEach(output => output.arc.setColor('green'));
    }

    drawFail() {
        this.inputArcs.filter(input => input.source.tokens <= 0).forEach(input => {
            input.arc.setColor('red');
        });
        this.element.getElementsByClassName('transition-rect')[0].style.borderColor = 'red';
    }
}

class Arc {
    /**
     * 
     * @param { HTMLDivElement } element 
     */
    constructor(element) {
        this.element = element;
    }
    
    /**
     * 
     * @param { string } color CSS color representation
     */
    setColor(color) {
        const lines = this.element.getElementsByClassName('arc-line');

        for (let i = 0; i < lines.length; i++) {
            lines.item(i).style.borderColor = color;
        }
    }
}

class Input {
    /**
     * 
     * @param { State } source 
     * @param { Arc } arc 
     */
    constructor(source, arc) {
        this.source = source;
        this.arc = arc;
    }
}

class Output {
    /**
     * 
     * @param { State } destination 
     * @param { Arc } arc 
     */
    constructor(destination, arc) {
        this.destination = destination;
        this.arc = arc;
    }
}


const
    sa = new State(document.getElementsByName('sa')[0], 1),
    sb = new State(document.getElementsByName('sb')[0], 0),
    sc = new State(document.getElementsByName('sc')[0], 0),
    sd = new State(document.getElementsByName('sd')[0], 0),
    se = new State(document.getElementsByName('se')[0], 2),
    sf = new State(document.getElementsByName('sf')[0], 0),
    sg = new State(document.getElementsByName('sg')[0], 0);

const resetTokens = () => {
    [ sa, sb, sc, sd, se, sf, sg ].forEach(state => state.setTokens(0));
}

const
    sa_to_ta = new Arc(document.getElementById('sa-to-ta')),
    ta_to_sb = new Arc(document.getElementById('ta-to-sb')),
    sb_to_tc = new Arc(document.getElementById('sb-to-tc')),
    sc_to_tc = new Arc(document.getElementById('sc-to-tc')),
    tc_to_sd = new Arc(document.getElementById('tc-to-sd')),
    ta_to_sf = new Arc(document.getElementById('ta-to-sf')),
    sf_to_tb = new Arc(document.getElementById('sf-to-tb')),
    se_to_tb = new Arc(document.getElementById('se-to-tb')),
    tb_to_se = new Arc(document.getElementById('tb-to-se')),
    tb_to_sg = new Arc(document.getElementById('tb-to-sg')),
    sg_to_ta = new Arc(document.getElementById('sg-to-ta')),
    tc_to_sa = new Arc(document.getElementById('tc-to-sa'));

const resetColors = () => {
    [
        sa_to_ta,
        ta_to_sb,
        sb_to_tc,
        sc_to_tc,
        tc_to_sd,
        ta_to_sf,
        sf_to_tb,
        se_to_tb,
        tb_to_se,
        tb_to_sg,
        sg_to_ta,
        tc_to_sa
    ].forEach(arc => arc.setColor('black'));
}

const
    ta = new Transition(
        document.getElementsByName('ta')[0],
        [
            new Input(sa, sa_to_ta),
            new Input(sg, sg_to_ta)
        ],
        [
            new Output(sb, ta_to_sb),
            new Output(sf, ta_to_sf)
        ]
    ),
    tb = new Transition(
        document.getElementsByName('tb')[0],
        [
            new Input(sf, sf_to_tb),
            new Input(se, se_to_tb)
        ],
        [
            new Output(se, tb_to_se),
            new Output(sg, tb_to_sg)
        ]
    ),
    tc = new Transition(
        document.getElementsByName('tc')[0],
        [
            new Input(sb, sb_to_tc),
            new Input(sc, sc_to_tc)
        ],
        [
            new Output(sa, tc_to_sa),
            new Output(sd, tc_to_sd)
        ]
    );

const resetTransitionsColors = () => {
    [ ta, tb, tc ].forEach(transition => {
        transition.element.getElementsByClassName('transition-rect')[0].style.borderColor = 'black';
    });
}


function iterate() {
    resetColors();
    
    const transitions = [ta, tb, tc];
    const shouldExecute = [false, false, false];

    transitions.forEach((transition, i) => {
        if (transition.isEnabled())
            shouldExecute[i] = true;
    });


    transitions.filter((_, i) => {
        return !shouldExecute[i];
    }).map(transition => {
        transition.drawFail();
    });
    
    transitions.filter((_, i) => {
        return shouldExecute[i];
    }).map(transition => {
        transition.execute();
        transition.drawSuccess();
    });


    transitions.forEach((transition, i) => {
        if (transition.isEnabled())
            shouldExecute[i] = true;
    });

    if (shouldExecute.every(element => !element)) {
        canExecute = false;
        document.getElementById('iterate').disabled = true;
        document.getElementById('matrix-button').disabled = true;
    }

    addStatesIntoMatrix();
}

function addStatesIntoMatrix() {
    matrixTableBodyElement.innerHTML += `
                        <tr>
                            <td>M${ iterationsCounter }</td>
                            <td>${ sa.tokens }</td>
                            <td>${ sb.tokens }</td>
                            <td>${ sc.tokens }</td>
                            <td>${ sd.tokens }</td>
                            <td>${ se.tokens }</td>
                            <td>${ sf.tokens }</td>
                            <td>${ sg.tokens }</td>
                        </tr>`;

    iterationsCounter++;
}

function getReachabilityMatrix() {
    while (canExecute) {
        iterate();
    }
}

function getReachabilityTree() {
    
}


let canExecute = true;
let matrixTableBodyElement = document
    .getElementById('reachability-matrix')
    .getElementsByTagName('tbody')[0];

let iterationsCounter = 0;
