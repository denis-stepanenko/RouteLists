import { useEffect, useRef, useState } from 'react'
import { Button, Form, Grid, Icon, Pagination, Table } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { NavLink, useParams } from 'react-router-dom';
import agent from '../../../app/agent';
import { RouteListOperation } from '../../../app/models/RouteListOperation';
import RouteListNavigation from '../RouteListNavigation';
import Spinner from '../../../app/components/Spinner';
import ConfirmDelete from '../../../app/components/ConfirmDelete';

export default observer(function RouteListOperations() {
    const { id } = useParams();
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [itemForDeletingId, setItemForDeletingId] = useState(0);

    const [items, setItems] = useState<RouteListOperation[]>([]);

    const { routeListOperationStore } = useStore();
    const { filter, saveScrollPosition, pageNumber, setPageNumber, setFilter } = routeListOperationStore;
    const [totalPages, setTotalPages] = useState(0);
    const filterRef = useRef<any>();

    useEffect(() => routeListOperationStore.restoreParameters(loadItems), []);

    useEffect(() => routeListOperationStore.restoreScrollPosition(items), [items])

    useEffect(() => routeListOperationStore.load(loadItems), [pageNumber, filter]);

    const loadItems = async () => {
        setLoading(true);

        agent.RouteListOperations.list(Number(id), pageNumber, filter)
            .then(result => {
                setItems(result.data);
                setTotalPages(result.pagination.totalPages);
            })
            .finally(() => setLoading(false));
    }

    function handleFilter() {
        setPageNumber(1);
        setFilter(filterRef.current.value);
    }

    async function handleDelete() {
        setLoading(true);

        agent.RouteListOperations.delete(itemForDeletingId)
            .then(() => loadItems())
            .finally(() => setLoading(false));
    }

    function handleChangePage(page: number) {
        if (page > 0)
            setPageNumber(page);
    }

    async function handleMoveUp(id: number) {
        let item = items.find(x => x.id === id);

        if (item) {
            let index = items.indexOf(item);

            let previousItem = items[index - 1];

            if (previousItem !== undefined) {
                setLoading(true);

                agent.RouteListOperations.swap(item.id, previousItem.id)
                    .then(() => loadItems())
                    .finally(() => setLoading(false));
            }
        }
    }

    async function handleMoveDown(id: number) {
        let item = items.find(x => x.id === id);

        if (item) {
            let index = items.indexOf(item);

            let nextItem = items[index + 1];

            if (nextItem !== undefined) {
                setLoading(true);

                agent.RouteListOperations.swap(item.id, nextItem.id)
                    .then(() => loadItems())
                    .finally(() => setLoading(false));
            }
        }
    }

    if (loading) return <Spinner />

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={3}>
                    <RouteListNavigation />
                </Grid.Column>

                <Grid.Column width={12}>
                    <div style={{ overflowX: 'auto' }}>
                        {isLoggedIn && (
                            <Button as={NavLink}
                                to={`/createRouteListOperation/${id}`}
                                content='Добавить'
                                positive
                                style={{ marginBottom: 10 }} />
                        )}

                        <ConfirmDelete
                            onClose={() => setDeleting(false)}
                            onOpen={() => setDeleting(true)}
                            isOpen={deleting}
                            onDelete={handleDelete} />

                        <Form onSubmit={handleFilter} autoComplete="off">
                            <Form.Input fluid icon='search' placeholder='Поиск' defaultValue={filter} ref={filterRef} />
                        </Form>

                        <Table celled size='small'>
                            <Table.Header>
                                <Table.Row>
                                    {isLoggedIn && <Table.HeaderCell width={1}></Table.HeaderCell>}
                                    <Table.HeaderCell>Номер в тех. процессе</Table.HeaderCell>
                                    <Table.HeaderCell>Код</Table.HeaderCell>
                                    <Table.HeaderCell>Наименование</Table.HeaderCell>
                                    <Table.HeaderCell>Цех</Table.HeaderCell>
                                    <Table.HeaderCell>Примечание</Table.HeaderCell>
                                    {/* <Table.HeaderCell>Исполнитель</Table.HeaderCell> */}
                                    {/* <Table.HeaderCell>Позиция</Table.HeaderCell> */}
                                    {/* <Table.HeaderCell>Трудоемкость</Table.HeaderCell> */}
                                    <Table.HeaderCell>Количество</Table.HeaderCell>
                                    <Table.HeaderCell>Тип</Table.HeaderCell>
                                    {/* <Table.HeaderCell>Дата начала</Table.HeaderCell> */}
                                    {/* <Table.HeaderCell>Дата окончания</Table.HeaderCell> */}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    items.map(x => (
                                        <Table.Row key={x.id}>
                                            {isLoggedIn && (
                                                <Table.Cell>

                                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                        <Button as={NavLink}
                                                            to={`/updateRouteListOperation/${x.id}`}
                                                            onClick={saveScrollPosition} positive icon>
                                                            <Icon name='edit' />
                                                        </Button>

                                                        <Button icon onClick={() => {
                                                            setItemForDeletingId(x.id);
                                                            setDeleting(true);
                                                        }}>
                                                            <Icon name='delete' />
                                                        </Button>

                                                        <Button icon onClick={() => handleMoveUp(x.id)}>
                                                            <Icon name='arrow up' />
                                                        </Button>

                                                        <Button icon onClick={() => handleMoveDown(x.id)}>
                                                            <Icon name='arrow down' />
                                                        </Button>

                                                    </div>

                                                </Table.Cell>
                                            )}
                                            <Table.Cell>{x.number}</Table.Cell>
                                            <Table.Cell>{x.code}</Table.Cell>
                                            <Table.Cell>{x.name}</Table.Cell>
                                            <Table.Cell>{x.department}</Table.Cell>
                                            <Table.Cell>{x.description}</Table.Cell>
                                            {/* <Table.Cell>{x.executor}</Table.Cell> */}
                                            {/* <Table.Cell>{x.position}</Table.Cell> */}
                                            {/* <Table.Cell>{x.labor}</Table.Cell> */}
                                            <Table.Cell>{x.count}</Table.Cell>
                                            <Table.Cell>{x.type}</Table.Cell>
                                            {/* <Table.Cell>{x.startDate}</Table.Cell> */}
                                            {/* <Table.Cell>{x.endDate}</Table.Cell> */}

                                        </Table.Row>
                                    ))
                                }
                            </Table.Body>
                        </Table>

                        <Pagination
                            totalPages={totalPages}
                            activePage={pageNumber}
                            onPageChange={(_e, { activePage }) => handleChangePage(Number(activePage))}
                        />
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
})
