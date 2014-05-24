function start(e) {
    
    createEnemies();
    
    Alloy.createController("ar", {
        enemies : Alloy.Collections.Enemy
    }).getView().open();
}

function createEnemies() {
    var enemy = Alloy.createModel("Enemy", {
        name : Alloy.Globals.DefaultEnemy.NAME,
        lat : "37.50942942",
        lon : "15.08363915",
        type : Alloy.Globals.DefaultEnemy.TYPE,
        point : Alloy.Globals.DefaultEnemy.POINT,
        image : Alloy.Globals.DefaultEnemy.IMAGE,
        status : 0
    });

    if (enemy.isValid()) {
        enemy.save();
        Alloy.Collections.Enemy.add(enemy);


    } else {
        alert("Creazione nemico non valida");
    }
}

$.index.open();
