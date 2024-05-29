import { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import agent from '../../app/agent';
import ValidationErrors from '../../app/components/ValidationErrors';

export default observer(function Login() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: any) {
        event.preventDefault();

        setLoading(true);

        try {
            if (id) {
                await agent.Users.changePassword(id, password);
                navigate('/users');
            }
        } catch (error: any) {
            if (error.response.status == 400)
                setErrors(agent.handleValidationErrors(error.response));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2>Смена пароля</h2>
            {errors && <ValidationErrors errors={errors} />}
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Новый пароль' name='password' type='password' onChange={(e) => setPassword(e.target.value)} />
                <Button loading={loading} content='Сохранить' type='submit' positive />
                <Button as={NavLink} to='/users'>Назад</Button>
            </Form>
        </>

    )
})
