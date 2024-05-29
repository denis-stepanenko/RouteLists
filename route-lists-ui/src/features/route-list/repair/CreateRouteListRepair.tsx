import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Grid, Input, Table } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import agent from '../../../app/agent';
import { Operation } from '../../../app/models/Operation';
import InfiniteScroll from 'react-infinite-scroller';
import Spinner from '../../../app/components/Spinner';
import ValidationErrors from '../../../app/components/ValidationErrors';
import SelectExecutor from '../../../app/components/SelectExecutor';
import { CreateRouteListRepair } from '../../../app/models/CreateRouteListRepair';
import { Executor } from '../../../app/models/Executor';

export default observer(function CreateRouteListRepair() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const { routeListRepairStore } = useStore();
    const { setNeedToResetParameters } = routeListRepairStore;

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>();
    const [submitting, setSubmitting] = useState(false);

    const [items, setItems] = useState<Operation[]>([] as Operation[]);
    const [totalPages, setTotalPages] = useState(0);

    const [data, setData] = useState<CreateRouteListRepair>({
        routeListId: 0,
        reason: '',
        startDate: undefined,
        endDate: undefined,
        date: undefined,
        executorId: 0,
        ids: []
    });

    const [filter, setFilter] = useState('');
    const [filterText, setFilterText] = useState(filter);
    let pageNumber = 1;

    const [executor, setExecutor] = useState<Executor>();

    useEffect(() => {
        loadItems();
    }, [pageNumber, filter]);

    function navigateBack() {
        setNeedToResetParameters(false);
        navigate(-1);
    }

    const loadItems = async () => {
        if (!loading) {
            setLoading(true);
            agent.Operations.list(pageNumber, filter)
                .then(result => {
                    setItems(items.concat(result.data));
                    pageNumber = result.pagination.currentPage + 1;
                    setTotalPages(result.pagination.totalPages);
                })
                .finally(() => setLoading(false));
        }
    }

    function handleFilter() {
        pageNumber = 1;
        setItems([]);
        setFilter(filterText);
    }

    function handleCheckboxChange(value?: string) {
        if (value) {
            let items = [...data.ids, value];

            if (data.ids.includes(value)) {
                items = items.filter(x => x !== value);
            }

            data.ids = items;
        }
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
            await agent.RouteListRepairs.create(data);

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
                                <Input
                                    fluid icon='search' placeholder='Поиск'
                                    value={filterText}
                                    onChange={(event) => setFilterText(event.target.value)} />
                            </Form>

                            <Table celled size='small'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}></Table.HeaderCell>
                                        <Table.HeaderCell>Подразделение</Table.HeaderCell>
                                        <Table.HeaderCell>Код</Table.HeaderCell>
                                        <Table.HeaderCell>Наименование</Table.HeaderCell>
                                        <Table.HeaderCell>Группа</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        items.map(x => (
                                            <Table.Row key={x.id}>
                                                <Table.Cell>
                                                    <Checkbox value={x.id} defaultChecked={data.ids.includes(x.id.toString())} onChange={(_e, data) => handleCheckboxChange(data.value?.toString())} />
                                                </Table.Cell>
                                                <Table.Cell>{x.department}</Table.Cell>
                                                <Table.Cell>{x.code}</Table.Cell>
                                                <Table.Cell>{x.name}</Table.Cell>
                                                <Table.Cell>{x.groupName}</Table.Cell>
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
                                <label>Причина</label>
                                <Form.Input name='reason' value={data.reason ?? ''} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Дата</label>
                                <Form.Input type='date' name='date' value={data.date?.split('T')[0] ?? ''} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Дата начала</label>
                                <Form.Input type='date' name='startDate' value={data.startDate?.split('T')[0] ?? ''} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Дата окончания</label>
                                <Form.Input type='date' name='endDate' value={data.endDate?.split('T')[0] ?? ''} onChange={handleInputChange} />
                            </Form.Field>

                            <Form.Field>
                                <label>Исполнитель</label>

                                <SelectExecutor
                                    item={executor}
                                    onChange={(x) => {
                                        data.executorId = x.value.id
                                        setExecutor(x.value)
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
