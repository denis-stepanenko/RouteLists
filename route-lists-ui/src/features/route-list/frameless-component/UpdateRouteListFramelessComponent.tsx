import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import agent from '../../../app/agent';
import { useStore } from '../../../app/stores/store';
import { RouteListFramelessComponent } from '../../../app/models/RouteListFramelessComponent';
import Spinner from '../../../app/components/Spinner';
import ValidationErrors from '../../../app/components/ValidationErrors';

export default function UpdateRouteListFramelessComponent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { routeListFramelessComponentStore } = useStore();
    const { setNeedToResetParameters } = routeListFramelessComponentStore;

    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<RouteListFramelessComponent>({} as RouteListFramelessComponent);

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.RouteListFramelessComponents.get(Number(id))
                .then(x => {
                    x.dateOfIssueForProduction = x.dateOfIssueForProduction.split('T')[0];
                    x.dateOfSealing = x.dateOfSealing.split('T')[0];
                    setItem(x);
                })
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

    async function handleSubmit() {
        try {
            setSubmitting(true);
            if (id)
                await agent.RouteListFramelessComponents.update(item);

            navigateBack();
        } catch (error: any) {
            if (error.response.status == 400)
                setErrors(agent.handleValidationErrors(error.response));
        } finally {
            setSubmitting(false);
        }
    }

    function navigateBack() {
        setNeedToResetParameters(false);
        navigate(-1);
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
                    <label>Дата выдачи в производство</label>
                    <Form.Input name='dateOfIssueForProduction' type='date' value={item.dateOfIssueForProduction} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Дата герметизации</label>
                    <Form.Input name='dateOfSealing' type='date' value={item.dateOfSealing} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Срок до герметизации</label>
                    <Form.Input name='daysBeforeSealing' type='number' value={item.daysBeforeSealing} onChange={handleInputChange} />
                </Form.Field>

                {isLoggedIn && (
                    <Button type='submit' loading={submitting} positive content={id ? 'Сохранить' : 'Добавить'} />
                )}

                <Button type='button' onClick={() => navigateBack()} content="Назад" />
            </Form>
        </div>
    )
}
