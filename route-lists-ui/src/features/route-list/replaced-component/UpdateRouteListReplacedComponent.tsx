import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import agent from '../../../app/agent';
import { useStore } from '../../../app/stores/store';
import { RouteListReplacedComponent } from '../../../app/models/RouteListReplacedComponent';
import Spinner from '../../../app/components/Spinner';
import ValidationErrors from '../../../app/components/ValidationErrors';
import SelectExecutor from '../../../app/components/SelectExecutor';

export default function UpdateRouteListReplacedComponent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { routeListReplacedComponentStore } = useStore();
    const { setNeedToResetParameters } = routeListReplacedComponentStore;

    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<RouteListReplacedComponent>({} as RouteListReplacedComponent);

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.RouteListReplacedComponents.get(Number(id))
                .then(x => {
                    x.date = x.date?.split('T')[0];
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

    function navigateBack() {
        setNeedToResetParameters(false);
        navigate(-1);
    }

    async function handleSubmit() {
        try {
            setSubmitting(true);

            if (id)
                await agent.RouteListReplacedComponents.update(item);

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
                    <label>Причина замены</label>
                    <Form.TextArea name='replacementReason' value={item.replacementReason ?? ''} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Дата</label>
                    <Form.Input name='date' type='date' value={item.date} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Исполнитель</label>

                    <SelectExecutor
                        item={item.executor}
                        onChange={(x) => {
                            item.executorId = x.value.id
                        }} />
                </Form.Field>

                {isLoggedIn && (
                    <Button type='submit' loading={submitting} positive content='Сохранить' />
                )}

                <Button type='button' onClick={() => navigateBack()} content="Назад" />
            </Form>
        </div>
    )
}
