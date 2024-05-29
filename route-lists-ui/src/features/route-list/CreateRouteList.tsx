import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import agent from '../../app/agent';
import { useStore } from '../../app/stores/store';
import { RouteList } from '../../app/models/RouteList';
import Spinner from '../../app/components/Spinner';
import ValidationErrors from '../../app/components/ValidationErrors';
import SelectProduct from '../../app/components/SelectProduct';
import SelectOrder from '../../app/components/SelectOrder';
import SelectMaterial from '../../app/components/SelectMaterial';

export default function CreateRouteList() {

    const navigate = useNavigate();
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>();

    const [item, setItem] = useState<RouteList>({} as RouteList);
    const [number, setNumber] = useState('');

    const [isRouteCalculating, setIsRouteCalculating] = useState(false);
    const [showOnlyMaterialsByProduct, setShowOnlyMaterialsByProduct] = useState(false);
    const [route, setRoute] = useState('');
    const [loading, setLoading] = useState(false);

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

    async function handleSubmit() {
        try {
            setSubmitting(true);

            await agent.RouteLists.create(item);

            navigate('/routeLists');
        } catch (error: any) {
            if (error.response.status == 400) {
                setErrors(agent.handleValidationErrors(error.response));
            }
        } finally {
            setSubmitting(false);
        }
    }

    const esdProtectionRequiredHandler = () => {
        item.esdProtectionRequired = !item.esdProtectionRequired;
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
                                <label>Заводской номер</label>
                                <Form.Input value={item.factoryNumber} name="factoryNumber" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Этап</label>
                                <Form.Input value={item.stage} name="stage" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Номер комплектовочной ведомости</label>
                                <Form.Input value={item.pickingListNumber} name="pickingListNumber" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Заказ</label>
                                <Form.Input value={item.order} name="order" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Изделие</label>
                                <Form.Input value={item.ownerProductName} name="ownerProductName" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Сведения об отступлении</label>
                                <Form.Input value={item.informationAboutReplacement} name="informationAboutReplacement" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <Form.Checkbox defaultChecked={item.esdProtectionRequired} onChange={esdProtectionRequiredHandler} label='Защищать от статического электричества' />
                            </Form.Field>
                        </Grid.Column>

                        <Grid.Column>
                            <Form.Field disabled={isRouteCalculating}>
                                <label>Продукт</label>

                                <SelectProduct
                                    onChange={async (x) => {
                                        item.productCode = x.value.code;
                                        item.productName = x.value.name;

                                        setIsRouteCalculating(true);
                                        const route = await agent.Products.getRoute(item?.productCode!);
                                        item.route = route;
                                        setRoute(route);
                                        setIsRouteCalculating(false);
                                    }}
                                    onClear={() => {
                                        item.productCode = '';
                                        item.productName = '';
                                        item.route = '';
                                        setRoute('');
                                    }} />
                            </Form.Field>

                            <Form.Field>
                                <label>Маршрут</label>
                                <Form.Input loading={isRouteCalculating} readOnly={isRouteCalculating} value={route} name="route" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Направление деятельности</label>

                                <SelectOrder
                                    item={{groupName: item.groupName ?? '', direction: item.direction ?? '', clientOrder: item.clientOrder ?? '' }}
                                    productCode={item?.productCode!}
                                    onChange={async (x) => {
                                        item.groupName = x.value.groupName;
                                        item.direction = x.value.direction;
                                        item.clientOrder = x.value.clientOrder;
                                    }} />
                            </Form.Field>

                            <Form.Field>
                                <label>Материал</label>

                                <SelectMaterial
                                    productCode={item?.productCode!}
                                    showOnlyMaterialsByProduct={showOnlyMaterialsByProduct}
                                    item={{code: item.materialCode ?? '', name: item.materialName ?? '', parameter: '', id: 0}}
                                    onChange={async (x) => {
                                        item.materialCode = x.value.code;
                                        item.materialName = x.value.name;
                                    }} />
                                <Form.Checkbox defaultChecked={showOnlyMaterialsByProduct} onChange={() => setShowOnlyMaterialsByProduct(!showOnlyMaterialsByProduct)} label='Показывать только материалы используемые в продукте' />
                            </Form.Field>

                            <Form.Field>
                                <label>Количество</label>
                                <Form.Input type='number' defaultValue={item.productCount} name="productCount" onChange={handleInputChange} />
                            </Form.Field>
                        </Grid.Column>

                        <Grid.Column>
                            <Form.Field>
                                <label>Мастер</label>
                                <Form.Input value={item.masterName} name="masterName" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Технолог</label>
                                <Form.Input value={item.technologistName} name="technologistName" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Работник ПРБ</label>
                                <Form.Input value={item.prbWorkerName} name="prbWorkerName" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Комплектовщик</label>
                                <Form.Input value={item.picker} name="picker" onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Получатель</label>
                                <Form.Input value={item.recipient} name="recipient" onChange={handleInputChange} />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <div style={{ marginTop: '1em', textAlign: 'right' }}>
                    {isLoggedIn &&
                        <Button loading={submitting} positive type="submit" content='Добавить' />
                    }

                    <Button as={Link} to='/routeLists' content="Назад" />
                </div>
            </Form>

        </Segment>
    )
}
