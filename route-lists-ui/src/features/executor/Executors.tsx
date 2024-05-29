import { useEffect, useRef, useState } from 'react'
import { Button, Form, Icon, Pagination, Table } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import agent from '../../app/agent';
import { Executor } from '../../app/models/Executor';
import Spinner from '../../app/components/Spinner';
import ConfirmDelete from '../../app/components/ConfirmDelete';

export default observer(function Executors() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [itemForDeletingId, setItemForDeletingId] = useState(0);

    const [items, setItems] = useState<Executor[]>([]);

    const { executorStore } = useStore();
    const { filter, saveScrollPosition, pageNumber, setPageNumber, setFilter } = executorStore;
    const [totalPages, setTotalPages] = useState(0);
    const filterRef = useRef<any>();

    useEffect(() => executorStore.restoreParameters(loadItems), []);

    useEffect(() => executorStore.restoreScrollPosition(items), [items])

    useEffect(() => executorStore.load(loadItems), [pageNumber, filter]);

    const loadItems = async () => {
        setLoading(true);

        agent.Executors.list(pageNumber, filter)
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

        agent.Executors.delete(itemForDeletingId)
            .then(() => loadItems())
            .finally(() => setLoading(false));
    }

    function handleChangePage(page: number) {
        if (page > 0)
            setPageNumber(page);
    }

    if (loading) return <Spinner />

    return (
        <div>
            {isLoggedIn && (
                <Button as={NavLink}
                    to='/createexecutor'
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
                        <Table.HeaderCell>Подразделение</Table.HeaderCell>
                        <Table.HeaderCell>Фамилия</Table.HeaderCell>
                        <Table.HeaderCell>Имя</Table.HeaderCell>
                        <Table.HeaderCell>Отчество</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        items.map(x => (
                            <Table.Row key={x.id}>
                                {isLoggedIn && (
                                    <Table.Cell>

                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Button as={NavLink} to={`/executors/${x.id}`}
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
                                <Table.Cell>{x.department}</Table.Cell>
                                <Table.Cell>{x.firstName}</Table.Cell>
                                <Table.Cell>{x.secondName}</Table.Cell>
                                <Table.Cell>{x.patronymic}</Table.Cell>
                                
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
    )
})
