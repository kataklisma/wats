var locationUtils = require('locationUtils');

function createEnemies() {
    return locationUtils.generateEnemy(37.509319, 15.083504000000005, 0.5, 10);
}

function start(e) {

    Alloy.createController("ar", {
        enemies : createEnemies()
    }).getView().open();
}

Alloy.createController('overlay').getView().open();

//$.index.open();
