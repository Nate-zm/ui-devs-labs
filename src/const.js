const Status = {
    BACKLOG : 'backlog',
    PENDING: 'pending',
    COMPLITED: 'complited',
    CART: 'cart'
}

const StatusLabel = {
    [Status.BACKLOG]: 'Бэклог',
    [Status.PENDING]: 'В процессе',
    [Status.COMPLITED]: 'Готово',
    [Status.CART]: 'Корзина'
}

export {Status, StatusLabel};