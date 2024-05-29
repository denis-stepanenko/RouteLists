import { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import agent from '../../app/agent';
import ValidationErrors from '../../app/components/ValidationErrors';

export default observer(function Login() {
    const { userStore } = useStore();
    const { loading } = userStore;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const creds = { username: username, password: password };

        try {
            await userStore.login(creds)
        } catch (error: any) {
            const { status } = error.response;

            if (status === 400) {
                setErrors(agent.handleValidationErrors(error.response));
            }
        }
    };

    return (
        <>
            {errors && <ValidationErrors errors={errors} />}
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <h2>Вход</h2>
                <Form.Input placeholder='Логин' name='username' onChange={(e) => setUsername(e.target.value)} />
                <Form.Input placeholder='Пароль' name='password' type='password' onChange={(e) => setPassword(e.target.value)} />
                <Button loading={loading} content='Войти' type='submit' positive fluid />
            </Form>
        </>

    )
})
