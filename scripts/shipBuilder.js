class ShipBuilder {
    constructor(logger) {
        this.ship = new Ship(logger);
    }

    withName(name) {
        this.ship.setName(name);
        return this;
    }

    withHealth(maxHealth) {
        let healthProperty = new HealthProperty(maxHealth, maxHealth);
        this.ship.setHealth(healthProperty);
        return this;
    }

    withShield(maxHealth, restoreRate) {
        let shieldProperty = new ShieldProperty(maxHealth, maxHealth, restoreRate);
        this.ship.setShield(shieldProperty);
        return this;
    }

    withWeapons(weaponIDs) {
        let shipWeapons = weaponIDs.map(weaponID => getWeaponById(weaponID));
        this.ship.setWeapons(shipWeapons);
        return this;
    }

    withModules(moduleIDs) {
        let shipModules = moduleIDs.map(moduleID => getModuleById(moduleID));
        this.ship.setModules(shipModules);
        return this;
    }

    build() {
        return this.ship;
    }
}

function getWeaponById(id) {
    switch (id) {
        case 0: {
            return new Weapon(5, 3, 'Weapon A');
        }
        case 1: {
            return new Weapon(4, 2, 'Weapon B');
        }
        case 2: {
            return new Weapon(20, 5, 'Weapon C');
        }
        default: {
            throw new Error('Weapon with such ID doesnt exist');
        }
    }
}

function getModuleById(id) {
    switch (id) {
        case 0: {
            return new EmptyModule();
        }
        case 1: {
            return new ShieldIncreaseModule(50);
        }
        case 2: {
            return new HealthIncreaseModule(50);
        }
        case 3: {
            return new WeaponRestoreRateModule(0.2);
        }
        case 4: {
            return new ShieldRestoreModule(0.2);
        }
        default: {
            throw new Error('Module with such ID doesnt exist');
        }

    }
}