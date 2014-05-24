function createEnemies() {
    var enemy = Alloy.createModel("Enemy", {
        lat : "37.50942942",
        lon : "15.08363915",
        name : Alloy.Globals.DefaultEnemy.NAME,
        icon : Alloy.Globals.DefaultEnemy.IMAGE,
        status : 0,
        value : Alloy.Globals.DefaultEnemy.VALUE,
        type : Alloy.Globals.DefaultEnemy.TYPE,

    });

    enemy.save();

    var enemies = Alloy.createCollection("Enemy");

    enemies.add(enemy);
    return enemies;

}

function start(e) {

    Alloy.createController("ar", {
        enemies : createEnemies()
    }).getView().open();
}

//createEnemies();
$.index.open();
