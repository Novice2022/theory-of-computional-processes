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
    document.getElementById('tree-button').disabled = true;
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
    document.getElementById('tree').innerHTML = '<h2>Дерево достижимости</h2>';

    const container = d3.select('#tree').html('')
        .style('overflow', 'auto')
        .style('max-height', '90vh');

    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', '800');

    const g = svg.append('g')
        .attr('transform', 'translate(100, 50)');

    class StateCopy {
        constructor(state) {
            this.tokens = state.tokens;
            this.name = state.element.getAttribute('name');
        }
    }

    class TransitionCopy {
        constructor(transition) {
            this.name = transition.element.getAttribute('name');
            this.inputs = transition.inputArcs.map(arc => ({
                source: arc.source.element.getAttribute('name')
            }));
            this.outputs = transition.outputArcs.map(arc => ({
                destination: arc.destination.element.getAttribute('name')
            }));
        }

        isEnabled(states) {
            return this.inputs.every(input => states[input.source].tokens > 0);
        }

        execute(states) {
            const newStates = {...states};
            this.inputs.forEach(input => {
                newStates[input.source] = new StateCopy({
                    element: { getAttribute: () => input.source },
                    tokens: newStates[input.source].tokens - 1
                });
            });
            this.outputs.forEach(output => {
                newStates[output.destination] = new StateCopy({
                    element: { getAttribute: () => output.destination },
                    tokens: newStates[output.destination].tokens + 1
                });
            });
            return newStates;
        }
    }

    const initialState = {
        sa: new StateCopy(sa),
        sb: new StateCopy(sb),
        sc: new StateCopy(sc),
        sd: new StateCopy(sd),
        se: new StateCopy(se),
        sf: new StateCopy(sf),
        sg: new StateCopy(sg)
    };

    const transitions = [
        new TransitionCopy(ta),
        new TransitionCopy(tb),
        new TransitionCopy(tc)
    ];

    const treeData = {
        id: 'root',
        name: formatMarking(initialState),
        marking: initialState,
        children: []
    };

    const visited = new Map();
    visited.set(treeData.name, treeData);

    const queue = [{ marking: initialState, parent: treeData }];

    function formatMarking(marking) {
        return `M${Object.values(marking).map(s => s.tokens).join(',')}`;
    }

    while (queue.length > 0) {
        const { marking, parent } = queue.shift();
        const currentKey = formatMarking(marking);

        transitions.forEach(transition => {
            if (transition.isEnabled(marking)) {
                const newMarking = transition.execute(JSON.parse(JSON.stringify(marking)));
                const newKey = formatMarking(newMarking);

                if (!visited.has(newKey)) {
                    const newNode = {
                        id: `${parent.id}-${transition.name}`,
                        name: newKey,
                        marking: newMarking,
                        transition: transition.name,
                        children: []
                    };
                    parent.children.push(newNode);
                    visited.set(newKey, newNode);
                    queue.push({ marking: newMarking, parent: newNode });
                } else {
                    parent.children.push({
                        id: `${parent.id}-ref-${transition.name}`,
                        name: newKey,
                        isReference: true,
                        referenceTo: visited.get(newKey)
                    });
                }
            }
        });
    }

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([1000, 600]);
    treeLayout(root);

    const links = g.selectAll('.link')
        .data(root.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y))
        .attr('stroke', '#999')
        .attr('fill', 'none');

    const nodeGroups = g.selectAll('.node')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

    nodeGroups.append('circle')
        .attr('r', 10)
        .attr('fill', d => d.data.isReference ? '#ff7f0e' : '#1f77b4')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('mouseover', function(event, d) {
            tooltip.style('visibility', 'visible')
                   .html(`<strong>${d.data.name}</strong><br>${getMarkingDetails(d.data.marking || d.data.referenceTo.marking)}`);
        })
        .on('mousemove', function(event) {
            tooltip.style('top', (event.pageY - 10) + 'px')
                  .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', function() {
            tooltip.style('visibility', 'hidden');
        });

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'white')
        .style('border', '1px solid #ddd')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('box-shadow', '2px 2px 6px rgba(0,0,0,0.1)')
        .style('z-index', '1000');

    function getMarkingDetails(marking) {
        return Object.entries(marking)
            .map(([name, state]) => `${name}: ${state.tokens}`)
            .join('<br>');
    }

    const transitionLabels = g.selectAll('.transition-label')
        .data(root.links().filter(d => d.source.data.transition))
        .enter().append('text')
        .attr('class', 'transition-label')
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 15)  // Сдвиг выше
        .attr('dx', d => {
            // Сдвигаем влево или вправо в зависимости от направления
            const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
            return Math.cos(angle) * 15;
        })
        .text(d => d.source.data.transition)
        .style('font-size', '12px')
        .style('text-anchor', 'middle')
        .style('fill', '#000')  // Чёрный цвет
        .style('font-weight', 'bold')
        .style('paint-order', 'stroke')  // Обводка текста
        .style('stroke', '#fff')  // Белая обводка
        .style('stroke-width', '3px')  // Толщина обводки
        .style('stroke-linecap', 'round')
        .style('stroke-linejoin', 'round');

    svg.attr('height', d3.max(root.descendants(), d => d.y) + 200);
    svg.attr('width', d3.max(root.descendants(), d => d.x) + 200);

    d3.select('head').append('style').text(`
        .tooltip { font-family: Arial; font-size: 12px; }
        .node circle { cursor: pointer; }
        .transition-label { font-weight: bold; pointer-events: none; }
    `);

    document.getElementById('tree-button').disabled = true;
    treeCreated = true;
}


let canExecute = true;
let matrixTableBodyElement = document
    .getElementById('reachability-matrix')
    .getElementsByTagName('tbody')[0];
let treeCreated = false;
let iterationsCounter = 0;
