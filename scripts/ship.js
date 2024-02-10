class Ship {
    constructor(logger) {
        this.logger = logger;
        this.isDestroyed = false;
        this.destroyedEvent = new Observer();
    }

    activate() {
        this.isDestroyed = false;
        for (let i = 0; i < this.modules.length; i++) {
            this.modules[i].initializeModule(this);
        }
        this.shieldProperty.setActiveState(true);
    }

    deInitializeSystems() {
        this.weapons.forEach(weapon => {
            weapon.setActiveState(false);
        });
        this.shieldProperty.setActiveState(false);
    }

    setWeapons(weapons) {
        this.weapons = weapons;
        this.weapons.forEach(weapon => weapon.setParent(this));
    }

    setModules(modules) {
        this.modules = modules;
    }

    update(deltaTime) {
        this.weapons.forEach(weapon => {
            weapon.update(deltaTime);
        });
        this.shieldProperty.update(deltaTime);
    }

    setTarget(targetShip) {
        this.weapons.forEach(weapon => {
            weapon.setActiveState(true);
            weapon.setTarget(targetShip);
        });
    }

    takeDamage(damage) {
        if (!this.isDestroyed) {

            let huskDamage = damage - this.shieldProperty.value;
            if (huskDamage <= 0) huskDamage = 0;
            this.shieldProperty.takeDamage(damage);
            this.healthProperty.takeDamage(huskDamage);
            this.notifyLog(`Ship ${this.nameProperty} took ${damage} damage`);
            this.checkForDeath();

        }
    }

    checkForDeath() {
        if (this.healthProperty.value <= 0) {
            this.deInitializeSystems();
            this.isDestroyed = true;
            this.destroyedEvent.notify(this);
            this.notifyLog(`Ship ${this.nameProperty} is destroyed!`);
        }
    }

    notifyLog(text) {
        if (this.logger !== null) this.logger.log(text);
    }

    setHealth(healthProperty) {
        this.healthProperty = healthProperty;
    }

    setShield(shieldProperty) {
        this.shieldProperty = shieldProperty;
    }

    setName(name) {
        this.nameProperty = name;
    }
}

class HealthProperty {
    constructor(maxValue, value) {
        this.maxValue = maxValue;
        this.value = value;
    }

    takeDamage(damage) {
        this.value -= damage;
        this.value = Math.min(Math.max(this.value, 0), this.maxValue);
    }
}

class ShieldProperty {
    constructor(maxValue, value, restoreRate) {
        this.maxValue = maxValue;
        this.value = value;
        this.restoreRate = restoreRate;
        this.activeState = false;
    }

    update(deltaTime) {
        if (this.activeState) {
            this.restoreShield(deltaTime);
        }
    }

    restoreShield(deltaTime) {
        if (this.value <= this.maxValue) {
            this.addValue(this.restoreRate * deltaTime);
        }
    }

    takeDamage(damage) {
        this.addValue(-damage);
    }

    addValue(value) {
        this.value += value;
        this.value = Math.min(Math.max(this.value, 0), this.maxValue);
    }

    setActiveState(state) {
        this.activeState = state;
    }
}

class Weapon {
    constructor(damagePs, coolDownPeriod, name = "Weapon") {
        this.nameProperty = name;
        this.damagePS = damagePs;
        this.coolDownPeriod = coolDownPeriod;
        this.isOverheated = false;
        this.isActive = false;
        this.parentObject = null;
        this.target = null;
        this.coolDownCounter = 0;
    }

    get ActiveState() {
        return this.isActive;
    }

    setParent(parentObject) {
        this.parentObject = parentObject;
    }

    setActiveState(state) {
        this.isActive = state;
    }

    setTarget(damageable) {
        this.target = damageable;
    }

    update(deltaTime) {
        if (this.isActive && !this.isOverheated) {
            this.fire();
        }

        if (this.coolDownCounter >= this.coolDownPeriod) {
            this.coolDownCounter -= this.coolDownPeriod;
            this.isOverheated = false;
        } else {
            this.coolDownCounter += deltaTime;
        }
    }

    fire() {
        if (this.target !== null) {
            if (this.parentObject !== null) {
                this.parentObject.notifyLog(this.parentObject.nameProperty + " fired from " + this.nameProperty + " at " + this.target.nameProperty);
            }
            this.target.takeDamage(this.damagePS);
            this.isOverheated = true;
        }
    }
}

class Module {
    initializeModule(ship) {
        throw new Error('Initialize method should be implemented in extension');
    }
}

class EmptyModule extends Module {
    initializeModule(ship) {
    }
}

class ShieldIncreaseModule extends Module {
    constructor(additionalHealth) {
        super();
        this.additionalHealth = additionalHealth;
    }

    initializeModule(ship) {
        ship.shieldProperty.maxValue += this.additionalHealth;
        ship.shieldProperty.value += this.additionalHealth;
    }
}

class HealthIncreaseModule extends Module {
    constructor(additionalHealth) {
        super();
        this.additionalHealth = additionalHealth;
    }

    initializeModule(ship) {
        ship.healthProperty.maxValue += this.additionalHealth;
        ship.healthProperty.value += this.additionalHealth;
    }
}

class WeaponRestoreRateModule extends Module {
    constructor(restoreRateMod) {
        super();
        this.restoreRateMod = restoreRateMod;
    }

    initializeModule(ship) {
        ship.weapons.forEach(weapon => {
            weapon.restoreRate -= weapon.restoreRate * this.restoreRateMod;
        });
    }
}

class ShieldRestoreModule extends Module {
    constructor(restoreRateMod) {
        super();
        this.restoreRateMod = restoreRateMod;
    }

    initializeModule(ship) {
        ship.shieldProperty.restoreRate -= ship.shieldProperty.restoreRate * this.restoreRateMod;
    }
}
