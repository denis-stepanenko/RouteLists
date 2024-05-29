import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import agent from '../../app/agent';
import { useStore } from '../../app/stores/store';
import { CreateByTechProcess } from '../../app/models/CreateByTechProcess';
import Spinner from '../../app/components/Spinner';
import ValidationErrors from '../../app/components/ValidationErrors';
import SelectTechProcess from '../../app/components/SelectTechProcess';

export default function CreateRouteListByTechProcess() {

    const navigate = useNavigate();

    const { routeListStore } = useStore();
    const { setNeedToResetParameters } = routeListStore;

    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<CreateByTechProcess>({} as CreateByTechProcess);

    useEffect(() => {
        loadNumber();
        item.department = userStore.user?.department!;
    }, [])

    async function loadNumber() {
        setLoading(true);

        agent.RouteLists.getNewNumber(userStore.user?.department!)
            .then(result => {
                setNumber(result.toString());
                item.number = result.toString();
            })
            .finally(() => setLoading(false));
    }

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

            await agent.RouteLists.createByTechProcess(item);

            navigateBack()
        } catch (error: any) {
            if (error.response.status == 400) {
                setErrors(agent.handleValidationErrors(error.response));
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Spinner />

    return (
        <Segment>

            {errors && <ValidationErrors errors={errors} />}

            <Form onSubmit={handleSubmit} autoComplete="off">

                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Field>
                                <label>Шаблон</label>
                                <SelectTechProcess
                                    onChange={x => {
                                        item.techProcessId = x.value.id
                                    }}
                                    onClear={() => {
                                        item.techProcessId = 0
                                    }}
                                />
                            </Form.Field>

                            <Form.Field>
                                <label>Номер</label>
                                <Form.Input defaultValue={number} name="number" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Цех</label>
                                <Form.Input type='number' defaultValue={userStore.user?.department} name="department" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Дата</label>
                                <Form.Input type='date' value={item.date || ''} name="date" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Количество</label>
                                <Form.Input type='number' value={item.productCount} name="productCount" onChange={handleInputChange} />
                            </Form.Field>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>

                <div style={{ marginTop: '1em', textAlign: 'right' }}>
                    {isLoggedIn &&
                        <Button loading={submitting} positive type="submit" content='Добавить' />
                    }

                    <Button type='button' onClick={() => navigateBack()} content="Назад" />
                </div>
            </Form>

        </Segment>
    )
}
