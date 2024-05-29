import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Grid } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import { TechProcess } from '../../app/models/TechProcess';
import agent from '../../app/agent';
import TechProcessNavigation from './TechProcessNavigation';
import Spinner from '../../app/components/Spinner';
import ValidationErrors from '../../app/components/ValidationErrors';
import SelectProduct from '../../app/components/SelectProduct';


export default observer(function TechProcessDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { techProcessStore } = useStore();
    const { setNeedToResetParameters } = techProcessStore;

    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);

    const [item, setItem] = useState<TechProcess>({} as TechProcess);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();

    useEffect(() => {
        if (id) {
            setLoading(true);

            agent.TechProcesses.get(Number(id))
                .then(x => setItem(x))
                .finally(() => setLoading(false));
        }
    }, [])

    function navigateBack(path: string) {
        setNeedToResetParameters(false);
        navigate(path);
    }

    async function handleSubmit() {
        try {
            setSubmitting(true);
            if (id)
                await agent.TechProcesses.update(item);

            navigateBack('/techProcesses');
        } catch (error: any) {
            if (error.response.status == 400) {
                setErrors(agent.handleValidationErrors(error.response));
            }
        } finally {
            setSubmitting(false);
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;

        if (value !== '')
            setItem({ ...item, [name]: value });
        else
            setItem({ ...item, [name]: undefined });
    }

    if (loading) return <Spinner />

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={3}>
                    <TechProcessNavigation />
                </Grid.Column>

                <Grid.Column width={12}>
                    <div style={{ overflowX: 'auto' }}>
                        {errors && <ValidationErrors errors={errors} />}

                        <Form onSubmit={handleSubmit} autoComplete='off'>
                            <SelectProduct item={{ code: item.productCode, name: item.productName, tableId: 0, id: 0 }}
                                onChange={async (x) => {
                                    item.productCode = x.value.code;
                                    item.productName = x.value.name;
                                }}
                                onClear={() => {}} />

                            <Form.Field>
                                <label>Описание</label>
                                <Form.TextArea name='description' value={item.description} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Комплектовщик</label>
                                <Form.Input name='picker' value={item.picker} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Получатель</label>
                                <Form.Input name='recipient' value={item.recipient} onChange={handleInputChange} />
                            </Form.Field>

                            <div style={{ marginTop: '1em', textAlign: 'right' }}>
                                {isLoggedIn &&
                                    <Button loading={submitting} positive type="submit" content='Сохранить' />
                                }

                                <Button type='button' onClick={() => navigateBack('/techProcesses')} content="Назад" />
                            </div>
                        </Form>

                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
})
