import { observer } from 'mobx-react-lite';
import { ChangeEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import agent from '../../app/agent';
import { CreateTechProcess } from '../../app/models/CreateTechProcess';
import ValidationErrors from '../../app/components/ValidationErrors';
import SelectProduct from '../../app/components/SelectProduct';


export default observer(function CreateTechProcess() {
    const navigate = useNavigate();
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [data, setData] = useState<CreateTechProcess>({} as CreateTechProcess);

    async function handleSubmit() {
        try {
            setSubmitting(true);
            await agent.TechProcesses.create(data);

            navigate(-1);
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
            setData({ ...data, [name]: value });
        else
            setData({ ...data, [name]: undefined });
    }

    return (

        <div style={{ overflowX: 'auto' }}>
            {errors && <ValidationErrors errors={errors} />}

            <Form onSubmit={handleSubmit} autoComplete='off'>
                <SelectProduct
                    onChange={async (x) => {
                        data.productId = x.value.id;
                        data.tableId = x.value.tableId;
                    }}
                    onClear={() => {
                        data.productId = 0;
                        data.tableId = 0;
                    }} />

                <Form.Field>
                    <label>Описание</label>
                    <Form.TextArea name='description' onChange={handleInputChange} />
                </Form.Field>

                <div style={{ marginTop: '1em', textAlign: 'right' }}>
                    {isLoggedIn &&
                        <Button loading={submitting} positive type="submit" content='Добавить' />
                    }

                    <Button as={Link} to='/techProcesses' content="Назад" />
                </div>
            </Form>




        </div>

    )
})
