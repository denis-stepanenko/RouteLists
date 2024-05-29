import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import agent from '../../app/agent';
import { useStore } from '../../app/stores/store';
import { User } from '../../app/models/User';
import { Role } from '../../app/models/Role';
import Spinner from '../../app/components/Spinner';
import ValidationErrors from '../../app/components/ValidationErrors';

export default function UpdateUser() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { userStore } = useStore();
    const { setNeedToResetParameters } = userStore;

    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<User>({
        id: '',
        username: '',
        name: '',
        department: 0,
        token: '',
        refreshToken: '',
        roles: []
    });
    const [roles, setRoles] = useState<Role[]>();

    useEffect(() => {
        if (id) {
            setLoading(true);
            agent.Users.get(id).then(x => {
                setItem(x);
                setLoading(false);
            });
        }

        agent.Roles.getAll().then(x => setRoles(x));
    }, [])

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setItem({ ...item, [name]: value })
    }

    function handleNumberInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        if (value !== '')
            setItem({ ...item, [name]: value });
        else
            setItem({ ...item, [name]: 0 });
    }

    function handleCheckboxChange(data?: string) {
        if (data) {
            let roles = [...item.roles, data];

            if (item.roles.includes(data)) {
                roles = roles.filter(x => x !== data);
            }

            item.roles = roles;
        }
    }

    function navigateBack() {
        setNeedToResetParameters(false);
        navigate(-1);
    }

    async function handleSubmit() {
        try {
            setSubmitting(true);
            if (id)
                await agent.Users.update(item);
            else
                await agent.Users.create(item);

            navigateBack();
        } catch (error: any) {
            if (error.response.status == 400)
                setErrors(agent.handleValidationErrors(error.response));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Spinner />

    return (
        <div>
            {errors && <ValidationErrors errors={errors} />}

            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Field>
                    <label>Имя пользователя</label>
                    <Form.Input name='username' value={item.username} onChange={handleInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Наименование</label>
                    <Form.Input name='name' value={item.name} onChange={handleInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Подразделение</label>
                    <Form.Input type='number' name='department' value={item.department} onChange={handleNumberInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Роли</label>
                    {roles?.map(x => (
                        <Form.Checkbox key={x.name} defaultChecked={item.roles.includes(x.name)} name='roles' value={x.name} label={x.name} onChange={(_e, data) => handleCheckboxChange(data.value?.toString())} />
                    ))}
                </Form.Field>

                {isLoggedIn && (
                    <Button type='submit' loading={submitting} positive content={id ? 'Сохранить' : 'Добавить'} />
                )}

                <Button type='button' onClick={() => navigateBack()} content="Назад" />
            </Form>
        </div>
    )
}
