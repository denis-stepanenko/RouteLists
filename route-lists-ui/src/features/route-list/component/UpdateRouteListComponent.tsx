import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import agent from '../../../app/agent';
import { useStore } from '../../../app/stores/store';
import { RouteListComponent } from '../../../app/models/RouteListComponent';
import Spinner from '../../../app/components/Spinner';
import ValidationErrors from '../../../app/components/ValidationErrors';

export default function UpdateRouteListComponent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { routeListComponentStore } = useStore();
    const { setNeedToResetParameters } = routeListComponentStore;

    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<RouteListComponent>({} as RouteListComponent);

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.RouteListComponents.get(Number(id))
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

            await agent.RouteListComponents.update(item);

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
                    <label>Заводской номер</label>
                    <Form.Input name='factoryNumber' value={item.factoryNumber ?? ''} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Сопроводительный документ</label>
                    <Form.TextArea name='accompanyingDocument' value={item.accompanyingDocument ?? ''} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Количество</label>
                    <Form.Input name='count' type='number' value={item.count} onChange={handleInputChange} />
                </Form.Field>

                {isLoggedIn && (
                    <Button type='submit' loading={submitting} positive content='Сохранить' />
                )}

                <Button type='button' onClick={() => navigateBack()} content="Назад" />
            </Form>
        </div>
    )
}
