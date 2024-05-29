import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import agent from '../../app/agent';
import { useStore } from '../../app/stores/store';
import { Executor } from '../../app/models/Executor';
import Spinner from '../../app/components/Spinner';
import ValidationErrors from '../../app/components/ValidationErrors';

export default function Executor() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { executorStore } = useStore();
    const { setNeedToResetParameters } = executorStore;

    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<Executor>({} as Executor);

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.Executors.get(Number(id))
                .then(x => setItem(x))
                .finally(() => setLoading(false));
        }
    }, [])

    function navigateBack() {
        setNeedToResetParameters(false);
        navigate(-1);
    }

        function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
            const { name, value } = event.target;

            if (value !== '')
                setItem({ ...item, [name]: value });
            else
                setItem({ ...item, [name]: undefined });
        }

    async function handleSubmit() {
        try {
            setSubmitting(true);
            if (id)
                await agent.Executors.update(item);
            else
                await agent.Executors.create(item);

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
                    <label>Подразделение</label>
                    <Form.Input type='number' name='department' value={item.department} onChange={handleInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Фамилия</label>
                    <Form.Input name='firstName' value={item.firstName} onChange={handleInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Имя</label>
                    <Form.Input name='secondName' value={item.secondName} onChange={handleInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Отчество</label>
                    <Form.Input name='patronymic' value={item.patronymic} onChange={handleInputChange} />
                </Form.Field>

                {isLoggedIn && (
                    <Button type='submit' loading={submitting} positive content={id ? 'Сохранить' : 'Добавить'} />
                )}

                <Button type='button' onClick={() => navigateBack()} content="Назад" />
            </Form>
        </div>
    )
}
