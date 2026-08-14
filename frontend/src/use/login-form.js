import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export function useLoginForm() {
    const store = useStore()
    const router = useRouter()
    const {handleSubmit, isSubmitting} = useForm()

    const {value: username, errorMessage: eError, handleBlur: eBlur} = useField(
        'username',
        yup
            .string()
            .trim()
            .required('Пожалуйста введите логин')
    )

    const MIN_LENGTH = 8

    const {value: password, errorMessage: pError, handleBlur: pBlur} = useField(
        'password',
        yup
            .string()
            .trim()
            .required('Пожалуйста введите пароль')
            .min(MIN_LENGTH, `Пароль не может быть меньше ${MIN_LENGTH} символов`)
    )

    const onSubmit = handleSubmit(async values => {
        try {
            await store.dispatch('auth/login', values)
            await store.commit('auth/setUsername', username.value)
            router.push('/')
        } catch (e) {
	    // Добавить обработку ошибок
            console.error('Login error:', e)
        }
    })

    return {
        username,
        password,
        eError,
        pError,
        eBlur,
        pBlur,
        onSubmit,
        isSubmitting
    }
}
