import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Grid, Table } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import agent from '../../../app/agent';
import InfiniteScroll from 'react-infinite-scroller';
import { Product } from '../../../app/models/Product';
import { CreateRouteListReplacedComponent } from '../../../app/models/CreateRouteListReplacedComponent';
import Spinner from '../../../app/components/Spinner';
import ValidationErrors from '../../../app/components/ValidationErrors';
import SelectExecutor from '../../../app/components/SelectExecutor';
import { Executor } from '../../../app/models/Executor';

export default observer(function CreateRouteListReplacedComponent() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const { routeListReplacedComponentStore } = useStore();
    const { setNeedToResetParameters } = routeListReplacedComponentStore;

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [submitting, setSubmitting] = useState(false);

    const [items, setItems] = useState<Product[]>([] as Product[]);
    const [totalPages, setTotalPages] = useState(0);

    const [data, setData] = useState<CreateRouteListReplacedComponent>({
        routeListId: 0,
        factoryNumber: '',
        replacementReason: '',
        date: undefined,
        executorId: 0,
        products: []
    } as CreateRouteListReplacedComponent);

    let pageNumber = 1;
    const [filter, setFilter] = useState<string>('');
    const [filterText, setFilterText] = useState(filter);

    const [executor, setExecutor] = useState<Executor>();

    useEffect(() => {
        loadItems();
    }, [pageNumber, filter]);

    const loadItems = async () => {
        if (!loading) {
            setLoading(true);

            agent.Products.getProducts(pageNumber, filter)
                .then(result => {
                    setItems(items.concat(result.data));
                    pageNumber = result.pagination.currentPage + 1;
                    setTotalPages(result.pagination.totalPages);
                })
                .finally(() => setLoading(false));
        }
    }

    function navigateBack() {
        setNeedToResetParameters(false);
        navigate(-1);
    }

    function handleFilter() {
        pageNumber = 1;
        setItems([]);
        setFilter(filterText);
    }

    function handleCheckboxChange(product: Product) {
        let items = [...data.products, product];

        if (data.products.filter(i => i.id === product.id && i.tableId === product.tableId).length > 0) {
            items = items.filter(i => !(i.id == product.id && i.tableId == product.tableId));
        }

        data.products = items;
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;

        if (value !== '')
            setData({ ...data, [name]: value });
        else
            setData({ ...data, [name]: undefined });
    }

    async function handleSubmit() {
        try {
            setSubmitting(true);

            data.routeListId = Number(id);
            await agent.RouteListReplacedComponents.create(data);

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

        <Grid>
            <Grid.Row>
                <Grid.Column width={12}>
                    <InfiniteScroll
                        hasMore={pageNumber < totalPages && !loading}
                        loadMore={loadItems}
                    >
                        <div>
                            <Form onSubmit={handleFilter} autoComplete="off">
                                <Form.Input 
                                    fluid icon='search' placeholder='Поиск'
                                    value={filterText}
                                    onChange={(event) => setFilterText(event.target.value)} content='dsdfsd'
                                     />
                            </Form>

                            <Table celled size='small'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}></Table.HeaderCell>
                                        <Table.HeaderCell>Код</Table.HeaderCell>
                                        <Table.HeaderCell>Наименование</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        items.map(x => (
                                            <Table.Row key={x.id}>
                                                <Table.Cell>
                                                    <Checkbox
                                                        defaultChecked={data.products.filter(i => i.id === x.id && i.tableId === x.tableId).length > 0}
                                                        onChange={() => handleCheckboxChange(x)} />
                                                </Table.Cell>
                                                <Table.Cell>{x.code}</Table.Cell>
                                                <Table.Cell>{x.name}</Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                </Table.Body>
                            </Table>

                        </div>
                    </InfiniteScroll>
                </Grid.Column>

                <Grid.Column width={4}>
                    <div>
                        {errors && <ValidationErrors errors={errors} />}

                        <Form onSubmit={handleSubmit} autoComplete='off'>

                            <Form.Field>
                                <label>Заводской номер</label>
                                <Form.Input name='factoryNumber' value={data.factoryNumber ?? ''} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Причина замены</label>
                                <Form.TextArea name='replacementReason' value={data.replacementReason ?? ''} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Дата</label>
                                <Form.Input name='date' type='date' value={data.date?.split('T')[0] ?? ''} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Исполнитель</label>

                                <SelectExecutor
                                    item={executor}
                                    onChange={(x) => {
                                        data.executorId = x.value.id
                                        setExecutor(x.value);
                                    }} />
                            </Form.Field>

                            {isLoggedIn && (
                                <Button type='submit' loading={submitting} positive content='Добавить' />
                            )}

                            <Button type='button' onClick={() => navigateBack()} content="Назад" />
                        </Form>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>

    )
})
