class ShipGameHandler {
    constructor(logger = new ConsoleLogger) {
        this.gameState = gameStates.Idle;
        this.updateIntervalSec = 0.02;
        this.updateIntervalId = setInterval(() => this.update(), this.updateIntervalSec * 1000);
        this.cachedTime = 0;
        this.builder1 = new ShipBuilder(logger);
        this.builder2 = new ShipBuilder(logger);
        this.ship1 = this.builder1.build();
        this.ship2 = this.builder2.build();
        this.gameStateChangedEvent = new Observer();
        this.updatedEvent = new Observer();
        this.ship1.destroyedEvent.subscribe((ship) => this.onShipDestroyed(ship));
        this.ship2.destroyedEvent.subscribe((ship) => this.onShipDestroyed(ship));
    }

    initializeShip1(weaponIDs, moduleIDs) {
        this.ship1 = this.builder1
            .withName("Ship A")
            .withHealth(100)
            .withShield(80, 1)
            .withWeapons(weaponIDs)
            .withModules(moduleIDs)
            .build();
        this.ship1.activate();
    }

    initializeShip2(weaponIDs, moduleIDs) {
        this.ship2 = this.builder2
            .withName("Ship B")
            .withHealth(60)
            .withShield(120, 1)
            .withWeapons(weaponIDs)
            .withModules(moduleIDs)
            .build();
        this.ship2.activate();
    }

    startGame() {
        this.ship1.setTarget(this.ship2);
        this.ship2.setTarget(this.ship1);

        this.cachedTime = Date.now();
        this.changeGameState(gameStates.Started);
        this.update();
    }

    finishGame() {
        this.changeGameState(gameStates.Finished);
    }

    onShipDestroyed(ship) {
        this.finishGame();
    }

    update() {
        let delta = (Date.now() - this.cachedTime) / 1000;
        this.cachedTime = Date.now();

        this.updatedEvent.notify();
        if (this.gameState === gameStates.Started) {
            this.ship1.update(delta);
            this.ship2.update(delta);
        }
    }

    changeGameState(newGameState) {
        this.gameState = newGameState;
        this.gameStateChangedEvent.notify(this.gameState);
    }
}

const gameStates = {
    Idle: 'idle', Started: 'started', Finished: 'finished',
};
