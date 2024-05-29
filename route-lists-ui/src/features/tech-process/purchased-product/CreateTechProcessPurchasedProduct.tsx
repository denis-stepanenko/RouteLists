import { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Grid, Input, Table } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import agent from '../../../app/agent';
import InfiniteScroll from 'react-infinite-scroller';
import { CreateTechProcessPurchasedProduct } from '../../../app/models/CreateTechProcessPurchasedProduct';
import { PickingListProduct } from '../../../app/models/PickingListProduct';
import { Product } from '../../../app/models/Product';
import Spinner from '../../../app/components/Spinner';
import SelectProduct from '../../../app/components/SelectProduct';
import ValidationErrors from '../../../app/components/ValidationErrors';

export default observer(function CreateTechProcessPurchasedProduct() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const { techProcessPurchasedProductStore } = useStore();
    const { setNeedToResetParameters } = techProcessPurchasedProductStore;

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [submitting, setSubmitting] = useState(false);

    const [items, setItems] = useState<PickingListProduct[]>([] as PickingListProduct[]);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState('');
    const [filterText, setFilterText] = useState(filter);
    const [products, setProducts] = useState<PickingListProduct[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [product, setProduct] = useState<Product>();
    const data = {} as CreateTechProcessPurchasedProduct;
    let pageNumber = 1;

    useEffect(() => {
        loadItems();
    }, [pageNumber, filter]);

    useEffect(() => {
        loadProduct();
    }, [])

    async function loadProduct() {
        setLoading(true);

        agent.TechProcesses.get(Number(id))
            .then(techProcess => {
                setProduct({ code: techProcess.productCode, name: techProcess.productName, id: 0, tableId: 0 })
            })
            .finally(() => setLoading(false));
    }

    async function calculatePickingList() {
        items.length = 0;
        pageNumber = 1;
        loadItems();
    }

    function navigateBack() {
        setNeedToResetParameters(false);
        navigate(-1);
    }

    const loadItems = async () => {
        if (!loading) {
            try {
                if (product) {
                    setLoading(true);

                    const result = await agent.Products.getPickingList(product.code, pageNumber, filter);

                    setItems(items.concat(result.data));
                    pageNumber = result.pagination.currentPage + 1;
                    setTotalPages(result.pagination.totalPages);
                }
            } catch (error) {
                throw error;
            } finally {
                setLoading(false);
            }
        }
    }

    function handleFilter() {
        pageNumber = 1;
        setItems([]);
        setFilter(filterText);
    }

    function handleCheckboxChange(value: PickingListProduct) {

        let items = [...products, value];

        if (products.filter(i => i.code === value.code).length > 0) {
            items = items.filter(x => x.code !== value.code);
        }

        setProducts(items);
        data.products = items;
    }

    async function handleSubmit() {
        try {
            setSubmitting(true);
            console.log(data);
            data.techProcessId = Number(id);
            data.products = products;
            await agent.TechProcessPurchasedProducts.create(data);

            navigateBack();
        } catch (error: any) {
            if (error.response.status == 400)
                setErrors(agent.handleValidationErrors(error.response));
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (selectAll)
            setProducts(items);
        else
            setProducts([]);
    }, [selectAll])

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
                            <SelectProduct
                                item={product}
                                onChange={x => setProduct(x.value)}
                                onClear={() => setProduct(undefined)} />
                            <Button onClick={calculatePickingList} content='Рассчитать комплектовочную ведомость' />
                            <Form onSubmit={handleFilter} autoComplete="off" style={{ marginTop: '25px' }}>
                                <Input
                                    fluid icon='search' placeholder='Поиск'
                                    value={filterText}
                                    onChange={(event) => setFilterText(event.target.value)} />
                            </Form>

                            <Checkbox onClick={() => setSelectAll(!selectAll)} label='Выбрать все' style={{ marginTop: '10px' }} />

                            <Table celled size='small'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}></Table.HeaderCell>
                                        <Table.HeaderCell>Код</Table.HeaderCell>
                                        <Table.HeaderCell>Наименование</Table.HeaderCell>
                                        <Table.HeaderCell>Количество</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        items.map(x => (
                                            <Table.Row key={x.code}>
                                                <Table.Cell>
                                                    <Checkbox
                                                        checked={products.filter(i => i.code === x.code).length > 0}
                                                        onChange={() => handleCheckboxChange(x)} />
                                                </Table.Cell>
                                                <Table.Cell>{x.code}</Table.Cell>
                                                <Table.Cell>{x.name}</Table.Cell>
                                                <Table.Cell>{x.count}</Table.Cell>
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

                        {isLoggedIn && (
                            <Button type='button' loading={submitting} onClick={handleSubmit} positive content='Добавить' />
                        )}

                        <Button type='button' onClick={() => navigateBack()} content="Назад" />
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>

    )
})
