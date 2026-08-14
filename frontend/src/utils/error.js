const ERROR_CODES = {
    INVALID_PASSWORD: 'Неправильная комбинация логин/пароль',
    auth: 'Пожалуйста, войдите в систему',
    USER_EXISTS: 'Данный пользователь уже существует',
    COMMON_PASSWORD: 'Пароль не должен быть слишком простым',
    REGISTERED: 'Регистрация прошла успешно!'
}

export function error(code) {
    return ERROR_CODES[code] ? ERROR_CODES[code] : 'Неизвестная ошибка'
}
