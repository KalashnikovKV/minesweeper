let matrix = null;
let running = null;

init(10, 10, 10);

document
    .querySelector('button')
    .addEventListener('click', () => init(10, 10, 10))

function init(columns, rows, mines) {
    matrix = getMatrix(columns, rows)
    running = true;

    for (let i = 0; i < mines; i++) {
        setRandomMine(matrix);
    }

    update();
}

function update() {
    if (!running) {
        return;
    }
    const gameElement = matrixToHTML(matrix);
    const appElement = document.querySelector('#app');

    appElement.innerHTML = '';
    appElement.append(gameElement)

    appElement
        .querySelectorAll('img')
        .forEach(imgElement => {
            imgElement.addEventListener('mousedown', mousedownHandler)
            imgElement.addEventListener('mouseup', mouseupHandler)
            imgElement.addEventListener('mouseleave', mouseleaveHandler)
        })

    if (isLosing(matrix)) {
        console.log('You Lose')
        alert('You Lose')
        running = false;
    }

    else if (isWin(matrix)) {
        alert('You Win')

        console.log('You Win')
        running = false;

    }
}

function mousedownHandler(event) {
    const { cell, left, right } = getInfo(event)

    if (left) {
        cell.left = true;
    }

    if (right) {
        cell.right = true;
    }

    if (cell.left && cell.right) {
        botHandler(cell)
    }

    update()
    // console.log(info)
}

function mouseupHandler(event) {
    const { cell, left, right } = getInfo(event)

    const both = cell.right && cell.left && (left || right);
    const leftMouse = !both && cell.left && left;
    const rightMouse = !both && cell.right && right;

    if (both) {
        forEach(matrix, x => x.poten = false)
    }

    if (left) {
        cell.left = false;
    }

    if (right) {
        cell.right = false;
    }

    if (leftMouse) {
        leftHandler(cell)
    }

    else if (rightMouse) {
        rightHandler(cell)
    }
    update()

    // console.log(info)
}

function mouseleaveHandler(event) {
    const info = getInfo(event)
    info.cell.left = false;
    info.cell.right = false;
    update()

}

function getInfo(event) {
    const element = event.target;
    const cellId = parseInt(element.getAttribute('data-cell-id'))
    return {
        left: event.which === 1,
        right: event.which === 3,
        cell: getCellById(matrix, cellId)
    }
}

function leftHandler(cell) {
    if (cell.show || cell.flag) {
        return
    }
    cell.show = true

    showSpread(matrix, cell.x, cell.y)
    // console.log('leftHandler')
}

function rightHandler(cell) {

    if (!cell.show) {
        cell.flag = !cell.flag
    }
    // console.log('rightHandler')

}

function botHandler(cell) {
    if (!cell.show || !cell.number) {
        return
    }

    const cells = getAroundCells(matrix, cell.x, cell.y)
    const flags = cells.filter(x => x.flag).length

    if (flags === cell.number) {
        cells
            .filter(x => !x.flag)
            .forEach(cell => {
                cell.show = true
                showSpread(matrix, cell.x, cell.y)
            })

    }
    else {
        cells
            .filter(x => !x.flag)
            .forEach(cell => cell.poten = true)
    }
    // console.log('botHandler')

}
