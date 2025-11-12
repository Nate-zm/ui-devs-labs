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

const UserAction = {
    UPDATE_TASK: "UPDATE_TASK",
    ADD_TASK: "ADD_TASK",
    DELETE_TASK: "DELETE_TASK",
};

const UpdateType = {
    PATCH: "PATCH",
    MINOR: "MINOR",
    MAJOR: "MAJOR",
    INIT: "INIT"
}

export { Status, StatusLabel, UserAction, UpdateType };