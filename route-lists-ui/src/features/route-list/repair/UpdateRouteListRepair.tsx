import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import agent from '../../../app/agent';
import Spinner from '../../../app/components/Spinner';
import ValidationErrors from '../../../app/components/ValidationErrors';
import SelectExecutor from '../../../app/components/SelectExecutor';
import { RouteListRepair } from '../../../app/models/RouteListRepair';

export default function UpdateRouteListRepair() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userStore } = useStore();

    const { routeListDocumentStore } = useStore();
    const { setNeedToResetParameters } = routeListDocumentStore;

    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<RouteListRepair>({} as RouteListRepair);

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.RouteListRepairs.get(Number(id))
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
                await agent.RouteListRepairs.update(item);

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
                    <label>Причина</label>
                    <Form.Input name='reason' value={item.reason ?? ''} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Дата</label>
                    <Form.Input type='date' name='date' value={item.date?.split('T')[0] ?? ''} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Дата начала</label>
                    <Form.Input type='date' name='startDate' value={item.startDate?.split('T')[0] ?? ''} onChange={handleInputChange} />
                </Form.Field>

                <Form.Field>
                    <label>Дата окончания</label>
                    <Form.Input type='date' name='endDate' value={item.endDate?.split('T')[0] ?? ''} onChange={handleInputChange} />
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
