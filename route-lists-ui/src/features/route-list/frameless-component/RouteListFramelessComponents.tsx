import { useEffect, useRef, useState } from 'react'
import { Button, Form, Grid, Icon, Pagination, Table } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { NavLink, useParams } from 'react-router-dom';
import agent from '../../../app/agent';
import RouteListNavigation from '../RouteListNavigation';
import { RouteListFramelessComponent } from '../../../app/models/RouteListFramelessComponent';
import Spinner from '../../../app/components/Spinner';
import ConfirmDelete from '../../../app/components/ConfirmDelete';

export default observer(function RouteListFramelessComponents() {
    const { id } = useParams();
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [itemForDeletingId, setItemForDeletingId] = useState(0);

    const [items, setItems] = useState<RouteListFramelessComponent[]>([]);
    
    const { routeListFramelessComponentStore } = useStore();
    const { filter, saveScrollPosition, pageNumber, setPageNumber, setFilter } = routeListFramelessComponentStore;
    const [totalPages, setTotalPages] = useState(0);
    const filterRef = useRef<any>();

    useEffect(() => routeListFramelessComponentStore.restoreParameters(loadItems), []);

    useEffect(() => routeListFramelessComponentStore.restoreScrollPosition(items), [items])

    useEffect(() => routeListFramelessComponentStore.load(loadItems), [pageNumber, filter]);

    const loadItems = async () => {
        setLoading(true);

        agent.RouteListFramelessComponents.list(Number(id), pageNumber, filter)
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

        agent.RouteListFramelessComponents.delete(itemForDeletingId)
            .then(() => loadItems())
            .finally(() => setLoading(false));
    }

    function handleChangePage(page: number) {
        if (page > 0)
            setPageNumber(page);
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
                                to={`/createRouteListFramelessComponent/${id}`}
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
                                    <Table.HeaderCell>Код</Table.HeaderCell>
                                    <Table.HeaderCell>Наименование</Table.HeaderCell>
                                    <Table.HeaderCell>Дата выдачи в производство</Table.HeaderCell>
                                    <Table.HeaderCell>Дата герметизации</Table.HeaderCell>
                                    <Table.HeaderCell>Срок до герметизации</Table.HeaderCell>
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
                                                            to={`/updateRouteListFramelessComponent/${x.id}`}
                                                            onClick={saveScrollPosition} positive icon>
                                                            <Icon name='edit' />
                                                        </Button>

                                                        <Button icon onClick={() => {
                                                            setItemForDeletingId(x.id);
                                                            setDeleting(true);
                                                        }}>
                                                            <Icon name='delete' />
                                                        </Button>
                                                    </div>

                                                </Table.Cell>
                                            )}
                                            <Table.Cell>{x.code}</Table.Cell>
                                            <Table.Cell>{x.name}</Table.Cell>
                                            <Table.Cell>{x.dateOfIssueForProduction?.split('T')[0]}</Table.Cell>
                                            <Table.Cell>{x.dateOfSealing?.split('T')[0]}</Table.Cell>
                                            <Table.Cell>{x.daysBeforeSealing}</Table.Cell>
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
