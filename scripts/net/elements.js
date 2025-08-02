class State {
    constructor(element, tokens = 0) {
        this.element = element;
        this.tokens = tokens;
    }

    setTokens(count) {
        this.tokens = count;
        this.element.getElementsByTagName('p')[0].textContent = count;
    }

    incrementTokens() {
        this.setTokens(this.tokens + 1);
    }

    decrementTokens() {
        this.setTokens(this.tokens - 1);
    }
}

class Transition {
    constructor(element, inputArcs = [], outputArcs = []) {
        this.element = element;
        this.inputArcs = inputArcs;
        this.outputArcs = outputArcs;
    }

    isEnabled() {
        return this.inputArcs.every(
            arc => arc.source.tokens > 0
        );
    }

    execute() {
        if (!this.isEnabled()) throw new Error("Transition is not enabled");

        this.inputArcs.forEach(arc => {
            arc.source.decrementTokens();
        });

        this.outputArcs.forEach(arc => {
            arc.destination.incrementTokens();
        });
    }
}

class Arc {
    constructor(element, source, destination) {
        this.element = element;
        this.source = source;
        this.destination = destination;
    }
}
