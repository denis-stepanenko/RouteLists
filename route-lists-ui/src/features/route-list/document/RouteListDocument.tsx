import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { RouteListDocument } from '../../../app/models/RouteListDocument';
import agent from '../../../app/agent';
import Spinner from '../../../app/components/Spinner';
import ValidationErrors from '../../../app/components/ValidationErrors';

export default function RouteListDocument() {
    const { routeListId, id } = useParams();
    const navigate = useNavigate();
    const { userStore } = useStore();

    const { routeListDocumentStore } = useStore();
    const { setNeedToResetParameters } = routeListDocumentStore;

    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [item, setItem] = useState<RouteListDocument>({} as RouteListDocument);

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.RouteListDocuments.get(Number(id))
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
                await agent.RouteListDocuments.update(item);
            else {
                item.routeListId = Number(routeListId);
                await agent.RouteListDocuments.create(item);
            }

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
                    <label>Наименование</label>
                    <Form.Input name='name' value={item.name} onChange={handleInputChange} />
                </Form.Field>

                {isLoggedIn && (
                    <Button type='submit' loading={submitting} positive content={id ? 'Сохранить' : 'Добавить'} />
                )}

                <Button type='button' onClick={() => navigateBack()} content="Назад" />
            </Form>
        </div>
    )
}
