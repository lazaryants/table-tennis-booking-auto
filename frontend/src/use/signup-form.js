import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import 'yup-phone'
import { isValidPhoneNumber } from 'react-phone-number-input'
export function useSignUpForm() {
    const store = useStore()
    const router = useRouter()
    const {handleSubmit, isSubmitting} = useForm()
    const {value: username, errorMessage: eError, handleBlur: eBlur} = useField(
        'username',
        yup
            .string()
            .lowercase()
            .trim()
            .required('Пожалуйста введите логин')
    )
    const {value: first_name, errorMessage: fError, handleBlur: fBlur} = useField(
        'first_name',
        yup
            .string()
            .trim()
            .required('Пожалуйста введите имя')
    )
    const {value: last_name, errorMessage: lError, handleBlur: lBlur} = useField(
        'last_name',
        yup
            .string()
            .trim()
            .required('Пожалуйста введите фамилию')
    )
    const {value: phone, errorMessage: phoneError, handleBlur: phoneBlur} = useField(
        'phone',
        yup
            .string()
            .trim()
            .test('is-valid-phone', 'Введите корректный номер телефона в формате +7 123 456 78 90', (value) => {
                return isValidPhoneNumber(value || '')
            })
            .required('Пожалуйста введите номер телефона')
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
    const onSubmit = handleSubmit(async values  => {
        console.log(username, phone, first_name, last_name, password)
        await store.dispatch('auth/signUp', values)
        router.push('/auth')
    })
    return {
        username,
        password,
        first_name,
        last_name,
        phone,
        eError,
        pError,
        eBlur,
        pBlur,
        phoneBlur,
        phoneError,
        fBlur,
        fError,
        lBlur,
        lError,
        isSubmitting,
        onSubmit
    }
}
