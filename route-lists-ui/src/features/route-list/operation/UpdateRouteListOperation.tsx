import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import agent from '../../../app/agent';
import { useStore } from '../../../app/stores/store';
import { RouteListOperation } from '../../../app/models/RouteListOperation';
import Spinner from '../../../app/components/Spinner';
import ValidationErrors from '../../../app/components/ValidationErrors';

export default function UpdateRouteListOperation() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { routeListOperationStore } = useStore();
    const { setNeedToResetParameters } = routeListOperationStore;

    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<RouteListOperation>({} as RouteListOperation);

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.RouteListOperations.get(Number(id))
                .then(x => setItem(x))
                .finally(() => setLoading(false));
        }
    }, [])

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;

        if (value !== '')
            setItem({ ...item, [name]: value });
        else
            setItem({ ...item, [name]: undefined });
    }


    function navigateBack() {
        setNeedToResetParameters(false);
        navigate(-1);
    }

    async function handleSubmit() {
        try {
            setSubmitting(true);

            if (id)
                await agent.RouteListOperations.update(item);

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
                    <Form.Input value={item.code} readOnly />
                </Form.Field>

                <Form.Field>
                    <label>Наименование</label>
                    <Form.Input value={item.name} readOnly />
                </Form.Field>

                <Form.Field>
                    <label>Количество</label>
                    <Form.Input name='count' value={item.count} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Номер</label>
                    <Form.Input name='number' value={item.number ?? ''} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Тип</label>
                    <Form.Input name='type' value={item.type ?? ''} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Примечание</label>
                    <Form.TextArea name='description' value={item.description ?? ''} onChange={handleInputChange} />
                </Form.Field>

                {isLoggedIn && (
                    <Button type='submit' loading={submitting} positive content={id ? 'Сохранить' : 'Добавить'} />
                )}

                <Button type='button' onClick={() => navigateBack()} content="Назад" />
            </Form>
        </div>
    )
}
