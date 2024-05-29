import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { Operation } from '../../app/models/Operation';
import agent from '../../app/agent';
import { useStore } from '../../app/stores/store';
import Spinner from '../../app/components/Spinner';
import ValidationErrors from '../../app/components/ValidationErrors';

export default function Operation() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { operationStore } = useStore();
    const { setNeedToResetParameters } = operationStore;

    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<Operation>({} as Operation);

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.Operations.get(Number(id))
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
                await agent.Operations.update(item);
            else
                await agent.Operations.create(item);

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
                    <label>Код</label>
                    <Form.Input type='number' name='code' value={item.code} onChange={handleInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Наименование</label>
                    <Form.Input name='name' value={item.name} onChange={handleInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Группа</label>
                    <Form.Input name='groupName' value={item.groupName} onChange={handleInputChange} />
                </Form.Field>
                <Form.Field>
                    <label>Подразделение</label>
                    <Form.Input type='number' name='department' value={item.department} onChange={handleInputChange} />
                </Form.Field>

                {isLoggedIn && (
                    <Button type='submit' loading={submitting} positive content={id ? 'Сохранить' : 'Добавить'} />
                )}

                <Button type='button' onClick={() => navigateBack()} content="Назад" />
            </Form>
        </div>
    )
}
