	var p = {
    paginacion: document.querySelectorAll('#paginacion li'),
    item: null,
    imagen: document.querySelector('#imagen'),
    next: document.querySelector('#avanzar'),
    prev: document.querySelector('#retroceder'),
    dot: 0,
    formatLoop: false,
    ulSlide: document.querySelector('#slide .div')
}
var m = {
    inicioSlide: () => {
        p.paginacion[0].css('opacity', '1');
        m.automatic(); 
        p.paginacion.forEach(item => {
            item.addEventListener('click', m.paginacionSlide)
            item.style.opacity = 0;
        }) 
    },
    paginacionSlide: item => {
        p.item = item.target.parentNode.getAttribute('item') 
        p.dot = parseInt(p.item, 10); 
        m.movimientoSlide(p.dot); 
    },
    movimientoSlide: dot => {
        p.formatLoop = true; 
        p.imagen.setAttribute('src', `images/example/00${dot}.jpg`) 
        m.paginar(p.dot);
    },
    prev: () => {
        p.formatLoop = true; 
        p.dot--
            if (p.dot < 0) {
                p.dot = p.paginacion.length - 1
            } 
        p.imagen.setAttribute('src', `images/example/00${p.dot}.jpg`) 
        m.paginar(p.dot);
    },
    next: () => {
        p.formatLoop = true; 
        p.dot++;
        if (p.dot > p.paginacion.length - 1) {
            p.dot = 0;
        } 
        p.imagen.setAttribute('src', `images/example/00${p.dot}.jpg`) 
        m.paginar(p.dot);
    },
    paginar: dot => {
        for (var i = 0; i < p.paginacion.length; i++) {
            p.paginacion[i].style.opacity = .5;
        } 
        setTimeout(function() {
            p.paginacion[dot].style.opacity = 1;
        }, 100) 
    },
    automatic: () => {
        setInterval(function() {
            if (p.formatLoop) { 
                p.formatLoop = false;
            } else {
                p.paginacion.forEach(item => {
                    item.style.opacity = 0;
                })  
                p.dot++;
                if (p.dot > p.paginacion.length - 1) {
                    p.dot = 0;
                }
                p.imagen.setAttribute('src', `images/example/00${p.dot}.jpg`)
            } 
        }, 2000)
    }
}
m.inicioSlide();